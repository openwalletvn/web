// AUTO-GENERATED — do not edit manually
// Run: pnpm generate:types
// Source: http://localhost:8000/openapi.json

export interface paths {
    "/banks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all banks
         * @description Returns a list of all banks in Vietnam
         */
        get: operations["getAllBanks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/banks/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get bank by ID
         * @description Returns a single bank by ID
         */
        get: operations["getBankById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all cards
         * @description Returns a list of all cards with optional filtering
         */
        get: operations["getAllCards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/rank": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Rank cards by intent
         * @description Ranks a card pool by estimated cashback per month. Three sources define the pool: `persona` (curated filter + intents), `cards` (explicit IDs), or `intents` (intent-matching gate). Pool filtering (type, network, for_business, etc.) is handled exclusively via `persona` — use the appropriate persona slug instead of passing raw filter params. Tiebreaker order: cashback desc → annual fee asc → network popularity → no min_spend_per_period.
         */
        post: operations["rankCards"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/compare": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Compare 2–3 cards side by side
         * @description Returns a structured side-by-side comparison of 2–3 cards including fees, cashback estimates, and intent coverage. Useful for "vs" comparison pages.
         */
        post: operations["compareCards"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get card by ID
         * @description Returns a single card by ID
         */
        get: operations["getCardById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}/related": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get related cards
         * @description Returns cards related to a given card, sorted by relevance score (descending). Relevance is computed from shared intents, shared card types, and partner data quality. Use this for "similar cards" or "you might also like" widgets.
         */
        get: operations["getRelatedCards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}/cashback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Calculate cashback for a card
         * @description Computes cashback for a specific card given a monthly spend amount and optional intent list. Returns per-rule breakdown, intent-level detail (when category caps apply), and advisory notes (e.g. when optimal spend falls below min_spend_per_period).
         */
        post: operations["calcCardCashback"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contactless": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all contactless methods
         * @description Returns a list of all contactless payment methods
         */
        get: operations["getAllContactless"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contactless/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get contactless method by ID
         * @description Returns a single contactless payment method by ID
         */
        get: operations["getContactlessById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/networks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all networks
         * @description Returns a list of all card networks
         */
        get: operations["getAllNetworks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/networks/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get network by ID
         * @description Returns a single card network by ID
         */
        get: operations["getNetworkById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/brands": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all brands
         * @description Returns a list of all co-brand partners
         */
        get: operations["getAllBrands"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/brands/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get brand by ID
         * @description Returns a single co-brand partner by ID
         */
        get: operations["getBrandById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/compare-pairs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all compare pairs
         * @description Returns all valid compare pairs generated from card data using configured rules. Used by web repo generateStaticParams for compare page static generation.
         */
        get: operations["getComparePairs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/personas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all personas
         * @description Returns a list of all persona personas. Each persona expands to a curated card pool filter and optional rank intents. Use the slug with GET /cards?persona= or POST /cards/rank.
         */
        get: operations["getAllPersonas"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/personas/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get persona by slug
         * @description Returns a single persona by slug.
         */
        get: operations["getPersonaBySlug"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/meta/merchants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all merchants
         * @description Returns a list of all merchants
         */
        get: operations["getAllMerchants"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/meta/cashback-categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all cashback categories
         * @description Returns a list of all cashback spending categories
         */
        get: operations["getAllCashbackCategories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/meta/tiers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get card tier ordering
         * @description Returns the ordered tier list per card network, from highest to lowest (rank 1 = highest)
         */
        get: operations["getTiers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/meta/intents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all intents
         * @description Returns a list of all spending intents used for card filtering and recommendation
         */
        get: operations["getAllIntents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/meta/intent-groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get intent group hierarchy
         * @description Returns the nested group tree used to navigate intents from macro to micro to atomic level in the UI
         */
        get: operations["getIntentGroups"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Data quality stats
         * @description Returns data completeness statistics for all cards — overall, by card type (credit/debit/business/cashback), and by bank. Public endpoint, no auth required. Use to track data quality improvements over time.
         */
        get: operations["getStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stats/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Data quality history
         * @description Returns all historical weekly stats snapshots bundled from `data/stats-snapshots.json`. Snapshots are added via the weekly GitHub Actions workflow and only appear here after the PR is merged to main. Public, no auth required.
         */
        get: operations["getStatsHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description A curated persona that expands to a card pool filter and optional rank intents. Pass the slug to GET /cards?persona= or POST /cards/rank. */
        Persona: {
            /**
             * @description Unique identifier for the persona
             * @example shopee
             */
            slug: string;
            /**
             * @description Human-readable display name
             * @example Shopee
             */
            label: string;
            /**
             * @description Vietnamese display name
             * @example Shopee
             */
            labelVi?: string;
            /**
             * @description Short description of what the persona targets
             * @example shopee intent only
             */
            note?: string;
            /**
             * @description Intent slugs used when ranking cards under this persona. Empty for pool-filter-only personas.
             * @example [
             *       "shopee"
             *     ]
             */
            rank_intents: string[];
            /**
             * @description Cobrand slugs relevant to this persona. Consumers can use these to sub-filter by co_brand= when the persona has associated cobrand cards.
             * @example [
             *       "vietnam-airlines",
             *       "vna-lotusmiles"
             *     ]
             */
            cobrands?: string[];
            /** @description CardFilter object applied to narrow the card pool. Shape varies by persona type. */
            filter: Record<string, never>;
        };
        /** @description A single weekly stats snapshot. */
        StatsSnapshot: {
            /**
             * Format: date-time
             * @description ISO timestamp when this snapshot was recorded
             * @example 2026-05-26T02:00:00Z
             */
            snapshot_at: string;
            all: components["schemas"]["StatsGroup"];
            by_type: {
                credit?: components["schemas"]["StatsGroup"];
                debit?: components["schemas"]["StatsGroup"];
                business?: components["schemas"]["StatsGroup"];
                cashback?: components["schemas"]["StatsGroup"];
            };
            by_bank: {
                [key: string]: components["schemas"]["StatsGroup"] & {
                    name?: string;
                };
            };
        };
        /** @description Aggregated data quality metrics for a group of cards. */
        StatsGroup: {
            /**
             * @description Number of cards in this group
             * @example 52
             */
            total: number;
            /**
             * @description Average data quality score (0–100)
             * @example 74
             */
            avg_score: number;
            /**
             * @description Cards with score ≥ 90
             * @example 12
             */
            complete: number;
            /**
             * @description Percentage of complete cards
             * @example 23
             */
            complete_pct: number;
            issues: {
                /**
                 * @description Cards with at least one critical issue
                 * @example 4
                 */
                critical: number;
                /**
                 * @description Cards with at least one important issue
                 * @example 18
                 */
                important: number;
                /**
                 * @description Cards with at least one minor issue
                 * @example 31
                 */
                minor: number;
            };
        };
        /** @description A single fee entry with amount, type, and an optional note. */
        FeeEntry: {
            /**
             * @description Fee amount. Interpret based on `type`: VND if "currency", percentage (%) if "rate".
             * @example 150000
             */
            amount: number;
            /**
             * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
             * @example currency
             * @enum {string}
             */
            type: "currency" | "rate";
            /**
             * @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | ".
             * @example Miễn phí trong vòng 12 tháng kể từ ngày phát hành lần đầu
             */
            note?: string;
        };
        /** @description Waiver policy for a fee period. */
        FeeWaiver: {
            /**
             * @description Whether the fee can be waived this period
             * @example true
             */
            waiver: boolean;
            /**
             * @description Waiver condition in Vietnamese. Present only when waiver is true.
             * @example Miễn phí khi chi tiêu tối thiểu 12 triệu đồng trong năm liền trước
             */
            condition?: string;
        };
        FeeEntryWithWaiver: components["schemas"]["FeeEntry"] & {
            /** @description Waiver policy for the first year. Omitted if not mentioned in source. */
            first_year?: components["schemas"]["FeeWaiver"];
            /** @description Waiver policy from the second year onward. Omitted if not mentioned in source. */
            subsequent_years?: components["schemas"]["FeeWaiver"];
        };
        Contactless: {
            /**
             * @example apple_pay
             * @enum {string}
             */
            id: "apple-pay" | "google-pay" | "samsung-pay" | "garmin-pay";
            /** @example Apple Pay */
            name: string;
            /** @example /images/contactless/apple_pay.png */
            logo_url: string;
            /**
             * Format: uri
             * @example https://www.apple.com/apple-pay/
             */
            link: string;
        };
        Network: {
            /**
             * @example visa
             * @enum {string}
             */
            id: "visa" | "mastercard" | "jcb" | "napas" | "amex" | "unionpay";
            /** @example Visa */
            name: string;
            /** @example /images/networks/visa.png */
            logo_url: string;
            /**
             * Format: uri
             * @example https://www.visa.com.vn
             */
            link?: string;
        };
        Brand: {
            /** @example vietnam-airlines */
            id: string;
            /** @example Vietnam Airlines */
            name: string;
            /** @example /images/brands/vietnam-airlines.png */
            logo_url: string;
            /**
             * Format: uri
             * @example https://www.vietnamairlines.com
             */
            link?: string;
        };
        Bank: {
            /** @example techcombank */
            id: string;
            /** @example Techcombank */
            name: string;
            /** @example Ngân hàng TMCP Kỹ thương Việt Nam */
            full_name: string;
            /**
             * Format: uri
             * @example https://techcombank.com/
             */
            link: string;
            /** @example /images/banks/techcombank.png */
            logo_url: string;
            /** @example #EF4444 */
            brand_color?: string;
            /**
             * @description Bank classification group
             * @example commercial
             * @enum {string}
             */
            group: "big4" | "foreign" | "digital" | "commercial";
            stats?: {
                /**
                 * @description Total number of active cards (published + discontinued) for this bank
                 * @example 10
                 */
                card_count?: number;
                /**
                 * @description Number of active credit cards (published + discontinued, including 2-in-1)
                 * @example 6
                 */
                credit_count?: number;
                /**
                 * @description Number of active debit cards (published + discontinued, including 2-in-1)
                 * @example 4
                 */
                debit_count?: number;
                /**
                 * @description Number of cards that are both credit and debit (2-in-1)
                 * @example 1
                 */
                hybrid_count?: number;
                /**
                 * @description Number of co-branded cards
                 * @example 2
                 */
                co_branded_count?: number;
                /**
                 * @description Number of cards with zero annual fee
                 * @example 3
                 */
                free_annual_fee_count?: number;
                /**
                 * @description Highest annual fee (VND) across all active cards for this bank. Cards with no fee info are treated as 0.
                 * @example 3600000
                 */
                max_annual_fee?: number;
                /**
                 * @description Card count per network
                 * @example {
                 *       "visa": 5,
                 *       "mastercard": 3
                 *     }
                 */
                network_counts?: {
                    [key: string]: number;
                };
            };
            /**
             * @description Distinct network IDs of active (published + discontinued) cards belonging to this bank
             * @example [
             *       "visa",
             *       "mastercard",
             *       "napas"
             *     ]
             */
            networks?: string[];
            /** @description Full Network objects for each network ID (only included in the detail endpoint) */
            networks_data?: components["schemas"]["Network"][];
        };
        Merchant: {
            /**
             * @description Unique kebab-case identifier
             * @example shopee
             */
            slug: string;
            /**
             * @description Human-readable display name
             * @example Shopee
             */
            label: string;
            /**
             * @description Default cashback category this merchant belongs to
             * @example ecommerce
             */
            category: string;
            /**
             * Format: uri
             * @description Merchant website URL
             * @example https://shopee.vn
             */
            url?: string;
            /**
             * @description Matching brand slug in data/brands/ if this merchant has a co-branded card
             * @example shopee
             */
            co_brand?: string;
        };
        CashbackCategory: {
            /**
             * @description Unique kebab-case identifier
             * @example dining
             */
            slug: string;
            /**
             * @description Vietnamese display name
             * @example Ăn uống
             */
            label: string;
            /**
             * @description Emoji icon
             * @example 🍜
             */
            icon: string;
        };
        /** @description A spend tier for tiered cashback rates. */
        SpendTier: {
            /**
             * @description Minimum spend (VND) to unlock this tier rate.
             * @example 5000000
             */
            min_spend: number;
            /**
             * @description Cashback rate as decimal for this tier.
             * @example 0.1
             */
            rate: number;
            /**
             * @description VND cap for this tier. Absent = uncapped.
             * @example 200000
             */
            cap?: number;
        };
        CashbackCap: {
            /**
             * @description Cap amount in VND. Use -1 for explicitly unlimited. Positive integer for a hard ceiling.
             * @example 300000
             */
            amount: number;
            /**
             * @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher.
             * @example {
             *       "insurance": 400000
             *     }
             */
            category_caps?: {
                [key: string]: number;
            };
        };
        /** @description A single cashback earning rule. Rules are ordered — first matching rule wins per intent. */
        CashbackRule: {
            /**
             * @description Base/guaranteed cashback rate as decimal (e.g. 0.05 = 5%). Used by ranking algorithm at the 3M VND/month reference spend.
             * @example 0.05
             */
            rate: number;
            /**
             * @description Best achievable rate when tiered or conditional (e.g. spend-tier unlocks higher rate). Omit if flat. Example: BVBank JCB Sense gives 5% at <15M/month spend, up to 20% at ≥50M/month — stored as rate: 0.05, rate_max: 0.20.
             * @example 0.2
             */
            rate_max?: number;
            /** @description Per-rule cashback cap per statement period. */
            cap?: components["schemas"]["CashbackCap"];
            /** @description Best achievable per-rule cap when tiered. Omit if flat. */
            cap_max?: components["schemas"]["CashbackCap"];
            /**
             * @description Intent slugs this rule applies to (from /intents). Absent or empty = incomplete data, scores 0. Use ["all"] for rules that apply to all remaining transactions — channel specificity is expressed via rule scope, not intent string. Example catch-all cards: acb-visa-platinum (0.3% on all), sacombank-uniq (0.5% on all others).
             * @example [
             *       "dining",
             *       "travel"
             *     ]
             */
            intents?: string[];
            /**
             * @description Specific merchant slugs this rule applies to (from /merchants). Takes precedence over intents for merchant-specific rates.
             * @example [
             *       "shopee",
             *       "lazada"
             *     ]
             */
            merchants?: string[];
            /**
             * @description Maximum number of intents/merchants the cardholder can apply this rule to per billing cycle. Use when the product lets the user pick N intents each cycle. Example: MSB mDigi (max_intents: 1, pick one of dining/travel/digital per cycle), VIB Family Link (max_intents: 1, pick one of education/health/insurance). Does not affect ranking — only affects calcCashback display accuracy.
             * @example 1
             */
            max_intents?: number;
            /** @description Spend-tiered rates. When present, rate/cap are display-only summaries of the best tier. */
            tiers?: components["schemas"]["SpendTier"][];
            /** @description ISO 8601 date (YYYY-MM-DD) when this rule becomes active. Absent = no start restriction. */
            valid_from?: string;
            /** @description ISO 8601 date (YYYY-MM-DD, inclusive) after which this rule is expired. Absent = no end restriction. */
            valid_until?: string;
            /**
             * @description Free-text for unlock conditions, user-selectable mechanics, exclusions, or tier details that do not fit structured fields. Always in Vietnamese.
             * @example Khách hàng chọn 1 danh mục mỗi kỳ sao kê
             */
            note?: string;
            /** @description Restricts when this rule fires along channel and geography axes. Absent = universal (all channels + all geographies). */
            scope?: components["schemas"]["RuleScope"];
        };
        /** @description Restricts a cashback rule to a specific payment channel and/or geography. Absent scope = universal (fires for all channels and geographies). */
        RuleScope: {
            /**
             * @description Restrict to one payment channel. Absent = both online and offline.
             * @example online
             * @enum {string}
             */
            channel?: "online" | "offline";
            /**
             * @description "domestic" | "foreign" | ISO 3166-1 alpha-2 country code (e.g. "JP", "TH"). Absent = all geographies.
             * @example domestic
             */
            geography?: string;
        };
        /** @description Cashback benefit attached to a card. Rules are evaluated in order — first matching rule wins per intent. */
        CashbackBenefit: {
            /** @description Ordered list of cashback rules. Specific rules first (merchants/specific intents), catch-all last. */
            rules: components["schemas"]["CashbackRule"][];
            /** @description True = rules are mutually exclusive packages; cardholder picks one at issuance. */
            package_exclusive?: boolean;
            /** @description Total cashback ceiling across all rules per statement period. */
            global_cap?: components["schemas"]["CashbackCap"];
            /** @description Best achievable global cap when tiered. */
            global_cap_max?: components["schemas"]["CashbackCap"];
            /**
             * @description Minimum total spend (VND) in the statement period to activate any cashback. If unmet, all rules earn 0.
             * @example 3000000
             */
            min_spend_per_period?: number;
            /**
             * @description How cashback is credited.
             * @example auto_statement_credit
             * @enum {string}
             */
            redemption?: "auto_statement_credit" | "manual_request" | "points_pool";
            /** @description Computed at generate time. True when all cashback rules are past their valid_until date. Never set in source data. */
            cashback_expired?: boolean;
            /** @description Benefit-level conditions in Vietnamese. */
            note?: string;
        };
        Intent: {
            /**
             * @description Unique kebab-case identifier. Used in card.intents[]
             * @example shopee
             */
            slug: string;
            /**
             * @description Vietnamese display name
             * @example Shopee
             */
            label: string;
            /**
             * @description Emoji icon
             * @example 🛍️
             */
            icon: string;
            /**
             * @description Merchant slugs from data/merchants.json that satisfy this intent
             * @example [
             *       "shopee"
             *     ]
             */
            merchants?: string[];
            /**
             * @description Cashback category slugs from data/cashback-categories.json that satisfy this intent
             * @example [
             *       "ecommerce"
             *     ]
             */
            categories?: string[];
            /**
             * @description Brand slugs from data/brands/ that satisfy this intent
             * @example [
             *       "shopee"
             *     ]
             */
            co_brands?: string[];
        };
        IntentGroupNode: {
            /** @example travel */
            slug: string;
            /** @example Du lịch */
            label: string;
            /** @example 🌏 */
            icon: string;
            /**
             * @description Intent slugs active when this group node is selected
             * @example [
             *       "travel"
             *     ]
             */
            intents: string[];
            /** @description Sub-groups (optional) */
            children?: components["schemas"]["IntentGroupNode"][];
        };
        Card: {
            /** @example bidv-visa-signature-credit */
            id: string;
            /** @example BIDV Visa Signature */
            name: string;
            /** @description Editorial description of the card in Vietnamese. 100–200 words covering who the card is for and key strengths. Used for SEO meta description and human-readable summaries. */
            description?: string;
            /** @description Card image data. Null if no image is available. */
            image?: {
                /**
                 * @description Absolute URL to the card image (no file extension).
                 * @example https://api.openwallet.vn/images/cards/bidv/bidv-jcb-hybrid
                 */
                url?: string;
                /**
                 * @description Image width in pixels.
                 * @example 800
                 */
                width?: number | null;
                /**
                 * @description Image height in pixels.
                 * @example 504
                 */
                height?: number | null;
                /**
                 * @description Card image orientation.
                 * @example horizontal
                 * @enum {string}
                 */
                orientation?: "horizontal" | "vertical";
                /**
                 * @description Low quality image placeholder (base64 data URL or blurred preview URL).
                 * @example data:image/webp;base64,...
                 */
                lqip?: string;
            } | null;
            /** @example bidv */
            bank_id: string;
            /** @description Full bank data, always included */
            bank_data?: components["schemas"]["Bank"];
            /**
             * @example visa
             * @enum {string}
             */
            card_network: "visa" | "mastercard" | "jcb" | "napas" | "amex" | "unionpay";
            /**
             * @description Card tier level
             * @example signature
             * @enum {string}
             */
            card_tier?: "classic" | "gold" | "green" | "infinite" | "platinum" | "platinum-business" | "signature" | "standard" | "ultimate" | "world" | "world-elite";
            /** @description Enriched tier data, included when card_tier is set */
            card_tier_data?: {
                /**
                 * @description Tier identifier
                 * @example signature
                 */
                id?: string;
                /**
                 * @description Rank within the network (1 = highest). Null if tier has no defined order for this network.
                 * @example 2
                 */
                rank?: number | null;
            };
            /**
             * @description Co-brand partner identifier
             * @example vietnam-airlines
             */
            co_brand?: string;
            /** @description Full brand data, included when co_brand is set */
            co_brand_data?: components["schemas"]["Brand"];
            /** @description Full network data, always included */
            card_network_data?: components["schemas"]["Network"];
            /**
             * @description One or more card types (e.g. ["credit", "debit"] for 2-in-1 cards)
             * @example [
             *       "credit"
             *     ]
             */
            card_type: ("credit" | "debit" | "prepaid" | "transit" | "atm" | "2in1" | "co-branded")[];
            /**
             * @description Default statement date (day of month)
             * @example 5
             */
            statement_date?: number;
            /**
             * @description Currency code
             * @example VND
             */
            currency?: string;
            /**
             * @description Number of interest-free days
             * @example 55
             */
            interest_free_days?: number;
            /**
             * Format: uri
             * @description Link to card details page
             * @example https://bidv.com.vn/visa-signature
             */
            card_link?: string;
            /**
             * @description "published" = active and visible; "discontinued" = visible but no longer issued to new customers; "draft" = hidden from API.
             * @example published
             * @enum {string}
             */
            status?: "published" | "draft" | "discontinued";
            /**
             * @description Supported contactless payment methods (IDs)
             * @example [
             *       "apple-pay",
             *       "google-pay"
             *     ]
             */
            contactless_methods?: ("apple-pay" | "google-pay" | "samsung-pay" | "garmin-pay")[];
            /** @description Full contactless method data, included when contactless_methods is set */
            contactless_methods_data?: components["schemas"]["Contactless"][];
            /**
             * @description Whether the card is made of metal. Absent means unspecified (assumed plastic).
             * @example true
             */
            is_metal?: boolean | null;
            /**
             * @description Whether this card is intended for business use. Absent or false means personal card.
             * @example false
             */
            for_business?: boolean;
            /**
             * @description ISO timestamp of when the card was last modified via admin. Null if never edited via admin.
             * @example 2026-02-21T10:00:00.000Z
             */
            last_modified?: string | null;
            /** @description Fee schedule for this card. All sub-fields are optional. */
            fees?: {
                /** @description Annual card fee. `amount` = base fee without waiver. */
                annual?: components["schemas"]["FeeEntryWithWaiver"];
                /** @description Annual fee for supplementary (add-on) cards. `amount` = base fee without waiver. */
                annual_supplementary?: components["schemas"]["FeeEntryWithWaiver"];
                /** @description One-time card issuance fee */
                issuance?: components["schemas"]["FeeEntry"];
                /** @description Card cancellation fee */
                cancellation?: components["schemas"]["FeeEntry"];
                /** @description Foreign transaction fee */
                foreign?: components["schemas"]["FeeEntry"];
                /** @description Foreign transaction fee when DCC (Dynamic Currency Conversion) is applied */
                foreign_dcc?: components["schemas"]["FeeEntry"];
            };
            /** @description Curated list of intent slugs this card is relevant for, referencing data/intents.json. Used for filtering, recommendation, and intent coverage analytics. */
            intents?: string[];
            /** @description Cashback benefit data. Absent if this card has no cashback program. */
            cashback?: components["schemas"]["CashbackBenefit"];
            /** @description Computed data completeness score (0–100). Higher = more complete card data. Used to determine eligibility for compare page static generation. */
            score?: number;
            /** @description Combined data quality score (0–100). Weighted composite of card completeness score and cashback data quality score (60/40 split). Equals score when card has no cashback. Use this to answer "does this card have good enough data?" */
            data_score?: number;
            /** @description Source references for fee and card data */
            sources?: {
                /**
                 * @description Human-readable label for the source
                 * @example VPBank Biểu phí thẻ tín dụng 2025
                 */
                label: string;
                /**
                 * Format: uri
                 * @description URL to the source document
                 * @example https://r2.openwallet.vn/tnc/vpbank-credit-fees-2025.pdf
                 */
                url: string;
                /**
                 * @description PDF page number where the data was found. Null or absent for non-PDF web sources.
                 * @example 3
                 */
                page?: number | null;
            }[];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getAllBanks: {
        parameters: {
            query?: {
                /** @description Fuzzy text search across bank id, name, and full_name. Supports partial words, typos, and common abbreviations (e.g. "vcb", "viet com"). Results are ranked by relevance. */
                q?: string;
                /** @description Filter by bank group. big4: state-owned banks (Agribank, BIDV, Vietcombank, Vietinbank). foreign: 100% foreign-owned banks. digital: digital-only banks. commercial: Vietnamese joint-stock commercial banks. */
                group?: "big4" | "foreign" | "digital" | "commercial";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Bank"][];
                        meta?: {
                            total?: number;
                            filtered?: number;
                        };
                    };
                };
            };
        };
    };
    getBankById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Bank ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Bank"];
                    };
                };
            };
            /** @description Bank not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAllCards: {
        parameters: {
            query?: {
                /** @description Fuzzy text search across card name, id, and bank_id. Supports partial words, token reordering, and typos (e.g. "msb family", "vib plat", "msb card family"). Results are ranked by relevance. */
                q?: string;
                /** @description Filter by card type (comma-separated OR, e.g. "credit,debit"). "2in1" returns cards with both credit and debit types. "co-branded" returns cards that have a co-brand partner. */
                type?: "credit" | "debit" | "prepaid" | "transit" | "atm" | "2in1" | "co-branded" | "2in1" | "co-branded";
                /** @description Filter by card network (comma-separated OR, e.g. "visa,mastercard") */
                network?: "visa" | "mastercard" | "jcb" | "napas" | "amex" | "unionpay";
                /** @description Filter by bank ID (comma-separated OR, e.g. "bidv,techcombank") */
                bank_id?: "acb" | "agribank" | "bidv" | "bvbank" | "eximbank" | "hsbc" | "kbank" | "lpbank" | "mb" | "msb" | "ncb" | "ocb" | "sacombank" | "seabank" | "shb" | "techcombank" | "uob" | "vib" | "vietcombank" | "vietinbank" | "vpbank" | "woori";
                /** @description Filter by co-brand partner identifier (comma-separated OR, e.g. "vietnam-airlines,grab") */
                co_brand?: string;
                /** @description Filter by spending intent slug (comma-separated OR, e.g. "shopee,lazada"). Returns cards whose intents[] array includes any of the given values. */
                intent?: "shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads";
                /** @description Filter by contactless payment methods (comma-separated OR, e.g. "apple_pay,google_pay") */
                contactless?: string;
                /** @description Filter by card tier (comma-separated OR, e.g. "infinite,signature") */
                tier?: "classic" | "gold" | "green" | "infinite" | "platinum" | "platinum-business" | "signature" | "standard" | "ultimate" | "world" | "world-elite";
                /** @description Filter by network+tier pairs (comma-separated, e.g. "visa:platinum,jcb:ultimate") */
                network_tier?: string;
                /** @description Filter by card material. "true" returns only metal cards. "false" returns only non-metal cards (is_metal is false or absent). */
                metal?: "true" | "false";
                /** @description Filter by business card. "true" returns only business cards. "false" returns only personal cards (for_business is false or absent). */
                for_business?: "true" | "false";
                /** @description Filter by persona slug. Expands to a curated CardFilter (intent + rule scope combos). Prefer persona over atomic filters when a matching persona exists. Available: shopee, groceries, digital, health, insurance, education, traveler, commuter, foodie, family, lifestyle, credit, debit, napas, hybrid, business, all, any-online. */
                persona?: "shopee" | "groceries" | "digital" | "health" | "insurance" | "education" | "traveler" | "commuter" | "foodie" | "family" | "lifestyle" | "credit" | "debit" | "napas" | "hybrid" | "business" | "all" | "any-online";
                /** @description Atomic filter: card has ≥1 cashback rule with this channel scope. "unscoped" matches rules with no channel restriction. Use persona first; use this for combos not covered by any persona. */
                rule_channel?: "online" | "offline" | "unscoped";
                /** @description Atomic filter: card has ≥1 cashback rule with this geography scope. "unscoped" matches rules with no geography restriction. */
                rule_geography?: "domestic" | "foreign" | "unscoped";
                /** @description Atomic filter: card has ≥1 cashback rule targeting this intent slug (comma-separated OR, e.g. "digital,all"). */
                rule_intent?: "shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads" | "all";
                /** @description Filter by cashback benefit. "true" returns only cards with ≥1 cashback rule. "false" returns only cards with no cashback rules. */
                has_cashback?: "true" | "false";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Card"][];
                        meta?: {
                            total?: number;
                            filtered?: number;
                        };
                    };
                };
            };
        };
    };
    rankCards: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Persona slug. Expands to a curated card pool filter + rank intents. This is the primary way to narrow the pool (by type, network, intent, etc.).
                     * @example shopee
                     * @enum {string}
                     */
                    persona?: "shopee" | "groceries" | "digital" | "traveler" | "commuter" | "family" | "business";
                    /** @description Restrict ranking pool to specific card IDs. */
                    cards?: string[];
                    /**
                     * @description Spending intent slugs used for ranking cashback estimates. When omitted and no persona, ranks all cards by their own maximum potential cashback.
                     * @example [
                     *       "shopee"
                     *     ]
                     */
                    intents?: ("shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads")[];
                    /**
                     * @description Monthly spend in VND used to estimate cashback. Default 3,000,000.
                     * @example 3000000
                     */
                    monthly_spend?: number;
                    /**
                     * @description Primary sort axis. "cashback": highest estimated cashback first. "annual_fee": lowest annual fee first.
                     * @default cashback
                     * @enum {string}
                     */
                    sort_by?: "cashback" | "annual_fee";
                    /**
                     * @description Max results returned (1–50)
                     * @default 20
                     */
                    limit?: number;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: {
                            /** @description Rank position starting from 1 */
                            rank?: number;
                            /** @description Human-readable explanation of why this card holds its rank relative to the next lower-ranked card. Last card shows its primary metric value. */
                            rank_reason?: string;
                            /**
                             * @description Machine-readable rank reason. "baseline" = last card in results (nothing below to compare). "tied" = all criteria equal.
                             * @enum {string}
                             */
                            rank_reason_type?: "higher_cashback" | "lower_annual_fee" | "better_network" | "no_min_spend" | "tied" | "baseline";
                            /** @description Present only when multiple cards share the same cashback amount. Positive = this card beat N peers via tiebreaker chain (annual fee, network, min spend). Negative = this card lost to N peers with equal cashback. Absent when no tie. */
                            tiebreaker_delta?: number;
                            card?: components["schemas"]["Card"];
                            cashback_result?: {
                                /** @description Estimated cashback per month in VND at the given monthly_spend, bounded by per-rule and global caps. */
                                cashback?: number;
                                /** @description Cashback minus prorated annual fee (monthly). */
                                net_benefit?: number;
                                /** @description Per-rule cashback breakdown. */
                                breakdown?: Record<string, never>[];
                            };
                        }[];
                        meta?: {
                            /** @description Total cards before limit */
                            total?: number;
                            ranked?: number;
                            /** @description Cards returned after limit */
                            returned?: number;
                            /** @description Human-readable note explaining how cashback estimates were calculated (e.g. assumed monthly spend amount). */
                            ranking_basis?: string;
                        };
                    };
                };
            };
            /** @description Missing or invalid request body */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    compareCards: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description 2–3 card IDs to compare.
                     * @example [
                     *       "vcb-visa-signature",
                     *       "tcb-visa-cashback"
                     *     ]
                     */
                    card_ids: string[];
                    /** @description Intent slugs for cashback estimation context. */
                    intents?: ("shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads")[];
                    /**
                     * @description Monthly spend in VND for cashback estimates. Default 3,000,000.
                     * @example 3000000
                     */
                    monthly_spend?: number;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        /** @description Comparison result keyed by card ID. */
                        data?: Record<string, never>;
                    };
                };
            };
            /** @description Missing or invalid card_ids (must be 2–3 IDs) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description One or more card IDs not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getCardById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Card ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Card"];
                    };
                };
            };
            /** @description Card not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getRelatedCards: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Card ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: (components["schemas"]["Card"] & {
                            /** @description Relevance score relative to the queried card. Higher = more relevant. Incorporates shared intents, shared card types, card data score, and cashback score. */
                            relevance_score: number;
                            /**
                             * @description Canonical path segment for the comparison page between the queried card and this partner. Always uses alphabetical ID order to avoid duplicates (e.g. "/acb-visa-vs-vib-cashback"). Append to your frontend's compare route prefix to build the full URL.
                             * @example /acb-visa-vs-vib-cashback
                             */
                            compare_path: string;
                        })[];
                        meta?: {
                            total?: number;
                            card_id?: string;
                        };
                    };
                };
            };
            /** @description Card not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    calcCardCashback: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Card ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Intent slugs to calculate for. Defaults to the card's own intents when omitted. */
                    intents?: ("shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads")[];
                    /**
                     * @description Total monthly spend in VND. Default 3,000,000.
                     * @example 3000000
                     */
                    monthly_spend?: number;
                    /** @description Explicit per-intent spend in VND (e.g. {"dining": 2000000, "travel": 1000000}). Overrides monthly_spend and intents when provided. */
                    spend_profile?: {
                        [key: string]: number;
                    };
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: {
                            card_id: string;
                            intents: string[];
                            monthly_spend: number;
                            /** @enum {string} */
                            spend_mode: "sequential" | "maximize";
                            /** @description Cashback computation result. */
                            cashback: {
                                /** @description Total cashback in VND after all caps applied. */
                                cashback: number;
                                /** @description Effective cashback rate as a percentage (e.g. 4.5 = 4.5%). */
                                actualRate: number;
                                /** @description Spend at which cashback is maximized for the top rule (0 = uncapped). */
                                optimalSpend: number;
                                /** @description Per-rule cashback breakdown. Matched rules appear first; unmatched intents are appended as zero-cashback rows (rate: 0, cashback: 0) so consumers see the full spend picture. */
                                breakdown: {
                                    cashback: number;
                                    spend: number;
                                    rate: number;
                                    intents?: string[] | null;
                                    merchants?: string[] | null;
                                    is_catchall: boolean;
                                    matched_intents?: string[];
                                    /** @description Per-intent cashback split within this rule. Only present when the rule has category_caps. */
                                    intent_breakdown?: {
                                        intent: string;
                                        cashback: number;
                                        spend: number;
                                        /** @description True when this intent hit its per-category subcap. */
                                        is_capped: boolean;
                                    }[] | null;
                                }[];
                                /** @description Explanation for zero or package-selected cashback. */
                                reason?: {
                                    /** @enum {string} */
                                    reason_type: "no_rules" | "min_spend_not_met" | "no_matching_intents" | "package_selected";
                                    /** @description Human-readable explanation. */
                                    reason: string;
                                } | null;
                                /** @description Advisory notes for the consumer. Fires when optimal cashback spend across all rules is less than min_spend_per_period — informing the consumer that some spend must go to non-cashback categories to meet the monthly minimum. */
                                notes?: string[] | null;
                            };
                        };
                    };
                };
            };
            /** @description Bad request — no intents on card and none provided in body */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Card not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAllContactless: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Contactless"][];
                        meta?: {
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getContactlessById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Contactless method ID */
                id: "apple-pay" | "google-pay" | "samsung-pay" | "garmin-pay";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Contactless"];
                    };
                };
            };
            /** @description Contactless method not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAllNetworks: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Network"][];
                        meta?: {
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getNetworkById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Network ID */
                id: "visa" | "mastercard" | "jcb" | "napas" | "amex" | "unionpay";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Network"];
                    };
                };
            };
            /** @description Network not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAllBrands: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Brand"][];
                        meta?: {
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getBrandById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Brand ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Brand"];
                    };
                };
            };
            /** @description Brand not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getComparePairs: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: {
                            /** @description First card ID (alphabetically lower) */
                            a: string;
                            /** @description Second card ID (alphabetically higher) */
                            b: string;
                            /**
                             * @description Canonical, deduplicated path segment for the comparison page. Append to your frontend compare route prefix to build the full URL.
                             * @example /acb-visa-vs-vib-cashback
                             */
                            compare_path: string;
                        }[];
                        meta?: {
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getAllPersonas: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Persona"][];
                        meta?: {
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getPersonaBySlug: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Persona slug */
                slug: "shopee" | "groceries" | "digital" | "traveler" | "commuter" | "family" | "business";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Persona"];
                    };
                };
            };
            /** @description Persona not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAllMerchants: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Merchant"][];
                        meta?: {
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getAllCashbackCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["CashbackCategory"][];
                        meta?: {
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getTiers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        /** @description Map of network ID to ordered array of tier IDs (index 0 = highest) */
                        data?: {
                            [key: string]: string[];
                        };
                        meta?: {
                            /** @description Number of networks with tier data */
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getAllIntents: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["Intent"][];
                        meta?: {
                            total?: number;
                        };
                    };
                };
            };
        };
    };
    getIntentGroups: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        data?: components["schemas"]["IntentGroupNode"][];
                    };
                };
            };
        };
    };
    getStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        all?: components["schemas"]["StatsGroup"];
                        by_type?: {
                            credit?: components["schemas"]["StatsGroup"];
                            debit?: components["schemas"]["StatsGroup"];
                            business?: components["schemas"]["StatsGroup"];
                            cashback?: components["schemas"]["StatsGroup"];
                        };
                        /** @description Map of bank_id → stats group (includes bank name) */
                        by_bank?: {
                            [key: string]: components["schemas"]["StatsGroup"] & {
                                /**
                                 * @description Bank display name
                                 * @example ACB
                                 */
                                name: string;
                            };
                        };
                    };
                };
            };
        };
    };
    getStatsHistory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        snapshots?: components["schemas"]["StatsSnapshot"][];
                        meta?: {
                            /** @description Total snapshots available */
                            total?: number;
                        };
                    };
                };
            };
        };
    };
}


// Named type aliases for convenient imports
export type Card = components['schemas']['Card']
export type Bank = components['schemas']['Bank']
export type Network = components['schemas']['Network']
export type Brand = components['schemas']['Brand']
export type Contactless = components['schemas']['Contactless']
export type FeeEntry = components['schemas']['FeeEntry']
export type FeeWaiver = components['schemas']['FeeWaiver']
export type FeeEntryWithWaiver = components['schemas']['FeeEntryWithWaiver']
export type CashbackRule = components['schemas']['CashbackRule']
export type CashbackBenefit = components['schemas']['CashbackBenefit']
export type CashbackCap = components['schemas']['CashbackCap']
export type CashbackCategory = components['schemas']['CashbackCategory']
export type Merchant = components['schemas']['Merchant']
export type Intent = components['schemas']['Intent']
export type IntentGroupNode = components['schemas']['IntentGroupNode']
export type Persona = components['schemas']['Persona']
export type RuleScope = components['schemas']['RuleScope']
export type SpendTier = components['schemas']['SpendTier']
