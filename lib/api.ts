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

export interface CardImage {
    url: string;
    width: number | null;
    height: number | null;
    orientation: 'horizontal' | 'vertical';
    lqip?: string;
}

export interface FeeWaiver {
    waiver: boolean;
    condition?: string;
}

export interface FeeEntry {
    amount: number;
    type: 'currency' | 'rate';
    note?: string;
}

export interface FeeEntryWithWaiver extends FeeEntry {
    first_year?: FeeWaiver;
    subsequent_years?: FeeWaiver;
}

/** @deprecated Use FeeEntry instead */
export type CardFeeEntry = FeeEntry;

export interface CardFees {
    annual?: FeeEntryWithWaiver;
    annual_supplementary?: FeeEntry;
    issuance?: FeeEntry;
    cancellation?: FeeEntry;
    foreign?: FeeEntry;
    foreign_dcc?: FeeEntry;
}

export interface CashbackCategory {
    slug: string;
    label: string;
    icon: string; // emoji
}

export interface Merchant {
    slug: string;
    label: string;
    category: string;
    url?: string;
    co_brand?: string;
}

export interface Intent {
    slug: string;
    label: string;
    icon: string; // emoji
    merchants: string[];
    categories: string[];
    co_brands: string[];
}

export interface IntentGroupNode {
    slug: string;
    label: string;
    icon: string;
    intents: string[];
    children?: IntentGroupNode[];
}

export type CashbackRedemption = 'auto_statement_credit' | 'manual_request' | 'points_pool';

export interface CashbackCap {
    amount: number; // VND
}

export interface CashbackRule {
    rate: number;           // decimal, e.g. 0.05 = 5%
    rate_max?: number;      // decimal, e.g. 0.10 = 10% — present when tiered/conditional
    cap?: CashbackCap;      // per-rule cap; absent = uncapped
    cap_max?: CashbackCap;  // upper bound of cap range — present when tiered/conditional
    categories?: string[];  // category slugs, resolved via /api/v1/cashback-categories
    merchants?: string[];   // merchant slugs, e.g. "grab", "shopee"
    note?: string;
}

export interface CashbackBenefit {
    rules: CashbackRule[];
    global_cap?: CashbackCap;
    global_cap_max?: CashbackCap;
    min_spend_per_period?: number; // VND
    redemption?: CashbackRedemption;
    note?: string;
}

export interface CardSource {
    label: string;
    url: string;
    page?: number;
}

export interface Card {
    id: string;
    name: string;
    image?: CardImage | null;
    bank_id: string;
    bank_data?: Bank;
    card_network: CardNetwork;
    card_tier?: string;
    card_tier_data?: CardTierData;
    co_brand?: string;
    co_brand_data?: Brand;
    card_network_data?: Network;
    card_type: CardType[];
    fees?: CardFees;
    sources?: CardSource[];
    currency?: string;
    interest_free_days?: number;
    statement_date?: number;
    card_link?: string;
    status?: 'published' | 'draft' | 'discontinued';
    contactless_methods?: string[];
    contactless_methods_data?: ContactlessMethod[];
    last_modified?: string;
    is_metal?: boolean;
    for_business?: boolean;
    description?: string;
    score?: number; // Computed data completeness score (0–100)
    data_score?: number; // Combined data quality score: 60% card score + 40% cashback score (equals score if no cashback)
    intents?: string[];
    cashback?: CashbackBenefit;
}

export type CardSort = 'fee_asc' | 'fee_desc';

export interface CardFilters {
    type?: CardType;
    network?: CardNetwork;
    bank_id?: string;
    co_brand?: boolean | string; // true = any co-branded; string = specific brand ID
    intent?: string;
    contactless?: string;
    tier?: string;
    sort?: CardSort;
    metal?: boolean;
    network_tier?: string;
    for_business?: boolean;
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

// Server-side: call the API directly (key injected below).
// Client-side: empty string → relative /api/v1/* URLs → Next.js proxy route.
const imageBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.openwallet.vn';
const apiUrl = typeof window === 'undefined' ? imageBaseUrl : '';
const fetchOptions: RequestInit = process.env.NODE_ENV === 'development' ? { cache: 'no-store' } : {};

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
    const headers = new Headers(init?.headers);
    if (typeof window === 'undefined') {
        const apiKey = process.env.OPENWALLET_API_KEY;
        if (!apiKey) {
            console.warn(`[apiFetch] OPENWALLET_API_KEY not set — ${path} will be unauthenticated`);
        } else {
            headers.set('X-OpenWallet-Key', apiKey);
        }
        headers.set('Origin', 'https://openwallet.vn');
    }
    const res = await fetch(`${apiUrl}${path}`, {
        ...fetchOptions,
        ...init,
        headers,
    });
    if (!res.ok) {
        if (res.status === 401) {
            throw new Error(`API key invalid or expired (401): ${path}`);
        }
        if (res.status === 403) {
            const keyNote = !process.env.OPENWALLET_API_KEY ? ' — OPENWALLET_API_KEY not set' : '';
            throw new Error(`API key missing or forbidden (403): ${path}${keyNote}`);
        }
        let msg = `API error ${res.status}: ${path}`;
        try {
            const errJson = await res.clone().json() as { error?: string; message?: string };
            if (errJson.error ?? errJson.message) msg = (errJson.error ?? errJson.message)!;
        } catch { /* non-JSON body */ }
        throw new Error(msg);
    }
    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('text/html')) {
        const urlNote = `NEXT_PUBLIC_API_URL=${process.env.NEXT_PUBLIC_API_URL ?? 'not set'}`;
        throw new Error(`API returned HTML instead of JSON for ${path} — CDN/maintenance page or wrong URL (${urlNote})`);
    }
    return res;
}

function getImageUrl(relativePath: string): string {
    return `${imageBaseUrl}${relativePath}`;
}

export const getBankImageUrl = getImageUrl;
export const getBrandImageUrl = getImageUrl;
export const getNetworkImageUrl = getImageUrl;
export const getWalletImageUrl = getImageUrl;

export function getCardImageUrl(card: Card): string {
    if (!card.image?.url) return '';
    if (process.env.NODE_ENV === 'development') {
        return card.image.url.replace('https://api.openwallet.vn', imageBaseUrl);
    }
    return card.image.url;
}

export async function getBanks(): Promise<Bank[]> {
    const res = await apiFetch('/api/v1/banks');
    const json = (await res.json()) as BankListResponse;
    if (!json.success) throw new Error('Failed to fetch banks');
    return json.data;
}

export async function getBank(id: string): Promise<Bank> {
    const res = await apiFetch(`/api/v1/banks/${id}`);
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
    if (filters?.intent) params.set('intent', filters.intent);
    if (filters?.contactless) params.set('contactless', filters.contactless);
    if (filters?.tier) params.set('tier', filters.tier);
    if (filters?.metal) params.set('metal', 'true');
    if (filters?.for_business) params.set('for_business', 'true');
    if (filters?.network_tier) params.set('network_tier', filters.network_tier);
    const query = params.size > 0 ? `?${params.toString()}` : '';
    const res = await apiFetch(`/api/v1/cards${query}`);
    const json = (await res.json()) as CardListResponse;
    if (!json.success) throw new Error('Failed to fetch cards');
    return json.data;
}

export async function getCard(id: string): Promise<Card> {
    const res = await apiFetch(`/api/v1/cards/${id}`);
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

interface CashbackCategoriesResponse {
    success: boolean;
    data: CashbackCategory[];
    meta: { total: number };
}

export async function getCashbackCategories(): Promise<CashbackCategory[]> {
    const res = await apiFetch('/api/v1/cashback-categories');
    const json = (await res.json()) as CashbackCategoriesResponse;
    if (!json.success) throw new Error('Failed to fetch cashback categories');
    return json.data;
}

interface MerchantsResponse {
    success: boolean;
    data: Merchant[];
    meta: { total: number };
}

export async function getMerchants(): Promise<Merchant[]> {
    const res = await apiFetch('/api/v1/merchants');
    const json = (await res.json()) as MerchantsResponse;
    if (!json.success) throw new Error('Failed to fetch merchants');
    return json.data;
}

interface IntentsResponse {
    success: boolean;
    data: Intent[];
    meta: { total: number };
}

export async function getIntents(): Promise<Intent[]> {
    const res = await apiFetch('/api/v1/intents');
    const json = (await res.json()) as IntentsResponse;
    if (!json.success) throw new Error('Failed to fetch intents');
    return json.data;
}

interface IntentGroupsResponse {
    success: boolean;
    data: IntentGroupNode[];
}

export async function getIntentGroups(): Promise<IntentGroupNode[]> {
    const res = await apiFetch('/api/v1/intent-groups');
    const json = (await res.json()) as IntentGroupsResponse;
    if (!json.success) throw new Error('Failed to fetch intent groups');
    return json.data;
}

export async function getBrands(): Promise<Brand[]> {
    const res = await apiFetch('/api/v1/brands');
    const json = (await res.json()) as BrandListResponse;
    if (!json.success) throw new Error('Failed to fetch brands');
    return json.data;
}

export async function getBrand(id: string): Promise<Brand> {
    const res = await apiFetch(`/api/v1/brands/${id}`);
    const json = (await res.json()) as BrandDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch brand: ${id}`);
    return json.data;
}

export async function getNetworks(): Promise<Network[]> {
    const res = await apiFetch('/api/v1/networks');
    const json = (await res.json()) as NetworkListResponse;
    if (!json.success) throw new Error('Failed to fetch networks');
    return json.data;
}

export async function getNetwork(id: string): Promise<Network> {
    const res = await apiFetch(`/api/v1/networks/${id}`);
    const json = (await res.json()) as NetworkDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch network: ${id}`);
    return json.data;
}

export interface ComparePair {
    a: string;
    b: string;
    compare_path: string;
}

export interface RelatedCard extends Card {
    relevance_score: number;
    compare_path: string;
}

interface ComparePairsResponse {
    success: boolean;
    data: ComparePair[];
    meta: { total: number };
}

interface RelatedCardsResponse {
    success: boolean;
    data: RelatedCard[];
    meta: { total: number; card_id: string };
}

interface TierOrderResponse {
    success: boolean;
    data: CardTierOrder;
}

export async function getTiers(): Promise<CardTierOrder> {
    const res = await apiFetch('/api/v1/tiers');
    const json = (await res.json()) as TierOrderResponse;
    if (!json.success) throw new Error('Failed to fetch tiers');
    return json.data;
}

export async function getComparePairs(): Promise<ComparePair[]> {
    const res = await apiFetch('/api/v1/compare-pairs');
    const json = (await res.json()) as ComparePairsResponse;
    if (!json.success) throw new Error('Failed to fetch compare pairs');
    return json.data;
}

export async function getRelatedCards(id: string): Promise<RelatedCard[]> {
    const res = await apiFetch(`/api/v1/cards/${id}/related`);
    const json = (await res.json()) as RelatedCardsResponse;
    if (!json.success) throw new Error(`Failed to fetch related cards for: ${id}`);
    return json.data;
}

/**
 * Fetch related cards for multiple card IDs, merge in API order,
 * deduplicating and excluding the source card IDs themselves.
 */
export interface RankingParams {
    intents: string[];
    limit?: number;
    type?: string;
    for_business?: boolean;
    sort_by?: 'cashback' | 'annual_fee';
}

interface RankingResponse {
    success: boolean;
    data: import('@/lib/card-ranker').RankedCard[];
    meta: { total: number; ranked: number; returned: number; ranking_basis?: string };
}

export async function getRankedCards(params: RankingParams): Promise<import('@/lib/card-ranker').RankedCard[]> {
    const res = await apiFetch('/api/v1/cards/rank', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
    });
    const json = (await res.json()) as RankingResponse;
    if (!json.success) throw new Error('Failed to rank cards');
    return json.data;
}

export async function getRelatedCardsForMany(cardIds: string[]): Promise<RelatedCard[]> {
    const allResults = await Promise.all(cardIds.map((id) => getRelatedCards(id).catch(() => [])));
    const excludeSet = new Set(cardIds);
    const seen = new Set<string>();
    const result: RelatedCard[] = [];
    for (const cards of allResults) {
        for (const card of cards) {
            if (!seen.has(card.id) && !excludeSet.has(card.id)) {
                seen.add(card.id);
                result.push(card);
            }
        }
    }
    return result;
}
