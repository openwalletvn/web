export const SITE_NAME = 'OpenWallet';

export const SECTION_TITLES = {
    cards: 'Thẻ Ngân Hàng',
    banks: 'Ngân Hàng',
    compare: 'So Sánh Thẻ',
    persona: 'Thẻ Theo Nhu Cầu',
} as const;

export function buildTitle(title: string, parent?: string): string {
    if (parent) return `${title} | ${parent} | ${SITE_NAME}`;
    return `${title} | ${SITE_NAME}`;
}
