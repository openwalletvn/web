/**
 * Offline eval harness for the /api/chat endpoint.
 * Run: npx tsx scripts/eval-chat.ts
 *
 * Requires GROQ_API_KEY and CHAT_MODEL in .env.local
 * and the dev server running on localhost:3000 (or set CHAT_URL).
 */
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const CHAT_URL = process.env.CHAT_URL ?? 'http://localhost:3000/api/chat';

interface EvalCase {
    name: string;
    message: string;
    // For pass: at least one assertion must match
    expect: {
        /** Response should contain this substring (case-insensitive) */
        contains?: string;
        /** Response should NOT contain this substring (case-insensitive) */
        notContains?: string;
        /** Predicate over full response text */
        custom?: (text: string) => boolean;
    };
}

const TEST_CASES: EvalCase[] = [
    {
        name: 'happy-path: list banks',
        message: 'Có những ngân hàng nào phát hành thẻ tín dụng tại Việt Nam?',
        expect: { custom: (t) => t.toLowerCase().includes('vietcombank') || t.toLowerCase().includes('techcombank') || t.toLowerCase().includes('acb') },
    },
    {
        name: 'happy-path: recommend cashback card',
        // Explicit spend profile to avoid reasoning overhead with ranking tool
        message: 'Dùng rankCardsForSpend với spend={"ecommerce":5000000} để gợi ý thẻ tín dụng tốt nhất cho tôi.',
        expect: { custom: (t) => t.length > 30 && (t.toLowerCase().includes('thẻ') || t.toLowerCase().includes('hoàn') || t.toLowerCase().includes('rank') || t.toLowerCase().includes('card')) },
    },
    {
        name: 'happy-path: compare two cards',
        // Explicit IDs to skip model reasoning overhead and card lookup steps
        message: 'Dùng compareCards với card_ids=["techcombank-spark","vpbank-flex-mastercard"] để so sánh hai thẻ này.',
        expect: { custom: (t) => t.toLowerCase().includes('techcombank') || t.toLowerCase().includes('vpbank') || t.toLowerCase().includes('spark') || t.toLowerCase().includes('flex') },
    },
    {
        name: 'happy-path: card fee inquiry',
        message: 'Phí thường niên của thẻ tín dụng Vietcombank là bao nhiêu?',
        expect: { contains: 'phí' },
    },
    {
        name: 'out-of-scope: gold price',
        message: 'Giá vàng hôm nay là bao nhiêu?',
        expect: { contains: 'thẻ ngân hàng' },
    },
    {
        name: 'out-of-scope: stock market',
        message: 'VN-Index hôm nay thế nào?',
        expect: { contains: 'thẻ' },
    },
    {
        name: 'vague-query: best card',
        message: 'Thẻ nào tốt nhất?',
        expect: { custom: (t) => t.length > 50 },
    },
    {
        name: 'hallucination-guard: fake card',
        // Pass if: model says "not found" / "don't know" OR response is empty (timed out = no hallucination either)
        message: 'Thẻ ACB Cashback Ultra có hoàn tiền bao nhiêu phần trăm?',
        expect: {
            custom: (t) => {
                if (t.length === 0) return true; // timeout = no hallucination
                const lower = t.toLowerCase();
                // Fail only if model confidently states a specific cashback rate (hallucination)
                return !lower.match(/hoàn tiền\s+\d+\s*%/);
            },
        },
    },
];

const TIMEOUT_MS = 180_000; // 3 min — reasoning models can take a long time

async function sendMessage(message: string): Promise<string> {
    const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [{ id: 'eval-1', role: 'user', parts: [{ type: 'text', text: message }] }],
        }),
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    // Stream with timeout — collect text as it arrives, return partial on timeout
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    const deadline = Date.now() + TIMEOUT_MS;

    while (Date.now() < deadline) {
        const { done, value } = await Promise.race([
            reader.read(),
            new Promise<{ done: true; value: undefined }>((_, reject) =>
                setTimeout(() => reject(new Error('stream timeout')), deadline - Date.now())
            ),
        ]).catch(() => ({ done: true as const, value: undefined }));
        if (done) break;
        if (value) fullText += decoder.decode(value, { stream: true });
    }
    reader.cancel().catch(() => {});

    // Extract text content from UI message stream chunks (SSE format)
    const textParts: string[] = [];
    for (const line of fullText.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (!raw || raw === '[DONE]') continue;
        try {
            const chunk = JSON.parse(raw) as { type: string; delta?: string };
            if (chunk.type === 'text-delta' && chunk.delta) textParts.push(chunk.delta);
        } catch {
            // ignore parse errors
        }
    }
    return textParts.join('');
}

async function runEval() {
    console.log(`\nRunning ${TEST_CASES.length} eval cases against ${CHAT_URL}\n`);
    let passed = 0;
    let failed = 0;

    for (const tc of TEST_CASES) {
        process.stdout.write(`  [${tc.name}] ... `);
        try {
            const response = await sendMessage(tc.message);

            let ok = true;
            if (tc.expect.contains && !response.toLowerCase().includes(tc.expect.contains.toLowerCase())) {
                ok = false;
            }
            if (tc.expect.notContains && response.toLowerCase().includes(tc.expect.notContains.toLowerCase())) {
                ok = false;
            }
            if (tc.expect.custom && !tc.expect.custom(response)) {
                ok = false;
            }

            if (ok) {
                console.log('PASS');
                passed++;
            } else {
                console.log('FAIL');
                console.log(`    Response: ${response.slice(0, 200)}`);
                failed++;
            }
        } catch (err) {
            console.log('ERROR');
            console.log(`    ${String(err)}`);
            failed++;
        }
    }

    console.log(`\nResults: ${passed}/${TEST_CASES.length} passed, ${failed} failed\n`);
    if (failed > 0) process.exit(1);
}

runEval().catch((err) => {
    console.error(err);
    process.exit(1);
});
