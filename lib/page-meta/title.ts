import {BASE_URL} from './constants';

export const SITE_NAME = 'OpenWallet';
export const SITE_URL = BASE_URL;
export const SITE_TITLE = 'OpenWallet - Which card fits you?';
export const SITE_DESCRIPTION = 'Không cần lướt hàng chục trang web. Gợi ý khách quan theo nhu cầu của bạn. Tra cứu và so sánh thẻ ngân hàng Việt Nam. Tư vấn AI với Owie, dữ liệu thực, độc lập, không quảng cáo.';

export const SECTION_TITLES = {
    cards: 'Thẻ Ngân Hàng',
    banks: 'Ngân Hàng',
    compare: 'So Sánh Thẻ',
    persona: 'Thẻ Theo Nhu Cầu',
    cardTypes: 'Loại Thẻ',
} as const;

export function buildTitle(title: string, parent?: string): string {
    if (parent) return `${title} | ${parent} | ${SITE_NAME}`;
    return `${title} | ${SITE_NAME}`;
}
