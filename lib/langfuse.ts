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
        if (promptCache) return { text: promptCache.text, version: promptCache.version };
        return { text: '', version: 0 };
    }
}

// ─── User feedback scores ─────────────────────────────────────────────────────

export async function postFeedbackScore(traceId: string, value: 0 | 1, comment?: string): Promise<void> {
    await fetch(`${baseUrl()}/api/public/scores`, {
        method: 'POST',
        headers: {
            'Authorization': basicAuth(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            traceId,
            name: 'user-feedback',
            value,
            dataType: 'NUMERIC',
            ...(comment ? { comment } : {}),
        }),
    });
}
