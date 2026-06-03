import type {Intent} from '@/lib/api';

// ─── Intent color config ──────────────────────────────────────────────────────

export const INTENT_HEX: Record<string, string> = {
    shopee: '#9333ea', lazada: '#9333ea', 'tiktok-shop': '#9333ea', tiki: '#9333ea', ecommerce: '#9333ea',
    grab: '#0ea5e9', transport: '#0ea5e9',
    dining: '#f97316',
    'vietnam-airlines': '#3b82f6', 'bamboo-airways': '#3b82f6', agoda: '#3b82f6', travel: '#3b82f6',
    groceries: '#22c55e',
    shopping: '#ec4899', fashion: '#ec4899', books: '#ec4899',
    digital: '#6366f1', ads: '#6366f1', telecom: '#6366f1',
    cinema: '#8b5cf6', entertainment: '#8b5cf6',
    health: '#f43f5e',
    insurance: '#14b8a6',
    education: '#84cc16',
    golf: '#f59e0b',
    pets: '#f59e0b',
};

export const INTENT_ICON: Record<string, string> = {
    shopee: '🛍️', lazada: '📦', 'tiktok-shop': '🎵', tiki: '📘', ecommerce: '🛒',
    grab: '🚗', transport: '🚌',
    dining: '🍜',
    'vietnam-airlines': '✈️', 'bamboo-airways': '🟢', agoda: '🌏', travel: '🌏',
    groceries: '🛒',
    shopping: '👗', fashion: '👗', books: '📚',
    digital: '📱', ads: '📣', telecom: '📞',
    cinema: '🎬', entertainment: '🎉',
    health: '🏥',
    insurance: '🛡️',
    education: '📚',
    golf: '⛳',
    pets: '🐾',
};

export class IntentModel {
    constructor(private readonly data: Intent) {}

    // ─── Raw data getters ─────────────────────────────────────────────────────

    getSlug(): string {
        return this.data.slug;
    }

    getLabel(): string {
        return this.data.label;
    }

    getIcon(): string {
        return this.data.icon;
    }

    getChannel(): Intent['channel'] {
        return this.data.channel;
    }

    getMerchants(): string[] {
        return this.data.merchants ?? [];
    }

    getGroups(): string[] {
        return this.data.groups ?? [];
    }

    getCoBrands(): string[] {
        return this.data.co_brands ?? [];
    }

    toRaw(): Intent {
        return this.data;
    }

    getColorHex(): string | undefined {
        return INTENT_HEX[this.data.slug];
    }

    // ─── Channel helpers ──────────────────────────────────────────────────────

    isOnline(): boolean {
        return this.data.channel === 'online' || this.data.channel === 'both';
    }

    isOffline(): boolean {
        return this.data.channel === 'offline' || this.data.channel === 'both';
    }

    isOnlineOnly(): boolean {
        return this.data.channel === 'online';
    }

    isOfflineOnly(): boolean {
        return this.data.channel === 'offline';
    }

    isBoth(): boolean {
        return this.data.channel === 'both';
    }

    // ─── Membership helpers ───────────────────────────────────────────────────

    inGroup(slug: string): boolean {
        return (this.data.groups ?? []).includes(slug);
    }

    hasMerchant(slug: string): boolean {
        return (this.data.merchants ?? []).includes(slug);
    }

    hasCoBrand(slug: string): boolean {
        return (this.data.co_brands ?? []).includes(slug);
    }

    // ─── Static factories ─────────────────────────────────────────────────────

    static fromArray(intents: Intent[]): IntentModel[] {
        return intents.map((i) => new IntentModel(i));
    }

    static toMap(intents: Intent[]): Map<string, IntentModel> {
        return new Map(intents.map((i) => [i.slug, new IntentModel(i)]));
    }
}
