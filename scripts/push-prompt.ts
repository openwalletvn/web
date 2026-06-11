/**
 * Push system prompt → Langfuse as 'chat-system-prompt' (label: production).
 * Builds full prompt via buildLocalPrompt() (slots filled with live data), compares
 * with current Langfuse version, and skips push if unchanged.
 * Run: pnpm push:prompt
 *
 * Requires LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_BASE_URL in env
 */
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY ?? '';
const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY ?? '';
const LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL ?? 'https://cloud.langfuse.com';

if (!LANGFUSE_PUBLIC_KEY || !LANGFUSE_SECRET_KEY) {
    console.error('Missing LANGFUSE_PUBLIC_KEY or LANGFUSE_SECRET_KEY in env');
    process.exit(1);
}

const auth = 'Basic ' + Buffer.from(`${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`).toString('base64');

async function fetchCurrentPrompt(): Promise<string | null> {
    try {
        const res = await fetch(
            `${LANGFUSE_BASE_URL}/api/public/v2/prompts/chat-system-prompt?label=production`,
            { headers: { Authorization: auth } },
        );
        if (!res.ok) return null;
        const data = await res.json() as { prompt: string };
        return data.prompt;
    } catch {
        return null;
    }
}

async function main() {
    const { buildLocalPrompt } = await import('@/lib/chat/system-prompt');
    const promptText = await buildLocalPrompt();

    console.log(`Built prompt: ${promptText.length} chars`);

    const current = await fetchCurrentPrompt();
    if (current === promptText) {
        console.log('✓ Prompt unchanged, skipping push');
        return;
    }

    console.log(current === null ? 'No existing prompt found, pushing...' : 'Prompt changed, pushing...');

    const res = await fetch(`${LANGFUSE_BASE_URL}/api/public/v2/prompts`, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'chat-system-prompt',
            prompt: promptText,
            type: 'text',
            labels: ['production'],
            config: { model: process.env.CHAT_MODEL ?? process.env.DEFAULT_MODEL },
        }),
    });

    const body = await res.json() as { version?: number; id?: string; labels?: string[]; message?: string };

    if (res.ok) {
        console.log(`✓ Pushed version ${body.version} (id: ${body.id})`);
        console.log(`  Labels: ${body.labels?.join(', ')}`);
        console.log(`  View: ${LANGFUSE_BASE_URL}/prompts/chat-system-prompt`);
        // Signal to CI that a new version was pushed
        console.log(`::pushed::version=${body.version}`);
    } else {
        console.error(`✗ Failed ${res.status}: ${JSON.stringify(body)}`);
        process.exit(1);
    }
}

main().catch((err) => { console.error(err); process.exit(1); });
