import express from 'express';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = 3006;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CWD = path.join(__dirname, '..', '..');

app.use((_req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'POST'); next(); });
app.use(express.json());

app.post('/api/evals/trigger', (_req, res) => {
  const proc = spawn('npx', ['tsx', 'scripts/eval-chat.ts'], {
    cwd: CWD,
    env: process.env,
    stdio: 'pipe',
  });

  proc.stdout?.on('data', (d: Buffer) => process.stdout.write(d));
  proc.stderr?.on('data', (d: Buffer) => process.stderr.write(d));

  res.json({ ok: true, message: 'Eval started' });
});

app.listen(PORT, () => console.log(`Evals server → http://localhost:${PORT}`));
