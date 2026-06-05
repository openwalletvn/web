#!/usr/bin/env tsx
/**
 * OpenWallet Web CLI - interactive gateway for dev tools.
 *
 * Usage:
 *   pnpm ow                      (interactive picker)
 *   pnpm ow --help               (list commands)
 *   pnpm ow <command> [args]     (direct)
 *   pnpm ow <command> --help     (command help)
 *
 * See .claude/docs/ow-cli.md for how to add new subcommands.
 */

import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

type Command = {
  description: string;
  help?: string;
  available?: false;
  run: (args: string[]) => number | Promise<number>;
};

function tsx(script: string, args: string[], envFile = '.env.local'): number {
  const envArgs = existsSync(path.join(root, envFile)) ? ['--env-file', envFile] : [];
  return spawnSync('tsx', [...envArgs, path.join(root, script), ...args], { cwd: root, stdio: 'inherit' }).status ?? 1;
}

const USER_CANCELLED = 130;

const COMMANDS: Record<string, Command> = {
  chatlog: {
    description: 'Browse chat session logs',
    help: [
      'pnpm ow chatlog                          (interactive)',
      'pnpm ow chatlog --session=<id>           (jump direct)',
      'pnpm ow chatlog --session=<id> --mode=cat',
    ].join('\n'),
    run: args => tsx('scripts/tools/chatlog.ts', args),
  },
};

const HELP = `
Usage: pnpm ow [command] [options]

Commands:
${Object.entries(COMMANDS).map(([k, v]) => `  ${k.padEnd(12)} ${v.description}`).join('\n')}

Options:
  --help, -h    Show help

Run \`pnpm ow\` for interactive mode.
Run \`pnpm ow <command> --help\` for command-specific help.
`;

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);

  if (cmd === '--help' || cmd === '-h') {
    console.log(HELP);
    return;
  }

  if (!cmd) {
    const { select } = await import('@inquirer/prompts');
    console.log('\x1b[1mOpenWallet CLI\x1b[0m\n');
    while (true) {
      let choice: string;
      try {
        choice = await select({
          message: 'Tool',
          choices: Object.entries(COMMANDS)
            .filter(([, v]) => v.available !== false)
            .map(([k, v]) => ({ name: `${k.padEnd(12)} ${v.description}`, value: k })),
        });
      } catch (e) {
        if (e instanceof Error && e.name === 'ExitPromptError') { console.log(); break; }
        throw e;
      }
      const exitCode = await COMMANDS[choice].run([]);
      if (exitCode !== USER_CANCELLED) break;
      console.log('\n\x1b[2m↩ back to tool picker\x1b[0m\n');
    }
    return;
  }

  const command = COMMANDS[cmd];
  if (!command) {
    console.error(`Unknown command: ${cmd}`);
    console.error(`Run \`pnpm ow --help\` for usage.`);
    process.exit(1);
  }

  if (rest.includes('--help') || rest.includes('-h')) {
    console.log(command.help ?? `pnpm ow ${cmd}  - ${command.description}`);
    return;
  }

  if (command.available === false) {
    console.log(`${cmd}: coming soon`);
    process.exit(1);
  }

  process.exit(await command.run(rest));
}

main().catch(e => { console.error(e); process.exit(1); });
