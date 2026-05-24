export async function McpVersionBadge() {
    try {
        const res = await fetch('https://mcp.openwallet.vn/health', {
            next: { revalidate: 3600 },
        });
        const data = await res.json() as { version?: string };
        if (!data.version) return null;
        return (
            <code className="ow-mcp-version-badge text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                v{data.version}
            </code>
        );
    } catch {
        return null;
    }
}
