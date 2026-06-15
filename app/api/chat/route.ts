import { createOpenAI } from '@ai-sdk/openai';
import { createMCPClient } from '@ai-sdk/mcp';
import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { after } from 'next/server';
import { observe, propagateAttributes, setActiveTraceIO, getActiveTraceId } from '@langfuse/tracing';
import { trace } from '@opentelemetry/api';
import { getSystemPrompt } from '@/lib/chat/system-prompt';
import { isAllowedModel, getDefaultModel, isPaidModel } from '@/lib/chat/models'
import { tokensToCreditCost } from '@/lib/credits'
import { getUserFromDb, getTier, logCreditUsage, deductCredits } from '@/lib/neon-db'
import type { PageContext } from '@/lib/chat/page-context';
import { langfuseSpanProcessor } from '@/instrumentation';
import { auth } from '@/lib/auth/server';
import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');

function appendChatLog(entry: Record<string, unknown>, sessionId?: string) {
    if (process.env.NODE_ENV !== 'development') return;
    try {
        fs.mkdirSync(LOG_DIR, { recursive: true });
        const filename = sessionId ? `chat-${sessionId}.log` : 'chat-unknown.log';
        fs.appendFileSync(path.join(LOG_DIR, filename), JSON.stringify(entry) + '\n');
    } catch {
        // non-fatal
    }
}

// In-memory rate limit store: ip -> { count, windowStart }
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, windowStart: now });
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX) return false;
    entry.count++;
    return true;
}

const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

const handler = async (req: Request) => {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    if (!checkRateLimit(ip)) {
        return new Response(
            JSON.stringify({ error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { data: session } = await auth.getSession();
    const dbUser = session ? await getUserFromDb(session.user.id) : null;

    const body = await req.json() as { messages?: UIMessage[]; pageContext?: PageContext; userId?: string; sessionId?: string; config?: { modelName?: string } };
    const uiMessages: UIMessage[] = body.messages ?? [];
    const messages = await convertToModelMessages(uiMessages);

    // traceUserId: prefer pseudonymous trace_id from DB; fall back to anon body.userId
    const traceUserId = dbUser?.trace_id ?? body.userId;

    const requestedModel = body.config?.modelName;
    const model = isAllowedModel(requestedModel) ? requestedModel! : getDefaultModel().id;

    // Server-side paid model guard (UI also disables, this is the safety net)
    if (isPaidModel(model)) {
        const tier = dbUser ? await getTier(dbUser.tier) : null
        const canUsePaidModel = tier?.can_use_paid_model ?? false
        const hasCredits = dbUser ? Number(dbUser.bonus_credits) > 0 : false
        if (!canUsePaidModel || !hasCredits) {
            return new Response(
                JSON.stringify({ error: 'Bạn không đủ credits để dùng model này.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }
    }
    const startTime = Date.now();
    const lastUserMessage = uiMessages.findLast((m) => m.role === 'user')?.parts
        ?.filter((p) => p.type === 'text').map((p) => p.text).join('') ?? '';

    const { text: systemPrompt, version: promptVersion } = await getSystemPrompt(body.pageContext);
    const messageCount = uiMessages.length;

    setActiveTraceIO({ input: lastUserMessage });

    return await propagateAttributes(
        {
            traceName: 'chat',
            sessionId: body.sessionId,
            userId: traceUserId,
            tags: ['web-chat'],
            metadata: { model, ip, promptVersion: String(promptVersion), messageCount: String(messageCount) },
        },
        async () => {
            let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | null = null;

            try {
                mcpClient = await createMCPClient({
                    transport: {
                        type: 'http',
                        url: process.env.OPENWALLET_MCP_URL ?? 'http://localhost:8001',
                        headers: {
                            'x-mcp-key': process.env.OPENWALLET_MCP_KEY ?? '',
                        },
                    },
                });

                const tools = await mcpClient.tools();
                const traceId = getActiveTraceId();

                const result = streamText({
                    model: openrouter(model),
                    system: systemPrompt,
                    messages,
                    stopWhen: stepCountIs(5),
                    tools,
                    experimental_telemetry: { isEnabled: true },
                    onFinish: async ({ usage, text, finishReason, steps }) => {
                        await mcpClient?.close();

                        setActiveTraceIO({ output: text });
                        trace.getActiveSpan()?.end();

                        appendChatLog({
                            ts: new Date().toISOString(),
                            sessionId: body.sessionId,
                            userId: body.userId,
                            ip,
                            model,
                            messages: uiMessages.slice(-12),
                            steps: steps?.map((s) => ({
                                text: s.text,
                                toolCalls: s.toolCalls,
                                toolResults: s.toolResults,
                            })),
                            finalText: text,
                            inputTokens: usage?.inputTokens ?? 0,
                            outputTokens: usage?.outputTokens ?? 0,
                            latencyMs: Date.now() - startTime,
                            finishReason: finishReason ?? 'unknown',
                        }, body.sessionId);

                        // Credit logging + deduction (fire-and-forget via after())
                        if (dbUser) {
                            const inputTokens = usage?.inputTokens ?? 0
                            const outputTokens = usage?.outputTokens ?? 0
                            const creditsUsed = isPaidModel(model)
                                ? tokensToCreditCost(inputTokens, outputTokens)
                                : 0
                            after(async () => {
                                await logCreditUsage(dbUser.id, model, inputTokens, outputTokens, creditsUsed)
                                if (creditsUsed > 0) {
                                    await deductCredits(dbUser.id, creditsUsed)
                                }
                            })
                        }
                    },
                    onError: async ({ error }) => {
                        console.error('[chat] streamText error:', error);
                        await mcpClient?.close();
                        trace.getActiveSpan()?.end();
                    },
                });

                result.consumeStream(); // no await - ensures onFinish fires even if client disconnects

                after(async () => await langfuseSpanProcessor.forceFlush());

                return result.toUIMessageStreamResponse({
                    messageMetadata: ({ part }) => {
                        if (part.type === 'finish') return { custom: { usage: part.totalUsage, traceId } };
                        if (part.type === 'finish-step') return { modelId: part.response.modelId };
                        return undefined;
                    },
                });
            } catch (err) {
                console.error('[chat] fatal error:', err);
                await mcpClient?.close();
                return new Response(
                    JSON.stringify({ error: String(err) }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }
    );
};

export const POST = observe(handler, {
    name: 'handle-chat-message',
    endOnExit: false,
});
