/**
 * Offline eval harness for the /api/chat endpoint.
 * Run: npx tsx scripts/eval-chat.ts
 *
 * Requires GROQ_API_KEY, CHAT_MODEL, JUDGE_MODEL, GITHUB_TOKEN in .env.local
 * and the dev server running on localhost:3000 (or set CHAT_URL).
 */
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { execSync } from 'node:child_process';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const CHAT_URL = process.env.CHAT_URL ?? 'http://localhost:3000/api/chat';
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? '';
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'llama-3.3-70b-versatile';
const JUDGE_MODEL = process.env.JUDGE_MODEL ?? 'llama-3.3-70b-versatile';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const EVALS_REPO = process.env.EVALS_REPO ?? 'openwalletvn/evals';
const TRIGGERED_BY = process.env.TRIGGERED_BY ?? (process.env.CI ? 'ci' : 'cli');

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
  prompt_version: string;
  system_prompt: string;
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

// ─── Prompt version ───────────────────────────────────────────────────────────

function getPromptVersion(): string {
  try {
    return execSync('git log -1 --format=%H -- lib/chat/system-prompt.ts')
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
}

function getSystemPrompt(): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'lib/chat/system-prompt.ts'), 'utf-8');
  } catch {
    return 'unknown';
  }
}

// ─── Run ID ───────────────────────────────────────────────────────────────────

function makeRunId(): string {
  const ts = Date.now();
  const hash = getPromptVersion().slice(0, 7);
  return `${ts}-${hash}`;
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

// ─── GitHub push ──────────────────────────────────────────────────────────────

async function pushToEvalsRepo(runId: string, lines: string[]): Promise<void> {
  if (!GITHUB_TOKEN) {
    console.log('  [github] GITHUB_TOKEN not set — skipping push');
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const filename = `results/${today}/run-${runId}.jsonl`;
  const content = Buffer.from(lines.join('\n') + '\n').toString('base64');

  let sha: string | undefined;
  try {
    const getRes = await fetch(
      `https://api.github.com/repos/${EVALS_REPO}/contents/${filename}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } },
    );
    if (getRes.ok) {
      const existing = await getRes.json() as { sha?: string };
      sha = existing.sha;
    }
  } catch {
    // file doesn't exist — that's fine
  }

  const body: Record<string, unknown> = { message: `eval run ${runId}`, content };
  if (sha) body.sha = sha;

  const putRes = await fetch(
    `https://api.github.com/repos/${EVALS_REPO}/contents/${filename}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    console.error(`  [github] Push failed: ${err.slice(0, 200)}`);
  } else {
    console.log(`  [github] Pushed → ${EVALS_REPO}/${filename}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function runEval() {
  const TEST_CASES = loadTestCases();
  const promptVersion = getPromptVersion();
  const systemPrompt = getSystemPrompt();
  const runId = makeRunId();

  console.log(`\nEval run: ${runId}`);
  console.log(`Prompt version: ${promptVersion}`);
  console.log(`Triggered by: ${TRIGGERED_BY}`);
  console.log(`Chat model: ${CHAT_MODEL} | Judge model: ${JUDGE_MODEL}`);
  console.log(`Running ${TEST_CASES.length} eval cases against ${CHAT_URL}\n`);

  const results: EvalResult[] = [];
  const jsonlLines: string[] = [];

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
        system_prompt: systemPrompt,
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
      jsonlLines.push(JSON.stringify(result));

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

      const result: EvalResult = {
        run_id: runId,
        prompt_version: promptVersion,
        system_prompt: systemPrompt,
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
      };

      results.push(result);
      jsonlLines.push(JSON.stringify(result));
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

  await pushToEvalsRepo(runId, jsonlLines);

  if (failed > 0) process.exit(1);
}

runEval().catch((err) => {
  console.error(err);
  process.exit(1);
});
