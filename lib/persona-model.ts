import type {Persona} from '@/lib/api';
import {ROUTES} from '@/lib/routes';

export type PersonaGroup = 'daily' | 'digital' | 'business';
export type PersonaTheme = 'primary' | 'black';

interface PersonaUIMeta {
    name: string;
    description: string;
    group: PersonaGroup;
    slug: string;
    theme?: PersonaTheme;
    available?: boolean;
}

const PERSONA_UI_META: Record<string, PersonaUIMeta> = {
    shopee: {name: 'Thẻ Shopee', description: 'Thẻ ưu đãi Shopee', group: 'daily', slug: 'shopee'},
    groceries: {name: 'Thẻ Siêu thị', description: 'Coopmart, Go, Lotte, AEON,...', group: 'daily', slug: 'sieu-thi'},
    digital: {
        name: 'Dịch vụ số',
        description: 'AI, Netflix, Spotify,...',
        group: 'digital',
        slug: 'dich-vu-so',
        theme: 'primary'
    },
    business: {
        name: 'Thẻ doanh nghiệp',
        description: 'Thẻ cho doanh nghiệp',
        group: 'business',
        slug: 'doanh-nghiep',
        theme: 'black'
    },
    traveler: {name: 'Thẻ Du Lịch', description: 'Vé máy bay, khách sạn, Agoda', group: 'daily', slug: 'du-lich'},
    commuter: {name: 'Thẻ Di Chuyển', description: 'Grab, Be, vận chuyển hàng ngày', group: 'daily', slug: 'di-chuyen'},
    family: {name: 'Thẻ Gia Đình', description: 'Siêu thị, học phí, y tế, bảo hiểm', group: 'daily', slug: 'gia-dinh'},
    dining: {name: 'Thẻ Ăn Uống', description: 'Nhà hàng, quán cà phê, Shopee Food, GrabFood', group: 'daily', slug: 'an-uong'},
};

export class PersonaModel {
    private readonly data?: Persona;
    private readonly _slug: string;

    constructor(dataOrSlug: Persona | string) {
        if (typeof dataOrSlug === 'string') {
            this._slug = dataOrSlug;
        } else {
            this.data = dataOrSlug;
            this._slug = dataOrSlug.slug;
        }
    }

    // ─── Static helpers ───────────────────────────────────────────────────────

    /** All known personas in display order. Use instead of CARD_CATEGORIES. */
    static all(): PersonaModel[] {
        return Object.keys(PERSONA_UI_META).map(slug => new PersonaModel(slug));
    }

    // ─── Raw data getters ─────────────────────────────────────────────────────

    getSlug(): string {
        return this._slug;
    }

    getLabel(): string {
        return this.data?.label ?? this._slug;
    }

    getLabelVi(): string | undefined {
        return this.data?.labelVi;
    }

    /** Vietnamese label when available, falls back to English label then slug. */
    getDisplayLabel(): string {
        return this.data?.labelVi ?? this.data?.label ?? this._slug;
    }

    getNote(): string | undefined {
        return this.data?.note;
    }

    getRankIntents(): string[] {
        return this.data?.rank_intents ?? [];
    }

    getCobrands(): string[] {
        return this.data?.cobrands ?? [];
    }

    getFilter(): Persona['filter'] | undefined {
        return this.data?.filter;
    }

    toRaw(): Persona | undefined {
        return this.data;
    }

    // ─── UI meta (static augmentation) ───────────────────────────────────────

    private get ui(): PersonaUIMeta | undefined {
        return PERSONA_UI_META[this._slug];
    }

    /** Whether this slug is a known, configured persona. */
    isKnown(): boolean {
        return this.ui !== undefined;
    }

    /** Short UI display name, e.g. "Thẻ Shopee". */
    getName(): string {
        return this.ui?.name ?? this.getDisplayLabel();
    }

    /** Short UI description, e.g. "Coopmart, Go, Lotte, AEON,...". */
    getDescription(): string {
        return this.ui?.description ?? '';
    }

    /** Layout group for homepage sections. */
    getGroup(): PersonaGroup | undefined {
        return this.ui?.group;
    }

    /** Optional color theme for UI cards. */
    getTheme(): PersonaTheme | undefined {
        return this.ui?.theme;
    }

    /** False when the persona page is not yet available. */
    isAvailable(): boolean {
        return this.ui?.available !== false;
    }

    /** Canonical URL for this persona's page, e.g. /the-theo-nhu-cau/sieu-thi. */
    getHref(): string {
        return ROUTES.personaPage(this.ui?.slug ?? this._slug);
    }

    // ─── Computation methods ──────────────────────────────────────────────────

    hasRankIntents(): boolean {
        return this.getRankIntents().length > 0;
    }

    hasCobrands(): boolean {
        return this.getCobrands().length > 0;
    }

    /**
     * Returns emoji icons for all rank_intents present in the provided map.
     * Build the map once: `new Map(intents.map(i => [i.slug, i.icon]))`.
     */
    getEmoji(intentIconMap: Map<string, string>): string[] {
        return this.getRankIntents()
            .map(slug => intentIconMap.get(slug))
            .filter((icon): icon is string => icon !== undefined);
    }
}
