import type {Bank} from '@/lib/api';
import {getBankImageUrl} from '@/lib/api';
import {ROUTES} from '@/lib/routes';
import {BANK_GROUP_LABELS} from '@/lib/bank-groups';
import type {BankGroup} from '@/lib/bank-groups';

export class BankModel {
    constructor(private readonly data: Bank) {}

    // ─── Raw data getters ─────────────────────────────────────────────────────

    getId(): string {
        return this.data.id;
    }

    getName(): string {
        return this.data.name;
    }

    getFullName(): string {
        return this.data.full_name;
    }

    getLink(): string {
        return this.data.link;
    }

    getLogoUrl(): string {
        return getBankImageUrl(this.data.logo_url);
    }

    getBrandColor(): string | undefined {
        return this.data.brand_color;
    }

    getGroup(): BankGroup {
        return this.data.group;
    }

    getSources(): Bank['sources'] {
        return this.data.sources;
    }

    getLastModified(): string | null | undefined {
        return this.data.last_modified;
    }

    getStats(): Bank['stats'] {
        return this.data.stats;
    }

    getNetworks(): string[] {
        return this.data.networks ?? [];
    }

    getNetworksData(): NonNullable<Bank['networks_data']> {
        return this.data.networks_data ?? [];
    }

    toRaw(): Bank {
        return this.data;
    }

    // ─── Display / computation ────────────────────────────────────────────────

    getHref(): string {
        return ROUTES.bank(this.data.id);
    }

    getGroupLabel(): string {
        return BANK_GROUP_LABELS[this.data.group] ?? this.data.group;
    }

    hasLink(): boolean {
        return !!this.data.link;
    }

    getLinkHostname(): string | undefined {
        try {
            return new URL(this.data.link).hostname;
        } catch {
            return undefined;
        }
    }

    getCardCount(): number {
        return this.data.stats?.card_count ?? 0;
    }
}
