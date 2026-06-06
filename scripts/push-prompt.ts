/**
 * Push full system prompt → Langfuse as 'chat-system-prompt' (label: production).
 * Uses getSystemPrompt() - same SSOT as the chat route - so Langfuse reflects exactly what the LLM receives.
 * Run: pnpm push:prompt
 *
 * Requires LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_BASE_URL in .env.local
 */
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY ?? '';
const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY ?? '';
const LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL ?? 'https://cloud.langfuse.com';

if (!LANGFUSE_PUBLIC_KEY || !LANGFUSE_SECRET_KEY) {
    console.error('Missing LANGFUSE_PUBLIC_KEY or LANGFUSE_SECRET_KEY in .env.local');
    process.exit(1);
}

const auth = 'Basic ' + Buffer.from(`${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`).toString('base64');

async function main() {
    // Import after env is loaded so LANGFUSE_* vars are set (fetchSystemPrompt reads them)
    // Pass no pageContext - push base prompt only, no page-specific context
    const { getSystemPrompt } = await import('@/lib/chat/system-prompt');
    const { text: promptText } = await getSystemPrompt();

    console.log(`Pushing chat-system-prompt to ${LANGFUSE_BASE_URL}`);
    console.log(`Length: ${promptText.length} chars`);

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
    } else {
        console.error(`✗ Failed ${res.status}: ${JSON.stringify(body)}`);
        process.exit(1);
    }
}

main().catch((err) => { console.error(err); process.exit(1); });
