import express from 'express';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = 3006;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CWD = path.join(__dirname, '..');
const CASES_DIR = path.join(CWD, 'evals/cases');
const EVALS_REPO = process.env.EVALS_REPO ?? 'openwalletvn/evals';

interface ActiveRun {
  emitter: EventEmitter;
  buffer: string[];
  done: boolean;
  exitCode: number | null;
}

const activeRuns = new Map<string, ActiveRun>();

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.options('*', (_req, res) => res.sendStatus(204));
app.use(express.json());

// List available test cases (for UI case selector)
app.get('/api/evals/cases', (_req, res) => {
  try {
    const files = fs.readdirSync(CASES_DIR).filter((f) => f.endsWith('.json')).sort();
    const cases = files.map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(CASES_DIR, f), 'utf-8')) as {
        id: string; name: string; tags: string[];
      };
      return { id: raw.id, name: raw.name, tags: raw.tags };
    });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Trigger eval run (optionally filtered to specific cases)
app.post('/api/evals/trigger', (req, res) => {
  const { trigger = 'unknown', caseIds, pushToGithub = true } = req.body as {
    trigger?: string;
    caseIds?: string[];
    pushToGithub?: boolean;
  };

  const runId = String(Date.now());
  const emitter = new EventEmitter();
  const run: ActiveRun = { emitter, buffer: [], done: false, exitCode: null };
  activeRuns.set(runId, run);

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    TRIGGERED_BY: trigger,
  };
  if (caseIds && caseIds.length > 0) env.EVAL_CASE_IDS = caseIds.join(',');
  if (!pushToGithub) env.NO_GITHUB_PUSH = 'true';

  const proc = spawn('npx', ['tsx', 'scripts/eval-chat.ts'], {
    cwd: CWD,
    env,
    stdio: 'pipe',
  });

  const push = (text: string) => {
    run.buffer.push(text);
    run.emitter.emit('data', text);
  };

  proc.stdout?.on('data', (d: Buffer) => { push(d.toString()); process.stdout.write(d); });
  proc.stderr?.on('data', (d: Buffer) => { push(d.toString()); process.stderr.write(d); });

  proc.on('close', (code) => {
    run.done = true;
    run.exitCode = code;
    run.emitter.emit('done', code);
    setTimeout(() => activeRuns.delete(runId), 120_000);
  });

  res.json({ ok: true, runId });
});

// SSE stream for live eval output
app.get('/api/evals/stream/:runId', (req, res) => {
  const { runId } = req.params as { runId: string };

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const run = activeRuns.get(runId);
  if (!run) {
    res.write('event: error\ndata: "Run not found"\n\n');
    res.end();
    return;
  }

  const send = (event: string, data: unknown) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  for (const chunk of run.buffer) send('log', chunk);

  if (run.done) {
    send('done', { code: run.exitCode });
    res.end();
    return;
  }

  const onData = (text: string) => send('log', text);
  const onDone = (code: number) => { send('done', { code }); res.end(); };

  run.emitter.on('data', onData);
  run.emitter.once('done', onDone);
  req.on('close', () => {
    run.emitter.off('data', onData);
    run.emitter.off('done', onDone);
  });
});

// Delete a run from the evals GitHub repo
app.delete('/api/evals/run', async (req, res) => {
  const { sha, filename, date, run_id } = req.body as {
    sha: string; filename: string; date: string; run_id: string;
  };

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
  if (!GITHUB_TOKEN) {
    res.status(500).json({ ok: false, error: 'GITHUB_TOKEN not set on server' });
    return;
  }

  const filePath = `results/${date}/${filename}`;
  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${EVALS_REPO}/contents/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: `delete eval run ${run_id}`, sha }),
      },
    );
    if (ghRes.ok) {
      res.json({ ok: true });
    } else {
      const err = await ghRes.text();
      res.status(ghRes.status).json({ ok: false, error: err.slice(0, 200) });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(PORT, () => console.log(`Evals server → http://localhost:${PORT}`));
