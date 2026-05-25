export async function GET() {
    try {
        const res = await fetch(
            `${process.env.OPENWALLET_MCP_URL ?? 'http://localhost:8787'}/health`,
            {
                headers: { 'x-mcp-key': process.env.OPENWALLET_MCP_KEY ?? '' },
                signal: AbortSignal.timeout(5000),
            }
        );
        const data = await res.json() as { name?: string; version?: string; api?: boolean };
        const mcp = res.ok;
        const api = data.api === true;
        return Response.json({ ready: mcp && api, mcp, api, ...data });
    } catch {
        return Response.json({ ready: false, mcp: false, api: false });
    }
}
