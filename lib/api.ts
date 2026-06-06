export type {
    Card,
    Bank,
    Network,
    Brand,
    FeeEntry,
    FeeWaiver,
    FeeEntryWithWaiver,
    CashbackCap,
    CashbackRule,
    CashbackBenefit,
    SpendTier,
    Merchant,
    Intent,
    IntentGroupNode,
    Persona,
    RuleScope,
    Contactless,
} from './api-types.generated'

import type {
    Card,
    Bank,
    Network,
    Brand,
    FeeEntry,
    FeeEntryWithWaiver,
    Merchant,
    Intent,
    IntentGroupNode,
    Persona,
} from './api-types.generated'

export type CardNetwork = 'visa' | 'mastercard' | 'jcb' | 'napas' | 'amex' | 'unionpay';
export type CardType = 'credit' | 'debit' | 'prepaid' | 'transit' | 'atm' | 'hybrid' | 'co-branded';

export function isHybridCard(types: CardType[]): boolean {
    return types.includes('hybrid') || (types.includes('credit') && types.includes('debit'));
}

export function normalizeCardTypes(types: CardType[]): CardType[] {
    if (isHybridCard(types)) {
        return ['hybrid', ...types.filter(t => t !== 'credit' && t !== 'debit' && t !== 'hybrid')];
    }
    return [...new Set(types)];
}

export interface CardImage {
    url: string;
    width: number | null;
    height: number | null;
    orientation: 'horizontal' | 'vertical';
    lqip?: string;
}

export interface CardFees {
    annual?: FeeEntryWithWaiver;
    annual_supplementary?: FeeEntry;
    issuance?: FeeEntry;
    cancellation?: FeeEntry;
    foreign?: FeeEntry;
    foreign_dcc?: FeeEntry;
}

export interface CardSource {
    label: string;
    url: string;
    page?: number;
}

export type CashbackRedemption = 'auto_statement_credit' | 'manual_request' | 'points_pool'

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
    persona?: string;
    rule_channel?: string;
    rule_geography?: string;
    rule_intent?: string;
}

export const SEGMENT_FILTERS: Record<string, Pick<CardFilters, 'type'>> = {
    credit:       { type: 'credit' },
    debit:        { type: 'debit' },
    hybrid:       { type: 'hybrid' },
    'co-branded': { type: 'co-branded' },
};

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
            console.warn(`[apiFetch] OPENWALLET_API_KEY not set - ${path} will be unauthenticated`);
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
            const keyNote = !process.env.OPENWALLET_API_KEY ? ' - OPENWALLET_API_KEY not set' : '';
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
        throw new Error(`API returned HTML instead of JSON for ${path} - CDN/maintenance page or wrong URL (${urlNote})`);
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
    if (filters) {
        for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value));
            }
        }
    }
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
    const res = await apiFetch('/api/v1/meta/intents');
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

interface PersonasResponse {
    success: boolean;
    data: Persona[];
}

export async function getPersonas(): Promise<Persona[]> {
    const res = await apiFetch('/api/v1/personas');
    const json = (await res.json()) as PersonasResponse;
    if (!json.success) throw new Error('Failed to fetch personas');
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
    for_business?: boolean;
    sort_by?: 'cashback' | 'annual_fee';
    persona?: string;
    cards?: string[];
    monthly_spend?: number;
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

export type CompareTableRow = {
    criterion: string;
    section: string;
    unit: 'currency' | 'percent' | 'rank' | 'score' | null;
    higher_is_better: boolean;
    winner: string | null;
    values: Record<string, number>;
};

export type CompareCardEntry = {
    card_id: string;
    card_name: string;
    bank_id: string;
    network: string;
    cashback_reason?: string;
    intents_used: string[];
};

export type CompareResult = {
    monthly_spend: number;
    intents_context: string[] | null;
    intent_overlap: string[];
    cards: CompareCardEntry[];
    table: CompareTableRow[];
};

export async function compareCards(
    cardIds: string[],
    opts?: { intents?: string[]; monthly_spend?: number },
): Promise<CompareResult> {
    const res = await apiFetch('/api/v1/cards/compare', {
        method: 'POST',
        body: JSON.stringify({ card_ids: cardIds, ...opts }),
        headers: { 'Content-Type': 'application/json' },
    });
    const json = (await res.json()) as { success: boolean; data: CompareResult };
    if (!json.success) throw new Error('Failed to compare cards');
    return json.data;
}

export type CashbackByIntent = {
    intent?: string;
    budget?: number;
    best_card_id?: string;
    rate?: number;
    cashback?: number;
    optimal_spend?: number;
};

export type CashbackByCard = {
    card_id?: string;
    spend?: number;
    cashback?: number;
    intents?: string[];
    notes?: string[];
};

export type CashbackResult = {
    total_spend?: number;
    total_cashback?: number;
    effective_rate?: number;
    by_intent?: Record<string, CashbackByIntent>;
    by_card?: Record<string, CashbackByCard>;
    suggestions?: string[];
};

export async function postCashback(params: {
    total_spend?: number;
    intents?: string[];
    cards?: string[];
}): Promise<CashbackResult> {
    const res = await apiFetch('/api/v1/cashback', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
    });
    const json = (await res.json()) as { success: boolean; data: CashbackResult };
    if (!json.success) throw new Error('Failed to compute cashback');
    return json.data;
}
