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
        message: 'Tôi chi 5 triệu/tháng mua sắm online. Thẻ nào hoàn tiền tốt nhất?',
        expect: { contains: 'hoàn tiền' },
    },
    {
        name: 'happy-path: compare two cards',
        message: 'So sánh thẻ Techcombank Visa Cashback và thẻ VPBank YOLO',
        expect: { custom: (t) => t.toLowerCase().includes('techcombank') || t.toLowerCase().includes('vpbank') },
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
        message: 'Cho tôi biết ưu đãi của thẻ "SuperVisa Ultimate 999"',
        expect: {
            custom: (t) => {
                const lower = t.toLowerCase();
                return lower.includes('không tìm thấy') || lower.includes('không có') || lower.includes('không tồn tại') || lower.includes('xin lỗi') || lower.includes('không thể');
            },
        },
    },
];

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

    // Collect full streamed text
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
    }

    // Extract text content from UI message stream chunks
    const textParts: string[] = [];
    for (const line of fullText.split('\n')) {
        if (!line.startsWith('0:')) continue;
        try {
            const chunk = JSON.parse(line.slice(2)) as { type: string; text?: string };
            if (chunk.type === 'text' && chunk.text) textParts.push(chunk.text);
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
