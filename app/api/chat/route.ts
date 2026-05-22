import { createGroq } from '@ai-sdk/groq';
import { createMCPClient } from '@ai-sdk/mcp';
import { streamText, stepCountIs, convertToModelMessages, type UIMessage, type ToolSet } from 'ai';
import { buildSystemPrompt } from '@/lib/chat/system-prompt';
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

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

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

    const model = process.env.CHAT_MODEL ?? 'llama-3.3-70b-versatile';

    let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | null = null;
    let tools: ToolSet | undefined;

    try {
        mcpClient = await createMCPClient({
            transport: {
                type: 'http',
                url: process.env.OPENWALLET_MCP_URL ?? 'http://localhost:8787',
                headers: {
                    'x-mcp-key': process.env.OPENWALLET_MCP_KEY ?? '',
                },
            },
        });
        tools = await mcpClient.tools();
    } catch (err) {
        console.error('[chat] MCP init failed:', err);
    }

    try {
        const result = streamText({
            model: groq(model),
            system: buildSystemPrompt(body.pageContext),
            messages,
            stopWhen: stepCountIs(5),
            tools,
            onFinish: async () => {
                await mcpClient?.close();
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
