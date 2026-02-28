export interface CardTierData {
    id: string;
    rank: number | null;
}

export type CardTierOrder = Record<string, string[]>;

export interface Brand {
    id: string;
    name: string;
    logo_url: string;
    link?: string;
}

export interface Network {
    id: string;
    name: string;
    logo_url: string;
    link?: string;
}

export interface ContactlessMethod {
    id: string;
    name: string;
    logo_url: string;
    link?: string;
}

export interface BankStats {
    card_count: number;
    credit_count: number;
    debit_count: number;
    hybrid_count: number;
    co_branded_count: number;
    free_annual_fee_count: number;
    max_annual_fee?: number;
    network_counts: Record<string, number>;
}

export interface Bank {
    id: string;
    name: string;
    full_name: string;
    link: string;
    logo_url: string;
    brand_color?: string;
    stats?: BankStats;
    networks?: string[];
    networks_data?: Network[];
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
export type CardType = 'credit' | 'debit' | 'prepaid' | 'transit' | 'atm' | '2in1' | 'co-branded';
export type ImageOrientation = 'horizontal' | 'vertical' | 'both';

export interface Card {
    id: string;
    name: string;
    image_horizontal_url?: string;
    image_vertical_url?: string;
    bank_id: string;
    bank_data?: Bank;
    card_network: CardNetwork;
    card_tier?: string;
    card_tier_data?: CardTierData;
    co_brand?: string;
    co_brand_data?: Brand;
    card_network_data?: Network;
    card_type: CardType[];
    image_orientation: ImageOrientation;
    annual_fee?: number | null;
    currency?: string;
    interest_free_days?: number;
    statement_date?: number;
    card_link?: string;
    status?: 'published' | 'draft' | 'discontinued';
    contactless_methods?: string[];
    contactless_methods_data?: ContactlessMethod[];
    last_modified?: string;
    is_metal?: boolean;
}

export type CardSort = 'fee_asc' | 'fee_desc';

export interface CardFilters {
    type?: CardType;
    network?: CardNetwork;
    bank_id?: string;
    co_brand?: boolean | string; // true = any co-branded; string = specific brand ID
    contactless?: string;
    tier?: string;
    sort?: CardSort;
    metal?: boolean;
}

export const SEGMENT_FILTERS: Record<string, Pick<CardFilters, 'type'>> = {
    credit:       { type: 'credit' },
    debit:        { type: 'debit' },
    '2in1':       { type: '2in1' },
    'co-branded': { type: 'co-branded' },
};

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
const fetchOptions: RequestInit = process.env.NODE_ENV === 'development' ? { cache: 'no-store' } : {};

function getImageUrl(relativePath: string): string {
    return `${apiUrl}${relativePath}`;
}

export const getBankImageUrl = getImageUrl;
export const getBrandImageUrl = getImageUrl;
export const getNetworkImageUrl = getImageUrl;
export const getWalletImageUrl = getImageUrl;

export function getCardImageUrl(card: Card): string {
    const path = card.image_orientation === 'vertical'
        ? card.image_vertical_url
        : card.image_horizontal_url;
    return `${apiUrl}${path}`;
}

export async function getBanks(): Promise<Bank[]> {
    const res = await fetch(`${apiUrl}/api/v1/banks`, fetchOptions);
    const json = (await res.json()) as BankListResponse;
    if (!json.success) throw new Error('Failed to fetch banks');
    return json.data;
}

export async function getBank(id: string): Promise<Bank> {
    const res = await fetch(`${apiUrl}/api/v1/banks/${id}`, fetchOptions);
    const json = (await res.json()) as BankDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch bank: ${id}`);
    return json.data;
}

export async function getCards(filters?: CardFilters): Promise<Card[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.network) params.set('network', filters.network);
    if (filters?.bank_id) params.set('bank_id', filters.bank_id);
    if (filters?.co_brand === true) params.set('co_brand', 'true');
    else if (typeof filters?.co_brand === 'string') params.set('co_brand', filters.co_brand);
    if (filters?.contactless) params.set('contactless', filters.contactless);
    if (filters?.tier) params.set('tier', filters.tier);
    if (filters?.metal) params.set('metal', 'true');
    const query = params.size > 0 ? `?${params.toString()}` : '';
    const res = await fetch(`${apiUrl}/api/v1/cards${query}`, fetchOptions);
    const json = (await res.json()) as CardListResponse;
    if (!json.success) throw new Error('Failed to fetch cards');
    return json.data;
}

export async function getCard(id: string): Promise<Card> {
    const res = await fetch(`${apiUrl}/api/v1/cards/${id}`, fetchOptions);
    const json = (await res.json()) as CardDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch card: ${id}`);
    return json.data;
}

interface NetworkListResponse {
    success: boolean;
    data: Network[];
}

interface NetworkDetailResponse {
    success: boolean;
    data: Network;
}

interface BrandListResponse {
    success: boolean;
    data: Brand[];
    meta: { total: number };
}

interface BrandDetailResponse {
    success: boolean;
    data: Brand;
}

export async function getBrands(): Promise<Brand[]> {
    const res = await fetch(`${apiUrl}/api/v1/brands`, fetchOptions);
    const json = (await res.json()) as BrandListResponse;
    if (!json.success) throw new Error('Failed to fetch brands');
    return json.data;
}

export async function getBrand(id: string): Promise<Brand> {
    const res = await fetch(`${apiUrl}/api/v1/brands/${id}`, fetchOptions);
    const json = (await res.json()) as BrandDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch brand: ${id}`);
    return json.data;
}

export async function getNetworks(): Promise<Network[]> {
    const res = await fetch(`${apiUrl}/api/v1/networks`, fetchOptions);
    const json = (await res.json()) as NetworkListResponse;
    if (!json.success) throw new Error('Failed to fetch networks');
    return json.data;
}

export async function getNetwork(id: string): Promise<Network> {
    const res = await fetch(`${apiUrl}/api/v1/networks/${id}`, fetchOptions);
    const json = (await res.json()) as NetworkDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch network: ${id}`);
    return json.data;
}

interface TierOrderResponse {
    success: boolean;
    data: CardTierOrder;
}

export async function getTiers(): Promise<CardTierOrder> {
    const res = await fetch(`${apiUrl}/api/v1/tiers`, fetchOptions);
    const json = (await res.json()) as TierOrderResponse;
    if (!json.success) throw new Error('Failed to fetch tiers');
    return json.data;
}
