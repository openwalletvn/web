export interface Bank {
    id: string;
    name: string;
    full_name: string;
    link: string;
    logo_url: string;
    brand_color?: string;
}

interface BankListResponse {
    success: boolean;
    data: Bank[];
    meta: { total: number };
}

interface BankDetailResponse {
    success: boolean;
    data: Bank;
    meta: { total: number };
}

export type CardNetwork = 'visa' | 'mastercard' | 'jcb' | 'napas' | 'amex' | 'unionpay';
export type CardType = 'credit' | 'debit' | 'prepaid' | 'transit' | 'atm';
export type ImageOrientation = 'horizontal' | 'vertical' | 'both';

export interface Card {
    id: string;
    name: string;
    image_horizontal_url?: string;
    image_vertical_url?: string;
    bank_id: string;
    card_network: CardNetwork;
    card_tier?: string;
    co_brand?: string;
    card_type: CardType[];
    image_orientation: ImageOrientation;
    annual_fee?: number;
    currency?: string;
    interest_free_days?: number;
    card_link?: string;
    status?: 'published' | 'draft';
}

export interface CardFilters {
    type?: CardType;
    network?: CardNetwork;
    bank_id?: string;
}

interface CardListResponse {
    success: boolean;
    data: Card[];
    meta: { total: number };
}

interface CardDetailResponse {
    success: boolean;
    data: Card;
    meta: { total: number };
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export function getBankImageUrl(logoUrl: string): string {
    return `${apiUrl}${logoUrl}`;
}

export function getCardImageUrl(card: Card): string {
    const path = card.image_orientation === 'vertical'
        ? card.image_vertical_url
        : card.image_horizontal_url;
    return `${apiUrl}${path}`;
}

export async function getBanks(): Promise<Bank[]> {
    const res = await fetch(`${apiUrl}/api/v1/banks`, {next: {revalidate: 3600}});
    const json = (await res.json()) as BankListResponse;
    if (!json.success) throw new Error('Failed to fetch banks');
    return json.data;
}

export async function getBank(id: string): Promise<Bank> {
    const res = await fetch(`${apiUrl}/api/v1/banks/${id}`, {next: {revalidate: 3600}});
    const json = (await res.json()) as BankDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch bank: ${id}`);
    return json.data;
}

export async function getCards(filters?: CardFilters): Promise<Card[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.network) params.set('network', filters.network);
    if (filters?.bank_id) params.set('bank_id', filters.bank_id);
    const query = params.size > 0 ? `?${params.toString()}` : '';
    const res = await fetch(`${apiUrl}/api/v1/cards${query}`, {next: {revalidate: 3600}});
    const json = (await res.json()) as CardListResponse;
    if (!json.success) throw new Error('Failed to fetch cards');
    return json.data;
}

export async function getCard(id: string): Promise<Card> {
    const res = await fetch(`${apiUrl}/api/v1/cards/${id}`, {next: {revalidate: 3600}});
    const json = (await res.json()) as CardDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch card: ${id}`);
    return json.data;
}
