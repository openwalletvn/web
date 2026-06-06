import { checkTypeSync } from './lib/types-utils';

const MCP_URL = process.env.OPENWALLET_MCP_URL ?? 'http://localhost:8001';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const API_KEY = process.env.OPENWALLET_API_KEY ?? '';

const c = {
    cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
    green: (s: string) => `\x1b[32m${s}\x1b[0m`,
    red: (s: string) => `\x1b[31m${s}\x1b[0m`,
    yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
    dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
};

function host(url: string) {
    try { return new URL(url).host; } catch { return url; }
}

async function checkMCP() {
    try {
        const healthRes = await fetch(`${MCP_URL}/health`);
        const health = await healthRes.json() as { version?: string };
        const version = health.version ? `v${health.version}` : '';
        return { online: true, version };
    } catch {
        return { online: false, version: '' };
    }
}

async function checkAPI() {
    try {
        const healthRes = await fetch(`${API_URL}/health`);
        if (healthRes.ok) {
            const data = await healthRes.json() as { version?: string; endpoints?: number };
            return { online: true, version: data.version ?? '', endpoints: data.endpoints ?? 0 };
        }
        const fallback = await fetch(`${API_URL}/api/v1/cards?limit=0`, {
            headers: { 'X-OpenWallet-Key': API_KEY, 'Origin': 'https://openwallet.vn' },
        });
        return { online: fallback.ok || fallback.status === 401, version: '', endpoints: 0 };
    } catch {
        return { online: false, version: '', endpoints: 0 };
    }
}

function line(label: string, online: boolean, info: string, url: string) {
    const icon = online ? c.green('✓') : c.red('✗');
    const status = online ? info : 'offline';
    return `${c.cyan(`[${label}]`)} ${icon} ${status} ${c.dim('|')} ${c.dim(host(url))}`;
}

async function printStatus() {
    const [mcp, api, types] = await Promise.all([
        checkMCP(),
        checkAPI(),
        checkTypeSync(API_URL, API_KEY, true),
    ]);
    const time = c.dim(new Date().toLocaleTimeString());

    const mcpInfo = mcp.online ? mcp.version : 'offline';

    const typesLabel = types === 'synced'
        ? `${c.dim('|')} types ${c.green('✓')}`
        : types === 'updated'
            ? `${c.dim('|')} types ${c.yellow('↻ updated')}`
            : `${c.dim('|')} types ${c.dim('?')}`;

    const apiInfo = api.online
        ? `v${api.version} ${c.dim('|')} ${api.endpoints} endpoints ${typesLabel}`
        : 'offline';

    process.stdout.write(
        `\n${line('MCP', mcp.online, mcpInfo, MCP_URL)}\n` +
        `${line('API', api.online, apiInfo, API_URL)}  ${time}\n`
    );
}

void (async () => {
    await printStatus();
    setInterval(printStatus, 15_000);
})();
