#!/usr/bin/env tsx
/**
 * Browse chat session logs.
 *
 * Usage:
 *   pnpm ow chatlog                          (interactive picker)
 *   pnpm ow chatlog --session=<id>           (jump to session)
 *   pnpm ow chatlog --session=<id> --mode=cat
 */

import { select } from '@inquirer/prompts';
import { spawnSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const logsDir = path.join(root, 'logs');

function parseArgs(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    const [k, v] = arg.replace(/^--/, '').split('=');
    if (k) out[k] = v ?? 'true';
  }
  return out;
}

function getLogFiles() {
  let files: string[];
  try {
    files = readdirSync(logsDir).filter(f => f.startsWith('chat-') && f.endsWith('.log'));
  } catch {
    return [];
  }
  return files
    .map(f => {
      const full = path.join(logsDir, f);
      const stat = statSync(full);
      const sessionId = f.replace(/^chat-/, '').replace(/\.log$/, '');
      const shortId = sessionId.slice(0, 8);
      const lines = (() => {
        try {
          const { stdout } = spawnSync('wc', ['-l', full], { encoding: 'utf8' });
          return parseInt((stdout as string).trim().split(/\s+/)[0], 10);
        } catch { return 0; }
      })();
      const age = new Date(stat.mtimeMs).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
      });
      return { f, full, sessionId, shortId, lines, mtime: stat.mtimeMs, age };
    })
    .sort((a, b) => b.mtime - a.mtime);
}

async function main() {
  const args = parseArgs();

  if (args['help'] || args['h']) {
    console.log([
      'pnpm ow chatlog                          (interactive)',
      'pnpm ow chatlog --session=<id>           (jump direct)',
      'pnpm ow chatlog --session=<id> --mode=cat (full dump)',
    ].join('\n'));
    return 0;
  }

  const files = getLogFiles();
  if (files.length === 0) {
    console.log('No chat logs found in logs/');
    return 0;
  }

  let sessionId = args['session'];

  if (!sessionId) {
    sessionId = await select({
      message: 'Session',
      choices: files.map(f => ({
        name: `${f.shortId}  ${String(f.lines).padStart(3)} lines  ${f.age}`,
        value: f.sessionId,
      })),
    });
  }

  const entry = files.find(f => f.sessionId === sessionId || f.sessionId.startsWith(sessionId!));
  if (!entry) {
    console.error(`No log found for session: ${sessionId}`);
    return 1;
  }

  let mode = args['mode'];
  if (!mode) {
    mode = await select({
      message: 'View',
      choices: [
        { name: 'tail  (live follow)', value: 'tail' },
        { name: 'cat   (full dump)',   value: 'cat'  },
      ],
    });
  }

  console.log();
  if (mode === 'tail') {
    spawnSync('bash', ['-c', `tail -f ${entry.full} | jq .`], { stdio: 'inherit' });
  } else {
    spawnSync('bash', ['-c', `cat ${entry.full} | jq .`], { stdio: 'inherit' });
  }

  console.log(`\x1b[2m  pnpm ow chatlog --session=${entry.sessionId} --mode=${mode}\x1b[0m`);
  return 0;
}

main().catch(e => { console.error(e); process.exit(1); });
