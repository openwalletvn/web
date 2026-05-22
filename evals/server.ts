import express from 'express';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = 3006;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CWD = path.join(__dirname, '..');

interface ActiveRun {
  emitter: EventEmitter;
  buffer: string[];
  done: boolean;
  exitCode: number | null;
}

const activeRuns = new Map<string, ActiveRun>();

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.options('*', (_req, res) => res.sendStatus(204));
app.use(express.json());

app.post('/api/evals/trigger', (req, res) => {
  const trigger = (req.body as { trigger?: string }).trigger ?? 'unknown';
  const runId = String(Date.now());

  const emitter = new EventEmitter();
  const run: ActiveRun = { emitter, buffer: [], done: false, exitCode: null };
  activeRuns.set(runId, run);

  const proc = spawn('npx', ['tsx', 'scripts/eval-chat.ts'], {
    cwd: CWD,
    env: { ...process.env, TRIGGERED_BY: trigger },
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

app.listen(PORT, () => console.log(`Evals server → http://localhost:${PORT}`));
