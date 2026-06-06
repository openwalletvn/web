const baseUrl = () => process.env.LANGFUSE_BASE_URL ?? 'https://cloud.langfuse.com';

function basicAuth(): string {
    return 'Basic ' + btoa(
        `${process.env.LANGFUSE_PUBLIC_KEY}:${process.env.LANGFUSE_SECRET_KEY}`
    );
}

// ─── Prompt management ────────────────────────────────────────────────────────

interface PromptCache {
    text: string;
    version: number;
    fetchedAt: number;
}

let promptCache: PromptCache | null = null;
const PROMPT_TTL_MS = 60_000;

export async function fetchSystemPrompt(): Promise<{ text: string; version: number }> {
    if (promptCache && Date.now() - promptCache.fetchedAt < PROMPT_TTL_MS) {
        return { text: promptCache.text, version: promptCache.version };
    }

    try {
        const res = await fetch(
            `${baseUrl()}/api/public/v2/prompts/chat-system-prompt?label=production`,
            { headers: { Authorization: basicAuth() } }
        );
        if (!res.ok) throw new Error(`Langfuse prompt fetch failed: ${res.status}`);
        const data = await res.json() as { prompt: string; version: number };
        promptCache = { text: data.prompt, version: data.version, fetchedAt: Date.now() };
        return { text: data.prompt, version: data.version };
    } catch {
        // fallback: return cached if exists, else null signals caller to use hardcoded
        if (promptCache) return { text: promptCache.text, version: promptCache.version };
        return { text: '', version: 0 };
    }
}

// ─── Tracing ──────────────────────────────────────────────────────────────────

export interface ChatTraceOptions {
    input: string;
    output: string;
    model: string;
    tokens: { input: number; output: number };
    latencyMs: number;
    finishReason: string;
    steps: number;
    promptVersion?: number;
    userId?: string;
    sessionId?: string;
}

export async function sendChatTrace(opts: ChatTraceOptions): Promise<void> {
    await fetch(`${baseUrl()}/api/public/ingestion`, {
        method: 'POST',
        headers: {
            'Authorization': basicAuth(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            batch: [{
                id: crypto.randomUUID(),
                type: 'trace-create',
                timestamp: new Date().toISOString(),
                body: {
                    id: crypto.randomUUID(),
                    name: 'chat',
                    input: opts.input,
                    output: opts.output,
                    usage: {
                        input: opts.tokens.input,
                        output: opts.tokens.output,
                        total: opts.tokens.input + opts.tokens.output,
                        unit: 'TOKENS',
                    },
                    ...(opts.userId ? { userId: opts.userId } : {}),
                    ...(opts.sessionId ? { sessionId: opts.sessionId } : {}),
                    metadata: {
                        model: opts.model,
                        tokens: opts.tokens,
                        latencyMs: opts.latencyMs,
                        finishReason: opts.finishReason,
                        steps: opts.steps,
                        promptVersion: opts.promptVersion,
                    },
                    tags: ['web-chat'],
                },
            }],
        }),
    });
}
