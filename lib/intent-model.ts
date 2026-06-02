import type {Intent} from '@/lib/api';

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
