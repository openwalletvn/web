import * as React from 'react';
import {
    IconBriefcase,
    IconCar,
    IconDeviceLaptop,
    IconHomeHeart,
    IconPlane,
    IconShoppingBag,
    IconShoppingCart,
    IconToolsKitchen2,
} from '@tabler/icons-react';
import type {Persona} from '@/lib/api';
import {ROUTES} from '@/lib/routes';
import {INTENT_ICON} from '@/lib/intent-model';

const PERSONA_ICON_MAP: Record<string, React.ElementType> = {
    'shopping-bag': IconShoppingBag,
    'shopping-cart': IconShoppingCart,
    'device-laptop': IconDeviceLaptop,
    'briefcase': IconBriefcase,
    'plane': IconPlane,
    'car': IconCar,
    'home-heart': IconHomeHeart,
    'tools-kitchen-2': IconToolsKitchen2,
};

export type PersonaGroup = 'daily' | 'digital' | 'business';
export type PersonaTheme = 'primary' | 'black';

interface PersonaUIMeta {
    name: string;
    description: string;
    group: PersonaGroup;
    slug: string;
    theme?: PersonaTheme;
    available?: boolean;
    hidden?: boolean;
    color: string;
    icon: string;
}

const PERSONA_UI_META: Record<string, PersonaUIMeta> = {
    shopee: {
        name: 'Thẻ Shopee',
        description: 'Thẻ ưu đãi Shopee',
        group: 'daily',
        slug: 'shopee',
        color: '#ee4d2d',
        icon: 'shopping-bag'
    },
    groceries: {
        name: 'Thẻ Siêu thị',
        description: 'Coopmart, Go, Lotte, AEON,...',
        group: 'daily',
        slug: 'sieu-thi',
        color: '#22c55e',
        icon: 'shopping-cart'
    },
    digital: {
        name: 'Dịch vụ số',
        description: 'AI, Netflix, Spotify,...',
        group: 'digital',
        slug: 'dich-vu-so',
        theme: 'primary',
        color: '#6366f1',
        icon: 'device-laptop',
    },
    business: {
        name: 'Thẻ doanh nghiệp',
        description: 'Thẻ cho doanh nghiệp',
        group: 'business',
        slug: 'doanh-nghiep',
        theme: 'black',
        hidden: true,
        color: '#1e293b',
        icon: 'briefcase',
    },
    traveler: {
        name: 'Thẻ Du Lịch',
        description: 'Vé máy bay, khách sạn, Agoda',
        group: 'daily',
        slug: 'du-lich',
        color: '#0ea5e9',
        icon: 'plane'
    },
    commuter: {
        name: 'Thẻ Di Chuyển',
        description: 'Grab, Be, vận chuyển hàng ngày',
        group: 'daily',
        slug: 'di-chuyen',
        color: '#f59e0b',
        icon: 'car'
    },
    family: {
        name: 'Thẻ Gia Đình',
        description: 'Siêu thị, học phí, y tế, bảo hiểm',
        group: 'daily',
        slug: 'gia-dinh',
        color: '#ec4899',
        icon: 'home-heart'
    },
    dining: {
        name: 'Thẻ Ăn Uống',
        description: 'Nhà hàng, quán cà phê, Shopee Food, GrabFood',
        group: 'daily',
        slug: 'an-uong',
        color: '#f97316',
        icon: 'tools-kitchen-2'
    },
};

export function PersonaIcon({slug, size = 14, className}: {slug: string; size?: number; className?: string}) {
    const iconKey = PERSONA_UI_META[slug]?.icon;
    const Icon = iconKey ? PERSONA_ICON_MAP[iconKey] : undefined;
    if (!Icon) return null;
    return React.createElement(Icon, {size, className});
}

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

    /** All visible personas in display order (excludes hidden). Use instead of CARD_CATEGORIES. */
    static all(): PersonaModel[] {
        return Object.entries(PERSONA_UI_META)
            .filter(([, meta]) => !meta.hidden)
            .map(([slug]) => new PersonaModel(slug));
    }

    /** All personas including hidden ones. */
    static allIncludingHidden(): PersonaModel[] {
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

    /** Hex color for UI display. */
    getColor(): string | undefined {
        return this.ui?.color;
    }

    /** Tabler icon name (kebab-case) for UI display. */
    getIcon(): string | undefined {
        return this.ui?.icon;
    }

    /** False when the persona page is not yet available. */
    isAvailable(): boolean {
        return this.ui?.available !== false;
    }

    /** True when persona is hidden from all listings. */
    isHidden(): boolean {
        return this.ui?.hidden === true;
    }

    /** Canonical URL for this persona's page, e.g. /linh-vuc/sieu-thi. */
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

    getEmoji(): string[] {
        return this.getRankIntents()
            .map(slug => INTENT_ICON[slug])
            .filter((icon): icon is string => icon !== undefined);
    }
}
