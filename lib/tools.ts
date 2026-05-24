export interface Tool {
    name: string;
    href: string;
    disabled?: boolean;
}

export const TOOLS: Tool[] = [
    {name: 'Card Battle', href: '/card-battle'},
    {name: 'Card Match', href: '/card-match'},
    {name: 'OpenWallet Chat', href: '/openwallet-chat'},
    {name: 'OpenWallet MCP', href: '/openwallet-mcp'},
    {name: 'OpenWallet App', href: '/openwallet-app', disabled: true},
];

export function getTool(name: string): Tool {
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return tool;
}
