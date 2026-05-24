/**
 * Offline eval harness for the /api/chat endpoint.
 * Run: npx tsx scripts/eval-chat.ts
 *
 * Requires GROQ_API_KEY, CHAT_MODEL, JUDGE_MODEL,
 * LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_BASE_URL in .env.local
 * and the dev server running on localhost:3000 (or set CHAT_URL).
 */
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import * as fs from 'node:fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const CHAT_URL = process.env.CHAT_URL ?? 'http://localhost:3000/api/chat';
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? '';
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'llama-3.3-70b-versatile';
const JUDGE_MODEL = process.env.JUDGE_MODEL ?? 'llama-3.3-70b-versatile';
const TRIGGERED_BY = process.env.TRIGGERED_BY ?? (process.env.CI ? 'ci' : 'cli');

const LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL ?? 'https://cloud.langfuse.com';
const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY ?? '';
const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY ?? '';

// Case filter: --case <id> CLI arg OR EVAL_CASE_IDS=id1,id2 env var
const cliCaseIdx = process.argv.indexOf('--case');
const cliCase = cliCaseIdx >= 0 ? process.argv[cliCaseIdx + 1] : undefined;
const envCaseIds = process.env.EVAL_CASE_IDS;
const FILTER_IDS: string[] | null = cliCase
  ? [cliCase]
  : envCaseIds ? envCaseIds.split(',').map((s) => s.trim()).filter(Boolean) : null;

// ─── Types ────────────────────────────────────────────────────────────────────

interface EvalCaseJSON {
  id: string;
  name: string;
  description: string;
  message: string;
  expect: {
    contains: string | null;
    notContains: string | null;
    customDescription: string | null;
  };
  tags: string[];
}

interface EvalCase {
  id: string;
  name: string;
  message: string;
  tags: string[];
  expect: {
    contains?: string;
    notContains?: string;
    custom?: (text: string) => boolean;
    customDescription?: string;
  };
}

interface EvalResult {
  run_id: string;
  prompt_version: number;
  triggered_by: string;
  model: string;
  judge_model: string;
  test_id: string;
  test_name: string;
  tags: string[];
  input: string;
  response: string;
  rule_pass: boolean;
  score: number;
  pass: boolean;
  judge_reasoning: string;
  latency_ms: number;
  timestamp: string;
}

// ─── Custom checks (predicate logic keyed by test id) ─────────────────────────

const customChecks: Record<string, (text: string) => boolean> = {
  'happy-path-list-banks': (t) =>
    t.toLowerCase().includes('vietcombank') ||
    t.toLowerCase().includes('techcombank') ||
    t.toLowerCase().includes('acb') ||
    t.toLowerCase().includes('vpbank') ||
    t.toLowerCase().includes('mb'),

  'happy-path-shopee-cashback': (t) =>
    t.length > 100 &&
    (t.toLowerCase().includes('shopee') ||
      t.toLowerCase().includes('hoàn tiền') ||
      t.toLowerCase().includes('cashback') ||
      t.toLowerCase().includes('thẻ')),

  'happy-path-no-annual-fee': (t) =>
    t.length > 80 &&
    (t.toLowerCase().includes('miễn phí') ||
      t.toLowerCase().includes('thường niên') ||
      t.toLowerCase().includes('phí')),

  'happy-path-travel-abroad': (t) =>
    t.length > 100 &&
    (t.toLowerCase().includes('ngoại tệ') ||
      t.toLowerCase().includes('visa') ||
      t.toLowerCase().includes('mastercard') ||
      t.toLowerCase().includes('travel') ||
      t.toLowerCase().includes('quốc tế')),

  'happy-path-compare-two-cards': (t) =>
    t.toLowerCase().includes('techcombank') ||
    t.toLowerCase().includes('vpbank') ||
    t.toLowerCase().includes('spark') ||
    t.toLowerCase().includes('flex'),

  'happy-path-installment': (t) =>
    t.length > 80 &&
    (t.toLowerCase().includes('trả góp') ||
      t.toLowerCase().includes('0%') ||
      t.toLowerCase().includes('phân kỳ')),

  'hallucination-guard-fake-card': (t) => {
    if (t.length === 0) return true;
    const lower = t.toLowerCase();
    return !lower.match(/hoàn tiền\s+\d+\s*%/) && !lower.match(/\d+\s*%\s*hoàn/);
  },

  'hallucination-guard-fabricated-rate': (t) => {
    if (t.length === 0) return true;
    const lower = t.toLowerCase();
    return !lower.match(/5\s*%/) && !lower.match(/không giới hạn/);
  },

  'vague-query-best-card': (t) => t.length > 100,

  'edge-case-multi-turn-context': (t) =>
    t.length > 50 &&
    (t.toLowerCase().includes('thẻ') || t.toLowerCase().includes('cashback')),
};

// ─── Loader ───────────────────────────────────────────────────────────────────

function loadTestCases(): EvalCase[] {
  const dir = path.join(process.cwd(), 'evals/cases');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const json = JSON.parse(raw) as EvalCaseJSON;

    const evalCase: EvalCase = {
      id: json.id,
      name: json.name,
      tags: json.tags ?? [],
      message: json.message,
      expect: {},
    };

    if (json.expect.contains) evalCase.expect.contains = json.expect.contains;
    if (json.expect.notContains) evalCase.expect.notContains = json.expect.notContains;
    if (json.expect.customDescription) evalCase.expect.customDescription = json.expect.customDescription;
    if (customChecks[json.id]) evalCase.expect.custom = customChecks[json.id];

    return evalCase;
  });
}

// ─── Prompt version from Langfuse ────────────────────────────────────────────

async function fetchPromptVersion(): Promise<number> {
  if (!LANGFUSE_PUBLIC_KEY || !LANGFUSE_SECRET_KEY) return 0;
  try {
    const auth = 'Basic ' + Buffer.from(`${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`).toString('base64');
    const res = await fetch(`${LANGFUSE_BASE_URL}/api/public/v2/prompts/chat-system-prompt?label=production`, {
      headers: { Authorization: auth },
    });
    if (!res.ok) return 0;
    const data = await res.json() as { version: number };
    return data.version ?? 0;
  } catch {
    return 0;
  }
}

// ─── Run ID ───────────────────────────────────────────────────────────────────

function makeRunId(): string {
  return `eval-${Date.now()}`;
}

// ─── Chat call ────────────────────────────────────────────────────────────────

const TIMEOUT_MS = 180_000;

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

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  const deadline = Date.now() + TIMEOUT_MS;

  while (Date.now() < deadline) {
    const { done, value } = await Promise.race([
      reader.read(),
      new Promise<{ done: true; value: undefined }>((_, reject) =>
        setTimeout(() => reject(new Error('stream timeout')), deadline - Date.now()),
      ),
    ]).catch(() => ({ done: true as const, value: undefined }));
    if (done) break;
    if (value) fullText += decoder.decode(value, { stream: true });
  }
  reader.cancel().catch(() => {});

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

// ─── LLM judge ───────────────────────────────────────────────────────────────

interface JudgeResult {
  score: number;
  reasoning: string;
}

async function judgeResponse(tc: EvalCase, response: string): Promise<JudgeResult> {
  if (!GROQ_API_KEY) return { score: 50, reasoning: 'No GROQ_API_KEY — skipped judge' };

  const truncatedResponse = response.slice(0, 800);
  const userPrompt = `Test case: ${tc.name}
User message: ${tc.message}
Assistant response: ${truncatedResponse}

Score this response 1-100.
- 100: perfect, accurate, on-topic, helpful
- 50: partially correct or partially off-topic
- 1: wrong, hallucinated, or refused valid query

Respond with JSON only, no markdown:
{"score": <number>, "reasoning": "<one sentence max 100 chars>"}`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: JUDGE_MODEL,
        messages: [
          { role: 'system', content: 'You are an eval judge. Respond with valid JSON only, no markdown fences.' },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { score: 50, reasoning: `Judge API error: ${err.slice(0, 100)}` };
    }

    const json = await res.json() as { choices: { message: { content: string } }[] };
    let content = json.choices[0]?.message?.content ?? '{}';

    content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    const match = content.match(/\{[\s\S]*\}/);
    if (match) content = match[0];

    const parsed = JSON.parse(content) as { score?: number; reasoning?: string };
    return {
      score: typeof parsed.score === 'number' ? Math.min(100, Math.max(1, parsed.score)) : 50,
      reasoning: (parsed.reasoning ?? 'No reasoning provided').slice(0, 120),
    };
  } catch (err) {
    return { score: 50, reasoning: `Judge failed: ${String(err).slice(0, 100)}` };
  }
}

// ─── Langfuse push ────────────────────────────────────────────────────────────

function langfuseAuth(): string {
  return 'Basic ' + Buffer.from(`${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`).toString('base64');
}

async function pushToLangfuse(results: EvalResult[]): Promise<void> {
  if (!LANGFUSE_PUBLIC_KEY || !LANGFUSE_SECRET_KEY) {
    console.log('  [langfuse] LANGFUSE_PUBLIC_KEY/SECRET_KEY not set — skipping push');
    return;
  }

  const now = new Date().toISOString();
  const traceIds: string[] = [];

  // Step 1: create traces via batch ingestion
  const traceBatch = results.map((r) => {
    const traceId = crypto.randomUUID();
    traceIds.push(traceId);
    return {
      id: crypto.randomUUID(),
      type: 'trace-create',
      timestamp: now,
      body: {
        id: traceId,
        name: 'eval',
        input: r.input,
        output: r.response || null,
        metadata: {
          run_id: r.run_id,
          test_id: r.test_id,
          test_name: r.test_name,
          model: r.model,
          judge_model: r.judge_model,
          rule_pass: r.rule_pass,
          latency_ms: r.latency_ms,
          triggered_by: r.triggered_by,
          prompt_version: r.prompt_version,
        },
        tags: ['eval', ...r.tags],
      },
    };
  });

  const traceRes = await fetch(`${LANGFUSE_BASE_URL}/api/public/ingestion`, {
    method: 'POST',
    headers: { Authorization: langfuseAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ batch: traceBatch }),
  });
  const traceBody = await traceRes.json() as { successes?: unknown[]; errors?: unknown[] };
  console.log(`  [langfuse] traces: status=${traceRes.status} successes=${traceBody.successes?.length ?? 0} errors=${traceBody.errors?.length ?? 0}`);

  // Step 2: create scores via dedicated endpoint
  let scoreOk = 0, scoreErr = 0;
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const traceId = traceIds[i];

    const scorePayloads = [
      { traceId, name: 'judge-score', value: r.score / 100, dataType: 'NUMERIC', comment: r.judge_reasoning.slice(0, 500) },
      { traceId, name: 'rule-pass', value: r.rule_pass ? 1 : 0, dataType: 'NUMERIC' },
    ];

    for (const payload of scorePayloads) {
      const res = await fetch(`${LANGFUSE_BASE_URL}/api/public/scores`, {
        method: 'POST',
        headers: { Authorization: langfuseAuth(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) scoreOk++; else scoreErr++;
    }
  }

  console.log(`  [langfuse] scores: ok=${scoreOk} err=${scoreErr}`);
  console.log(`  [langfuse] Pushed ${results.length} eval traces → ${LANGFUSE_BASE_URL}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function runEval() {
  let TEST_CASES = loadTestCases();

  if (FILTER_IDS) {
    TEST_CASES = TEST_CASES.filter((tc) => FILTER_IDS!.includes(tc.id));
    if (TEST_CASES.length === 0) {
      console.error(`No cases matched filter: ${FILTER_IDS.join(', ')}`);
      console.error(`Available: ${loadTestCases().map((c) => c.id).join(', ')}`);
      process.exit(1);
    }
  }

  const promptVersion = await fetchPromptVersion();
  const runId = makeRunId();

  const filterNote = FILTER_IDS ? ` (filter: ${FILTER_IDS.join(', ')})` : '';

  console.log(`\nEval run: ${runId}`);
  console.log(`Prompt version: ${promptVersion}`);
  console.log(`Triggered by: ${TRIGGERED_BY}`);
  console.log(`Chat model: ${CHAT_MODEL} | Judge model: ${JUDGE_MODEL}`);
  console.log(`Running ${TEST_CASES.length} eval cases${filterNote} against ${CHAT_URL}\n`);

  const results: EvalResult[] = [];

  for (const tc of TEST_CASES) {
    process.stdout.write(`  [${tc.name}] ... `);
    const startMs = Date.now();

    try {
      const response = await sendMessage(tc.message);
      const latency_ms = Date.now() - startMs;

      let rule_pass = true;
      if (tc.expect.contains && !response.toLowerCase().includes(tc.expect.contains.toLowerCase())) {
        rule_pass = false;
      }
      if (tc.expect.notContains && response.toLowerCase().includes(tc.expect.notContains.toLowerCase())) {
        rule_pass = false;
      }
      if (tc.expect.custom && !tc.expect.custom(response)) {
        rule_pass = false;
      }

      const judge = await judgeResponse(tc, response);
      const pass = rule_pass && judge.score >= 60;

      const result: EvalResult = {
        run_id: runId,
        prompt_version: promptVersion,
        triggered_by: TRIGGERED_BY,
        model: CHAT_MODEL,
        judge_model: JUDGE_MODEL,
        test_id: tc.id,
        test_name: tc.name,
        tags: tc.tags,
        input: tc.message,
        response,
        rule_pass,
        score: judge.score,
        pass,
        judge_reasoning: judge.reasoning,
        latency_ms,
        timestamp: new Date().toISOString(),
      };

      results.push(result);

      const status = pass ? 'PASS' : 'FAIL';
      console.log(`${status} (score=${judge.score}, rule=${rule_pass})`);
      if (!pass) {
        console.log(`    Response: ${response.slice(0, 200)}`);
        console.log(`    Judge: ${judge.reasoning}`);
      }
    } catch (err) {
      const latency_ms = Date.now() - startMs;
      console.log('ERROR');
      console.log(`    ${String(err)}`);

      results.push({
        run_id: runId,
        prompt_version: promptVersion,
        triggered_by: TRIGGERED_BY,
        model: CHAT_MODEL,
        judge_model: JUDGE_MODEL,
        test_id: tc.id,
        test_name: tc.name,
        tags: tc.tags,
        input: tc.message,
        response: '',
        rule_pass: false,
        score: 0,
        pass: false,
        judge_reasoning: `Error: ${String(err)}`,
        latency_ms,
        timestamp: new Date().toISOString(),
      });
    }
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;
  const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);

  console.log('\n─────────────────────────────────────────────────────────');
  console.log('Name                                  Score  Pass  Reasoning');
  console.log('─────────────────────────────────────────────────────────');
  for (const r of results) {
    const name = r.test_id.padEnd(38).slice(0, 38);
    const score = String(r.score).padStart(5);
    const passStr = r.pass ? ' PASS' : ' FAIL';
    const reason = r.judge_reasoning.slice(0, 60);
    console.log(`${name} ${score}  ${passStr}  ${reason}`);
  }
  console.log('─────────────────────────────────────────────────────────');
  console.log(`Results: ${passed}/${results.length} passed | avg score: ${avgScore} | ${failed} failed\n`);

  await pushToLangfuse(results);

  if (failed > 0) process.exit(1);
}

runEval().catch((err) => {
  console.error(err);
  process.exit(1);
});
