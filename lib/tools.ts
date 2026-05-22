export interface Tool {
    name: string;
    href: string;
}

export const TOOLS: Tool[] = [
    {name: 'Card Battle', href: '/card-battle'},
    {name: 'Card Match', href: '/card-match'},
    {name: 'Wallet Chat', href: '/wallet-chat'},
    {name: 'Wallet MCP', href: '/mcp'},
];

export function getTool(name: string): Tool {
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return tool;
}
