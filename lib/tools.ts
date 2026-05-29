import {ROUTES} from '@/lib/routes';

export interface Tool {
    name: string;
    href: string;
    disabled?: boolean;
}

export const TOOLS: Tool[] = [
    {name: 'Card Battle', href: ROUTES.cardBattle},
    {name: 'Card Match', href: ROUTES.cardMatch},
    {name: 'OpenWallet Chat', href: ROUTES.openwalletChat},
    {name: 'OpenWallet MCP', href: ROUTES.openwalletMcp},
    {name: 'OpenWallet App', href: ROUTES.openwalletApp, disabled: true},
];

export function getTool(name: string): Tool {
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return tool;
}
