import { createOpenAI } from '@ai-sdk/openai';
import { createMCPClient } from '@ai-sdk/mcp';
import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { buildSystemPrompt } from '@/lib/chat/system-prompt';
import { fetchSystemPrompt, sendChatTrace } from '@/lib/langfuse';
import { isAllowedModel, getDefaultModel, getModelById } from '@/lib/chat/models';
import type { PageContext } from '@/lib/chat/page-context';
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

export async function POST(req: Request) {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    if (!checkRateLimit(ip)) {
        return new Response(
            JSON.stringify({ error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const body = await req.json() as { messages?: UIMessage[]; pageContext?: PageContext; userId?: string; sessionId?: string; config?: { modelName?: string } };
    const uiMessages: UIMessage[] = body.messages ?? [];
    const messages = await convertToModelMessages(uiMessages);

    const requestedModel = body.config?.modelName;
    const model = isAllowedModel(requestedModel) ? requestedModel! : getDefaultModel().id;
    const startTime = Date.now();
    const lastUserMessage = uiMessages.findLast((m) => m.role === 'user')?.parts
        ?.filter((p) => p.type === 'text').map((p) => p.text).join('') ?? '';

    const { text: promptText, version: promptVersion } = await fetchSystemPrompt();

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

        const result = streamText({
            model: openrouter(model),
            system: buildSystemPrompt(body.pageContext, promptText || undefined),
            messages,
            stopWhen: stepCountIs(5),
            tools,
            onFinish: async ({ usage, text, finishReason, steps }) => {
                await mcpClient?.close();
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
                await sendChatTrace({
                    input: lastUserMessage,
                    output: text,
                    model,
                    tokens: {
                        input: usage?.inputTokens ?? 0,
                        output: usage?.outputTokens ?? 0,
                    },
                    latencyMs: Date.now() - startTime,
                    finishReason: finishReason ?? 'unknown',
                    steps: steps?.length ?? 0,
                    promptVersion,
                    userId: body.userId,
                    sessionId: body.sessionId,
                });
            },
            onError: async ({ error }) => {
                console.error('[chat] streamText error:', error);
                await mcpClient?.close();
            },
        });

        result.consumeStream(); // no await — ensures onFinish fires even if client disconnects

        return result.toUIMessageStreamResponse({
            messageMetadata: ({ part }) => {
                if (part.type === 'finish') return { custom: { usage: part.totalUsage } };
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
