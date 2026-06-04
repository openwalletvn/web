import { createOpenAI } from '@ai-sdk/openai';
import { createMCPClient } from '@ai-sdk/mcp';
import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { after } from 'next/server';
import { buildSystemPrompt } from '@/lib/chat/system-prompt';
import { fetchSystemPrompt, sendChatTrace } from '@/lib/langfuse';
import type { PageContext } from '@/lib/chat/page-context';

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

    const body = await req.json() as { messages?: UIMessage[]; pageContext?: PageContext };
    const uiMessages: UIMessage[] = body.messages ?? [];
    const messages = await convertToModelMessages(uiMessages.slice(-12));

    const model = process.env.CHAT_MODEL ?? 'google/gemini-flash-1.5';
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
                after(async () => {
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
                    });
                });
            },
            onError: async ({ error }) => {
                console.error('[chat] streamText error:', error);
                await mcpClient?.close();
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (err) {
        console.error('[chat] fatal error:', err);
        await mcpClient?.close();
        return new Response(
            JSON.stringify({ error: String(err) }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
