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
         * @description Ranks a card pool by estimated cashback per month. Three sources define the pool: `persona` (curated filter + intents), `cards` (explicit IDs), or `intents` (intent-matching gate). Pool filtering (type, network, for_business, etc.) is handled exclusively via `persona` - use the appropriate persona slug instead of passing raw filter params. Tiebreaker order: cashback desc → annual fee asc → network popularity → no min_spend_per_period.
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
    "/mcc": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Look up by MCC code
         * @description Returns merchants and card IDs that match a given 4-digit MCC code. Also returns the MCC label/slug if the code is in the MCC registry.
         */
        get: operations["lookupMcc"];
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
         * @description Returns data completeness statistics for all cards - overall, by card type (credit/debit/business/cashback), and by bank. Public endpoint, no auth required. Use to track data quality improvements over time.
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
        /** @description Fee waiver conditions for a card fee */
        FeeWaiver: {
            /** @description True when the fee is waived under the given condition */
            waiver: boolean;
            /** @description Human-readable condition for the waiver (e.g. "Chi tiêu tối thiểu 10tr/tháng") */
            condition?: string;
        };
        /** @description A single fee entry with amount, type, and an optional note */
        FeeEntry: {
            /** @description Fee amount. Interpret based on type: VND if "currency", percentage (%) if "rate" */
            amount: number;
            /**
             * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
             * @enum {string}
             */
            type: "currency" | "rate";
            /** @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | " */
            note?: string;
        };
        /** @description Fee entry with optional first-year and subsequent-year waiver conditions */
        FeeEntryWithWaiver: {
            /** @description Fee amount. Interpret based on type: VND if "currency", percentage (%) if "rate" */
            amount: number;
            /**
             * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
             * @enum {string}
             */
            type: "currency" | "rate";
            /** @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | " */
            note?: string;
            /** @description First-year waiver conditions */
            first_year?: {
                /** @description True when the fee is waived under the given condition */
                waiver: boolean;
                /** @description Human-readable condition for the waiver (e.g. "Chi tiêu tối thiểu 10tr/tháng") */
                condition?: string;
            };
            /** @description Subsequent-year waiver conditions */
            subsequent_years?: {
                /** @description True when the fee is waived under the given condition */
                waiver: boolean;
                /** @description Human-readable condition for the waiver (e.g. "Chi tiêu tối thiểu 10tr/tháng") */
                condition?: string;
            };
        };
        /** @description A supported contactless payment method */
        Contactless: {
            /** @description Unique identifier (e.g. "apple-pay") */
            id: string;
            /** @description Human-readable display name */
            name: string;
            /** @description Absolute URL to the logo image */
            logo_url: string;
            /**
             * Format: uri
             * @description Link to the contactless method homepage
             */
            link: string;
        };
        /** @description A card payment network (Visa, Mastercard, JCB, etc.) */
        Network: {
            /** @description Unique identifier (e.g. "visa") */
            id: string;
            /** @description Human-readable display name */
            name: string;
            /** @description Absolute URL to the network logo */
            logo_url: string;
            /**
             * Format: uri
             * @description Link to the network homepage
             */
            link?: string;
        };
        /** @description A co-brand partner (airline, retailer, etc.) */
        Brand: {
            /** @description Unique kebab-case identifier (e.g. "vietnam-airlines") */
            id: string;
            /** @description Human-readable display name */
            name: string;
            /** @description Absolute URL to the brand logo */
            logo_url: string;
            /**
             * Format: uri
             * @description Link to the brand homepage
             */
            link?: string;
        };
        /** @description Aggregated card stats for a bank (list endpoint) */
        BankStatsList: {
            /** @description Total number of cards from this bank */
            card_count: number;
            /** @description Number of credit cards */
            credit_count?: number;
            /** @description Number of debit cards */
            debit_count?: number;
            /** @description Highest annual fee across all cards (VND) */
            max_annual_fee?: number;
        };
        /** @description Full aggregated card stats for a bank (detail endpoint) */
        BankStatsDetail: {
            /** @description Total number of cards from this bank */
            card_count: number;
            /** @description Number of credit cards */
            credit_count?: number;
            /** @description Number of debit cards */
            debit_count?: number;
            /** @description Highest annual fee across all cards (VND) */
            max_annual_fee?: number;
            /** @description Number of hybrid (credit+debit) cards */
            hybrid_count?: number;
            /** @description Number of co-branded cards */
            co_branded_count?: number;
            /** @description Number of cards with no annual fee */
            free_annual_fee_count?: number;
            /** @description Card count per network (e.g. { "visa": 3, "mastercard": 2 }) */
            network_counts?: {
                [key: string]: number;
            };
        };
        /** @description A Vietnamese bank */
        Bank: {
            /** @description Unique kebab-case identifier (e.g. "bidv") */
            id: string;
            /** @description Short display name (e.g. "BIDV") */
            name: string;
            /** @description Full legal name in Vietnamese */
            full_name: string;
            /**
             * Format: uri
             * @description Bank homepage URL
             */
            link: string;
            /** @description Absolute URL to the bank logo */
            logo_url: string;
            /** @description Primary brand color as hex (e.g. "#036b69") */
            brand_color?: string;
            /**
             * @description Bank category: big4, foreign, digital, or commercial
             * @enum {string}
             */
            group: "big4" | "foreign" | "digital" | "commercial";
            /** @description Source references for fee data */
            sources?: {
                /** @description Human-readable label for the source (e.g. "VPBank Biểu phí thẻ tín dụng 2025") */
                label: string;
                /**
                 * Format: uri
                 * @description URL to the source document
                 */
                url: string;
                /** @description PDF page number where the data was found. Null or absent for non-PDF web sources */
                page?: number;
            }[];
            /** @description ISO timestamp of last admin edit */
            last_modified?: string | null;
            /** @description Aggregated card stats. Subset of fields on list endpoint; full stats on detail endpoint. */
            stats?: {
                /** @description Total number of cards from this bank */
                card_count: number;
                /** @description Number of credit cards */
                credit_count?: number;
                /** @description Number of debit cards */
                debit_count?: number;
                /** @description Highest annual fee across all cards (VND) */
                max_annual_fee?: number;
                /** @description Number of hybrid (credit+debit) cards */
                hybrid_count?: number;
                /** @description Number of co-branded cards */
                co_branded_count?: number;
                /** @description Number of cards with no annual fee */
                free_annual_fee_count?: number;
                /** @description Card count per network (e.g. { "visa": 3, "mastercard": 2 }) */
                network_counts?: {
                    [key: string]: number;
                };
            };
            /** @description Network IDs of cards issued by this bank */
            networks?: string[];
            /** @description Full network data for networks this bank issues cards on. Only on detail endpoint. */
            networks_data?: {
                /** @description Unique identifier (e.g. "visa") */
                id: string;
                /** @description Human-readable display name */
                name: string;
                /** @description Absolute URL to the network logo */
                logo_url: string;
                /**
                 * Format: uri
                 * @description Link to the network homepage
                 */
                link?: string;
            }[];
        };
        Merchant: {
            /** @description Unique kebab-case identifier */
            slug: string;
            /** @description Human-readable display name */
            label: string;
            /** @description Default cashback category this merchant belongs to */
            category: string;
            /**
             * Format: uri
             * @description Merchant website URL
             */
            url?: string;
            /** @description Matching brand slug in data/brands/ if this merchant has a co-branded card */
            co_brand?: string;
            /** @description MCC codes this merchant typically uses (4-digit strings, ranges like "7374-7379" allowed in source - expanded at generate time) */
            mcc?: string[];
            /** @description Payment methods accepted (e.g. "Online", "POS") */
            method?: string[];
        };
        Mcc: {
            code: string;
            /** @description Kebab-case identifier (e.g. "software") */
            slug: string;
            /** @description Human-readable label in Vietnamese */
            label: string;
        };
        CardTierData: {
            /** @description Tier identifier */
            id: string;
            /** @description Rank within the network (1 = highest). Null if tier has no defined order for this network. */
            rank: number | null;
        };
        SpendTier: {
            /** @description Minimum total monthly spend (VND) to activate this tier. Base tier must be 0. */
            min_spend: number;
            /** @description Cashback rate for this tier (decimal, e.g. 0.10 = 10%). */
            rate: number;
            /** @description Per-rule cashback cap for this tier (VND). Absent = no per-rule cap (global_cap may still apply). */
            cap?: number;
        };
        CashbackCap: {
            amount: number;
            /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
            category_caps?: {
                [key: string]: number;
            };
        };
        /** @description Scope restricts when a rule fires along channel and geography axes. Absent scope = universal (all channels + all geographies). See cashback-rules.md for defaults and migration from deprecated foreign_offline/foreign_online category strings. */
        RuleScope: {
            /**
             * @description Restrict rule to one payment channel. Absent = both online and offline.
             * @enum {string}
             */
            channel?: "online" | "offline";
            /** @description "domestic" | "foreign" | ISO 3166-1 alpha-2 country code (e.g. "JP", "TH"). Absent = all geographies. */
            geography?: string;
        };
        CashbackRule: {
            /** @description Base/guaranteed cashback rate as decimal (e.g. 0.05 = 5%). Always the minimum achievable rate for this rule. When tiers is present, set to tiers[0].rate. */
            rate: number;
            /** @description Best achievable rate if tiered or conditional (e.g. 0.10 = 10%). When tiers is present, set to tiers[last].rate. Omit entirely if flat rate. */
            rate_max?: number;
            /** @description Per-rule cashback cap. Use { amount: -1 } for explicitly unlimited. When tiers is present, set to tiers[0] cap. Absent means not specified. */
            cap?: {
                amount: number;
                /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                category_caps?: {
                    [key: string]: number;
                };
            };
            /** @description Best achievable per-rule cap when tiered. When tiers is present, set to max cap across tiers. Omit if cap is flat. */
            cap_max?: {
                amount: number;
                /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                category_caps?: {
                    [key: string]: number;
                };
            };
            /** @description Intent slugs this rule applies to (from data/intents.json). Use ["all"] for catch-all rules. Absent or empty = incomplete data, scores 0. */
            intents?: string[];
            /** @description MCC codes this rule targets (4-digit strings, ranges like "7374-7379" allowed in source - expanded at generate time). More specific than intents; matched first. */
            mcc?: string[];
            /** @description Specific merchant slugs (e.g. "grab", "shopee"). Absent means all merchants. */
            merchants?: string[];
            /** @description Scope restricts when a rule fires along channel and geography axes. Absent scope = universal (all channels + all geographies). See cashback-rules.md for defaults and migration from deprecated foreign_offline/foreign_online category strings. */
            scope?: {
                /**
                 * @description Restrict rule to one payment channel. Absent = both online and offline.
                 * @enum {string}
                 */
                channel?: "online" | "offline";
                /** @description "domestic" | "foreign" | ISO 3166-1 alpha-2 country code (e.g. "JP", "TH"). Absent = all geographies. */
                geography?: string;
            };
            /** @description Max number of intents/merchants this rule applies to per period. Use when the cardholder picks N intents each cycle (e.g. 1 = choose one). */
            max_intents?: number;
            /** @description Spend-tier array for rules where rate/cap changes based on total monthly spend. Ordered ascending by min_spend. First entry must have min_spend: 0 (base tier). When present, algorithm uses tiers for rate/cap selection; rate/rate_max/cap/cap_max fields become display-only summaries. */
            tiers?: {
                /** @description Minimum total monthly spend (VND) to activate this tier. Base tier must be 0. */
                min_spend: number;
                /** @description Cashback rate for this tier (decimal, e.g. 0.10 = 10%). */
                rate: number;
                /** @description Per-rule cashback cap for this tier (VND). Absent = no per-rule cap (global_cap may still apply). */
                cap?: number;
            }[];
            /** @description ISO 8601 date (YYYY-MM-DD) when this rule becomes active. Absent = no start restriction. */
            valid_from?: string;
            /** @description ISO 8601 date (YYYY-MM-DD, inclusive) after which this rule is expired. Absent = no end restriction. */
            valid_until?: string;
            /** @description Free-text for unlock conditions, user-selectable mechanics, specific merchant names, or exclusions that don't fit structured fields. */
            note?: string;
        };
        CashbackBenefit: {
            /** @description Ordered array of cashback rules. Most specific rule first, universal fallback last. First matching rule wins. */
            rules: {
                /** @description Base/guaranteed cashback rate as decimal (e.g. 0.05 = 5%). Always the minimum achievable rate for this rule. When tiers is present, set to tiers[0].rate. */
                rate: number;
                /** @description Best achievable rate if tiered or conditional (e.g. 0.10 = 10%). When tiers is present, set to tiers[last].rate. Omit entirely if flat rate. */
                rate_max?: number;
                /** @description Per-rule cashback cap. Use { amount: -1 } for explicitly unlimited. When tiers is present, set to tiers[0] cap. Absent means not specified. */
                cap?: {
                    amount: number;
                    /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                    category_caps?: {
                        [key: string]: number;
                    };
                };
                /** @description Best achievable per-rule cap when tiered. When tiers is present, set to max cap across tiers. Omit if cap is flat. */
                cap_max?: {
                    amount: number;
                    /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                    category_caps?: {
                        [key: string]: number;
                    };
                };
                /** @description Intent slugs this rule applies to (from data/intents.json). Use ["all"] for catch-all rules. Absent or empty = incomplete data, scores 0. */
                intents?: string[];
                /** @description MCC codes this rule targets (4-digit strings, ranges like "7374-7379" allowed in source - expanded at generate time). More specific than intents; matched first. */
                mcc?: string[];
                /** @description Specific merchant slugs (e.g. "grab", "shopee"). Absent means all merchants. */
                merchants?: string[];
                /** @description Scope restricts when a rule fires along channel and geography axes. Absent scope = universal (all channels + all geographies). See cashback-rules.md for defaults and migration from deprecated foreign_offline/foreign_online category strings. */
                scope?: {
                    /**
                     * @description Restrict rule to one payment channel. Absent = both online and offline.
                     * @enum {string}
                     */
                    channel?: "online" | "offline";
                    /** @description "domestic" | "foreign" | ISO 3166-1 alpha-2 country code (e.g. "JP", "TH"). Absent = all geographies. */
                    geography?: string;
                };
                /** @description Max number of intents/merchants this rule applies to per period. Use when the cardholder picks N intents each cycle (e.g. 1 = choose one). */
                max_intents?: number;
                /** @description Spend-tier array for rules where rate/cap changes based on total monthly spend. Ordered ascending by min_spend. First entry must have min_spend: 0 (base tier). When present, algorithm uses tiers for rate/cap selection; rate/rate_max/cap/cap_max fields become display-only summaries. */
                tiers?: {
                    /** @description Minimum total monthly spend (VND) to activate this tier. Base tier must be 0. */
                    min_spend: number;
                    /** @description Cashback rate for this tier (decimal, e.g. 0.10 = 10%). */
                    rate: number;
                    /** @description Per-rule cashback cap for this tier (VND). Absent = no per-rule cap (global_cap may still apply). */
                    cap?: number;
                }[];
                /** @description ISO 8601 date (YYYY-MM-DD) when this rule becomes active. Absent = no start restriction. */
                valid_from?: string;
                /** @description ISO 8601 date (YYYY-MM-DD, inclusive) after which this rule is expired. Absent = no end restriction. */
                valid_until?: string;
                /** @description Free-text for unlock conditions, user-selectable mechanics, specific merchant names, or exclusions that don't fit structured fields. */
                note?: string;
            }[];
            /** @description True when rules are mutually exclusive benefit packages - cardholder picks ONE rule group at card issuance and that choice is permanent. Algorithm evaluates each rule independently against the full intent set and returns the max-scoring rule only (no summing, no remaining set). Use when: bank note says "chọn 1 trong N gói khi phát hành thẻ" and each rule covers non-overlapping categories with different rates. Real example: lpbank-jcb-ultimate (Gói Chăm sóc 15% vs Gói Trải nghiệm 10%). Different from max_intents (which picks N intents per cycle within one rule) - this is a one-time permanent package choice. */
            package_exclusive?: boolean;
            /** @description Overall cashback cap across all rules combined per period. Use the lower (guaranteed) value when tiered. */
            global_cap?: {
                amount: number;
                /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                category_caps?: {
                    [key: string]: number;
                };
            };
            /** @description Best achievable overall cap when tiered (e.g. higher spend unlocks a larger global cap). Omit if global_cap is flat. */
            global_cap_max?: {
                amount: number;
                /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                category_caps?: {
                    [key: string]: number;
                };
            };
            /** @description Total spend (VND) at which global_cap_max activates instead of global_cap. Required when global_cap_max is present and the threshold differs from rule tiers. Absent = global_cap is flat (global_cap_max is display-only). */
            global_cap_threshold?: number;
            /** @description Minimum total spend in the statement period to activate any cashback (VND integer). If not met, no cashback is earned regardless of rules. */
            min_spend_per_period?: number;
            /**
             * @description How cashback is credited: automatic statement credit, user-initiated request, or pooled points redeemable later.
             * @enum {string}
             */
            redemption?: "auto_statement_credit" | "manual_request" | "points_pool";
            /** @description Computed at generate time. True when all rules have passed their valid_until date. Never set manually in source data. */
            cashback_expired?: boolean;
            /** @description Overall benefit-level conditions that don't fit rule fields. */
            note?: string;
        };
        Card: {
            /** @description Unique kebab-case card identifier (e.g. "bidv-visa-signature-credit") */
            id: string;
            /** @description Human-readable card name (e.g. "BIDV Visa Signature") */
            name: string;
            /** @description Editorial description in Vietnamese. 100–200 words covering who the card is for and key strengths. Used for SEO meta description and summaries. */
            description?: string;
            /** @description Card image data. Null if no image is available */
            image?: {
                /** @description Absolute URL to the card image (no file extension) */
                url: string;
                /** @description Image width in pixels */
                width: number | null;
                /** @description Image height in pixels */
                height: number | null;
                /**
                 * @description Card image orientation
                 * @enum {string}
                 */
                orientation: "horizontal" | "vertical";
                /** @description Low quality image placeholder (base64 data URL or blurred preview URL) */
                lqip?: string;
            } | null;
            /** @description Bank identifier matching a bank in /banks */
            bank_id: string;
            /** @description Full bank data, always included */
            bank_data?: {
                /** @description Unique kebab-case identifier (e.g. "bidv") */
                id: string;
                /** @description Short display name (e.g. "BIDV") */
                name: string;
                /** @description Full legal name in Vietnamese */
                full_name: string;
                /**
                 * Format: uri
                 * @description Bank homepage URL
                 */
                link: string;
                /** @description Absolute URL to the bank logo */
                logo_url: string;
                /** @description Primary brand color as hex (e.g. "#036b69") */
                brand_color?: string;
                /**
                 * @description Bank category: big4, foreign, digital, or commercial
                 * @enum {string}
                 */
                group: "big4" | "foreign" | "digital" | "commercial";
                /** @description Source references for fee data */
                sources?: {
                    /** @description Human-readable label for the source (e.g. "VPBank Biểu phí thẻ tín dụng 2025") */
                    label: string;
                    /**
                     * Format: uri
                     * @description URL to the source document
                     */
                    url: string;
                    /** @description PDF page number where the data was found. Null or absent for non-PDF web sources */
                    page?: number;
                }[];
                /** @description ISO timestamp of last admin edit */
                last_modified?: string | null;
                /** @description Aggregated card stats. Subset of fields on list endpoint; full stats on detail endpoint. */
                stats?: {
                    /** @description Total number of cards from this bank */
                    card_count: number;
                    /** @description Number of credit cards */
                    credit_count?: number;
                    /** @description Number of debit cards */
                    debit_count?: number;
                    /** @description Highest annual fee across all cards (VND) */
                    max_annual_fee?: number;
                    /** @description Number of hybrid (credit+debit) cards */
                    hybrid_count?: number;
                    /** @description Number of co-branded cards */
                    co_branded_count?: number;
                    /** @description Number of cards with no annual fee */
                    free_annual_fee_count?: number;
                    /** @description Card count per network (e.g. { "visa": 3, "mastercard": 2 }) */
                    network_counts?: {
                        [key: string]: number;
                    };
                };
                /** @description Network IDs of cards issued by this bank */
                networks?: string[];
                /** @description Full network data for networks this bank issues cards on. Only on detail endpoint. */
                networks_data?: {
                    /** @description Unique identifier (e.g. "visa") */
                    id: string;
                    /** @description Human-readable display name */
                    name: string;
                    /** @description Absolute URL to the network logo */
                    logo_url: string;
                    /**
                     * Format: uri
                     * @description Link to the network homepage
                     */
                    link?: string;
                }[];
            };
            /**
             * @description Card payment network (e.g. "visa", "mastercard", "jcb", "napas")
             * @enum {string}
             */
            card_network: "visa" | "mastercard" | "jcb" | "napas" | "amex" | "unionpay";
            /** @description Full network data, always included */
            card_network_data?: {
                /** @description Unique identifier (e.g. "visa") */
                id: string;
                /** @description Human-readable display name */
                name: string;
                /** @description Absolute URL to the network logo */
                logo_url: string;
                /**
                 * Format: uri
                 * @description Link to the network homepage
                 */
                link?: string;
            };
            /**
             * @description Card tier level (e.g. "signature", "platinum", "gold")
             * @enum {string}
             */
            card_tier?: "classic" | "gold" | "green" | "infinite" | "platinum" | "platinum-business" | "signature" | "standard" | "ultimate" | "world" | "world-elite";
            /** @description Enriched tier data, included when card_tier is set */
            card_tier_data?: {
                /** @description Tier identifier */
                id: string;
                /** @description Rank within the network (1 = highest). Null if tier has no defined order for this network. */
                rank: number | null;
            };
            /** @description One or more card types (e.g. ["credit", "debit"] for 2-in-1 cards) */
            card_type: ("credit" | "debit" | "prepaid" | "transit" | "atm" | "2in1" | "co-branded")[];
            /** @description Co-brand partner identifier (e.g. "vietnam-airlines") */
            co_brand?: string;
            /** @description Full brand data, included when co_brand is set */
            co_brand_data?: {
                /** @description Unique kebab-case identifier (e.g. "vietnam-airlines") */
                id: string;
                /** @description Human-readable display name */
                name: string;
                /** @description Absolute URL to the brand logo */
                logo_url: string;
                /**
                 * Format: uri
                 * @description Link to the brand homepage
                 */
                link?: string;
            };
            /** @description Default statement date (day of month) */
            statement_date?: number;
            /** @description Currency code (e.g. "VND") */
            currency?: string;
            /** @description Number of interest-free days */
            interest_free_days?: number;
            /**
             * Format: uri
             * @description Link to the card details page on the bank website
             */
            card_link?: string;
            /**
             * @description "published" = active and visible; "discontinued" = visible but no longer issued; "draft" = hidden from API
             * @enum {string}
             */
            status?: "published" | "draft" | "discontinued";
            /** @description Supported contactless payment method IDs (e.g. ["apple-pay", "google-pay"]) */
            contactless_methods?: ("apple-pay" | "google-pay" | "samsung-pay" | "garmin-pay")[];
            /** @description Full contactless method data, included when contactless_methods is set */
            contactless_methods_data?: {
                /** @description Unique identifier (e.g. "apple-pay") */
                id: string;
                /** @description Human-readable display name */
                name: string;
                /** @description Absolute URL to the logo image */
                logo_url: string;
                /**
                 * Format: uri
                 * @description Link to the contactless method homepage
                 */
                link: string;
            }[];
            /** @description Whether the card is made of metal. Absent means unspecified (assumed plastic) */
            is_metal?: boolean;
            /** @description Whether this card is intended for business use. Absent or false means personal card */
            for_business?: boolean;
            /** @description ISO timestamp of last admin edit. Null if never edited via admin */
            last_modified?: string | null;
            /** @description Fee schedule for this card */
            fees?: {
                /** @description Annual card fee. amount = base fee without waiver */
                annual?: {
                    /** @description Fee amount. Interpret based on type: VND if "currency", percentage (%) if "rate" */
                    amount: number;
                    /**
                     * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
                     * @enum {string}
                     */
                    type: "currency" | "rate";
                    /** @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | " */
                    note?: string;
                    /** @description First-year waiver conditions */
                    first_year?: {
                        /** @description True when the fee is waived under the given condition */
                        waiver: boolean;
                        /** @description Human-readable condition for the waiver (e.g. "Chi tiêu tối thiểu 10tr/tháng") */
                        condition?: string;
                    };
                    /** @description Subsequent-year waiver conditions */
                    subsequent_years?: {
                        /** @description True when the fee is waived under the given condition */
                        waiver: boolean;
                        /** @description Human-readable condition for the waiver (e.g. "Chi tiêu tối thiểu 10tr/tháng") */
                        condition?: string;
                    };
                };
                /** @description Annual fee for supplementary (add-on) cards. amount = base fee without waiver */
                annual_supplementary?: {
                    /** @description Fee amount. Interpret based on type: VND if "currency", percentage (%) if "rate" */
                    amount: number;
                    /**
                     * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
                     * @enum {string}
                     */
                    type: "currency" | "rate";
                    /** @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | " */
                    note?: string;
                    /** @description First-year waiver conditions */
                    first_year?: {
                        /** @description True when the fee is waived under the given condition */
                        waiver: boolean;
                        /** @description Human-readable condition for the waiver (e.g. "Chi tiêu tối thiểu 10tr/tháng") */
                        condition?: string;
                    };
                    /** @description Subsequent-year waiver conditions */
                    subsequent_years?: {
                        /** @description True when the fee is waived under the given condition */
                        waiver: boolean;
                        /** @description Human-readable condition for the waiver (e.g. "Chi tiêu tối thiểu 10tr/tháng") */
                        condition?: string;
                    };
                };
                /** @description One-time card issuance fee */
                issuance?: {
                    /** @description Fee amount. Interpret based on type: VND if "currency", percentage (%) if "rate" */
                    amount: number;
                    /**
                     * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
                     * @enum {string}
                     */
                    type: "currency" | "rate";
                    /** @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | " */
                    note?: string;
                };
                /** @description Card cancellation fee */
                cancellation?: {
                    /** @description Fee amount. Interpret based on type: VND if "currency", percentage (%) if "rate" */
                    amount: number;
                    /**
                     * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
                     * @enum {string}
                     */
                    type: "currency" | "rate";
                    /** @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | " */
                    note?: string;
                };
                /** @description Foreign transaction fee */
                foreign?: {
                    /** @description Fee amount. Interpret based on type: VND if "currency", percentage (%) if "rate" */
                    amount: number;
                    /**
                     * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
                     * @enum {string}
                     */
                    type: "currency" | "rate";
                    /** @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | " */
                    note?: string;
                };
                /** @description Foreign transaction fee when DCC (Dynamic Currency Conversion) is applied */
                foreign_dcc?: {
                    /** @description Fee amount. Interpret based on type: VND if "currency", percentage (%) if "rate" */
                    amount: number;
                    /**
                     * @description "currency" = amount is in VND; "rate" = amount is a percentage (%)
                     * @enum {string}
                     */
                    type: "currency" | "rate";
                    /** @description Human-readable note about the fee (e.g. conditions, variants). Parts separated by " | " */
                    note?: string;
                };
            };
            /** @description Cashback benefit data. Absent if this card has no cashback program */
            cashback?: {
                /** @description Ordered array of cashback rules. Most specific rule first, universal fallback last. First matching rule wins. */
                rules: {
                    /** @description Base/guaranteed cashback rate as decimal (e.g. 0.05 = 5%). Always the minimum achievable rate for this rule. When tiers is present, set to tiers[0].rate. */
                    rate: number;
                    /** @description Best achievable rate if tiered or conditional (e.g. 0.10 = 10%). When tiers is present, set to tiers[last].rate. Omit entirely if flat rate. */
                    rate_max?: number;
                    /** @description Per-rule cashback cap. Use { amount: -1 } for explicitly unlimited. When tiers is present, set to tiers[0] cap. Absent means not specified. */
                    cap?: {
                        amount: number;
                        /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                        category_caps?: {
                            [key: string]: number;
                        };
                    };
                    /** @description Best achievable per-rule cap when tiered. When tiers is present, set to max cap across tiers. Omit if cap is flat. */
                    cap_max?: {
                        amount: number;
                        /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                        category_caps?: {
                            [key: string]: number;
                        };
                    };
                    /** @description Intent slugs this rule applies to (from data/intents.json). Use ["all"] for catch-all rules. Absent or empty = incomplete data, scores 0. */
                    intents?: string[];
                    /** @description MCC codes this rule targets (4-digit strings, ranges like "7374-7379" allowed in source - expanded at generate time). More specific than intents; matched first. */
                    mcc?: string[];
                    /** @description Specific merchant slugs (e.g. "grab", "shopee"). Absent means all merchants. */
                    merchants?: string[];
                    /** @description Scope restricts when a rule fires along channel and geography axes. Absent scope = universal (all channels + all geographies). See cashback-rules.md for defaults and migration from deprecated foreign_offline/foreign_online category strings. */
                    scope?: {
                        /**
                         * @description Restrict rule to one payment channel. Absent = both online and offline.
                         * @enum {string}
                         */
                        channel?: "online" | "offline";
                        /** @description "domestic" | "foreign" | ISO 3166-1 alpha-2 country code (e.g. "JP", "TH"). Absent = all geographies. */
                        geography?: string;
                    };
                    /** @description Max number of intents/merchants this rule applies to per period. Use when the cardholder picks N intents each cycle (e.g. 1 = choose one). */
                    max_intents?: number;
                    /** @description Spend-tier array for rules where rate/cap changes based on total monthly spend. Ordered ascending by min_spend. First entry must have min_spend: 0 (base tier). When present, algorithm uses tiers for rate/cap selection; rate/rate_max/cap/cap_max fields become display-only summaries. */
                    tiers?: {
                        /** @description Minimum total monthly spend (VND) to activate this tier. Base tier must be 0. */
                        min_spend: number;
                        /** @description Cashback rate for this tier (decimal, e.g. 0.10 = 10%). */
                        rate: number;
                        /** @description Per-rule cashback cap for this tier (VND). Absent = no per-rule cap (global_cap may still apply). */
                        cap?: number;
                    }[];
                    /** @description ISO 8601 date (YYYY-MM-DD) when this rule becomes active. Absent = no start restriction. */
                    valid_from?: string;
                    /** @description ISO 8601 date (YYYY-MM-DD, inclusive) after which this rule is expired. Absent = no end restriction. */
                    valid_until?: string;
                    /** @description Free-text for unlock conditions, user-selectable mechanics, specific merchant names, or exclusions that don't fit structured fields. */
                    note?: string;
                }[];
                /** @description True when rules are mutually exclusive benefit packages - cardholder picks ONE rule group at card issuance and that choice is permanent. Algorithm evaluates each rule independently against the full intent set and returns the max-scoring rule only (no summing, no remaining set). Use when: bank note says "chọn 1 trong N gói khi phát hành thẻ" and each rule covers non-overlapping categories with different rates. Real example: lpbank-jcb-ultimate (Gói Chăm sóc 15% vs Gói Trải nghiệm 10%). Different from max_intents (which picks N intents per cycle within one rule) - this is a one-time permanent package choice. */
                package_exclusive?: boolean;
                /** @description Overall cashback cap across all rules combined per period. Use the lower (guaranteed) value when tiered. */
                global_cap?: {
                    amount: number;
                    /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                    category_caps?: {
                        [key: string]: number;
                    };
                };
                /** @description Best achievable overall cap when tiered (e.g. higher spend unlocks a larger global cap). Omit if global_cap is flat. */
                global_cap_max?: {
                    amount: number;
                    /** @description Per-category sub-caps within the rule cap (VND). E.g. { "insurance": 400000 } limits insurance cashback to 400k even if rule cap is higher. See cashback-rule-patterns.md Pattern 5. */
                    category_caps?: {
                        [key: string]: number;
                    };
                };
                /** @description Total spend (VND) at which global_cap_max activates instead of global_cap. Required when global_cap_max is present and the threshold differs from rule tiers. Absent = global_cap is flat (global_cap_max is display-only). */
                global_cap_threshold?: number;
                /** @description Minimum total spend in the statement period to activate any cashback (VND integer). If not met, no cashback is earned regardless of rules. */
                min_spend_per_period?: number;
                /**
                 * @description How cashback is credited: automatic statement credit, user-initiated request, or pooled points redeemable later.
                 * @enum {string}
                 */
                redemption?: "auto_statement_credit" | "manual_request" | "points_pool";
                /** @description Computed at generate time. True when all rules have passed their valid_until date. Never set manually in source data. */
                cashback_expired?: boolean;
                /** @description Overall benefit-level conditions that don't fit rule fields. */
                note?: string;
            };
            /** @description Curated list of intent slugs this card is relevant for, referencing data/intents.json. Used for filtering, recommendation, and intent coverage analytics. */
            intents?: string[];
            /** @description Source references for fee and card data */
            sources?: {
                /** @description Human-readable label for the source (e.g. "VPBank Biểu phí thẻ tín dụng 2025") */
                label: string;
                /**
                 * Format: uri
                 * @description URL to the source document
                 */
                url: string;
                /** @description PDF page number where the data was found. Null or absent for non-PDF web sources */
                page?: number;
            }[];
            /** @description Total card score (0–100) from MCDA model: fees (50%), benefits (30%), issuance (10%), cashback data (10%). Null when card lacks enough data for percentile normalization. */
            score?: number;
            /** @description Data completeness score (0–100). Weighted composite of card field completeness and cashback data completeness (60/40 split). */
            data_score?: number;
            /**
             * @description Editorial assessment of how hard it is to apply for and receive this card. easy=online/eKYC only, standard=income proof required, strict=invitation/high-income threshold.
             * @enum {string}
             */
            issuance_difficulty?: "easy" | "standard" | "strict";
            /** @description Travel benefit data - stub for future scoring. Weight currently 0 in MCDA config. */
            travel_benefit?: {
                /** @description Miles earned per VND spent (decimal) */
                miles_rate?: number;
                /** @description Whether the card includes airport lounge access */
                lounge_access?: boolean;
                /** @description Whether the card includes travel insurance */
                insurance?: boolean;
                /** @description Additional travel benefit notes in Vietnamese */
                note?: string;
            };
            /** @description Lifestyle benefit data - stub for future scoring. Weight currently 0 in MCDA config. */
            lifestyle_benefit?: {
                /** @description Cashback/rebate rate for dining (decimal) */
                dining_rate?: number;
                /** @description Cashback/rebate rate for entertainment (decimal) */
                entertainment_rate?: number;
                /** @description Additional lifestyle benefit notes in Vietnamese */
                note?: string;
            };
        };
        Persona: {
            /** @description Unique identifier for the persona */
            slug: string;
            /** @description Human-readable display name */
            label: string;
            /** @description Vietnamese display name */
            labelVi?: string;
            /** @description Short description of what the persona targets */
            note?: string;
            /** @description Intent slugs used when ranking cards under this persona. Empty for pool-filter-only personas. */
            rank_intents: string[];
            /** @description Cobrand slugs relevant to this persona. Consumers can use these to sub-filter by co_brand= when the persona has associated cobrand cards. */
            cobrands?: string[];
            /** @description CardFilter object applied to narrow the card pool. Shape varies by persona type. */
            filter: {
                [key: string]: unknown;
            };
        };
        Intent: {
            /** @description Unique kebab-case identifier. Used in card.intents[] */
            slug: string;
            /** @description Vietnamese display name */
            label: string;
            /** @description Emoji icon */
            icon: string;
            /**
             * @description Primary transaction channel for this intent
             * @enum {string}
             */
            channel: "online" | "offline" | "both";
            /**
             * @description Merchant slugs from data/merchants.json that satisfy this intent
             * @default []
             */
            merchants: string[];
            /**
             * @description Group-level intent slugs this atomic intent rolls up into (e.g. "ecommerce", "dining"). Validated against intent-groups.json.
             * @default []
             */
            groups: string[];
            /**
             * @description Brand slugs from data/brands/ that satisfy this intent
             * @default []
             */
            co_brands: string[];
        };
        IntentGroupNode: {
            slug: string;
            label: string;
            icon: string;
            /** @description Intent slugs active when this group node is selected */
            intents: string[];
            children?: components["schemas"]["IntentGroupNode"][];
        };
        StatsGroup: {
            /** @description Number of cards in this group */
            total: number;
            /** @description Average data quality score (0–100) */
            avg_score: number;
            /** @description Cards with score ≥ 90 */
            complete: number;
            /** @description Percentage of complete cards */
            complete_pct: number;
            issues: {
                /** @description Cards with at least one critical issue */
                critical: number;
                /** @description Cards with at least one important issue */
                important: number;
                /** @description Cards with at least one minor issue */
                minor: number;
            };
        };
        StatsSnapshot: {
            /** @description ISO timestamp when this snapshot was recorded */
            snapshot_at: string;
            all: {
                /** @description Number of cards in this group */
                total: number;
                /** @description Average data quality score (0–100) */
                avg_score: number;
                /** @description Cards with score ≥ 90 */
                complete: number;
                /** @description Percentage of complete cards */
                complete_pct: number;
                issues: {
                    /** @description Cards with at least one critical issue */
                    critical: number;
                    /** @description Cards with at least one important issue */
                    important: number;
                    /** @description Cards with at least one minor issue */
                    minor: number;
                };
            };
            by_type: {
                credit?: {
                    /** @description Number of cards in this group */
                    total: number;
                    /** @description Average data quality score (0–100) */
                    avg_score: number;
                    /** @description Cards with score ≥ 90 */
                    complete: number;
                    /** @description Percentage of complete cards */
                    complete_pct: number;
                    issues: {
                        /** @description Cards with at least one critical issue */
                        critical: number;
                        /** @description Cards with at least one important issue */
                        important: number;
                        /** @description Cards with at least one minor issue */
                        minor: number;
                    };
                };
                debit?: {
                    /** @description Number of cards in this group */
                    total: number;
                    /** @description Average data quality score (0–100) */
                    avg_score: number;
                    /** @description Cards with score ≥ 90 */
                    complete: number;
                    /** @description Percentage of complete cards */
                    complete_pct: number;
                    issues: {
                        /** @description Cards with at least one critical issue */
                        critical: number;
                        /** @description Cards with at least one important issue */
                        important: number;
                        /** @description Cards with at least one minor issue */
                        minor: number;
                    };
                };
                business?: {
                    /** @description Number of cards in this group */
                    total: number;
                    /** @description Average data quality score (0–100) */
                    avg_score: number;
                    /** @description Cards with score ≥ 90 */
                    complete: number;
                    /** @description Percentage of complete cards */
                    complete_pct: number;
                    issues: {
                        /** @description Cards with at least one critical issue */
                        critical: number;
                        /** @description Cards with at least one important issue */
                        important: number;
                        /** @description Cards with at least one minor issue */
                        minor: number;
                    };
                };
                cashback?: {
                    /** @description Number of cards in this group */
                    total: number;
                    /** @description Average data quality score (0–100) */
                    avg_score: number;
                    /** @description Cards with score ≥ 90 */
                    complete: number;
                    /** @description Percentage of complete cards */
                    complete_pct: number;
                    issues: {
                        /** @description Cards with at least one critical issue */
                        critical: number;
                        /** @description Cards with at least one important issue */
                        important: number;
                        /** @description Cards with at least one minor issue */
                        minor: number;
                    };
                };
            };
            by_bank: {
                [key: string]: {
                    /** @description Number of cards in this group */
                    total: number;
                    /** @description Average data quality score (0–100) */
                    avg_score: number;
                    /** @description Cards with score ≥ 90 */
                    complete: number;
                    /** @description Percentage of complete cards */
                    complete_pct: number;
                    issues: {
                        /** @description Cards with at least one critical issue */
                        critical: number;
                        /** @description Cards with at least one important issue */
                        important: number;
                        /** @description Cards with at least one minor issue */
                        minor: number;
                    };
                    name?: string;
                };
            };
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
                bank_id?: "acb" | "agribank" | "bidv" | "bvbank" | "eximbank" | "hsbc" | "kbank" | "liobank" | "lpbank" | "mb" | "msb" | "ncb" | "ocb" | "sacombank" | "seabank" | "shb" | "techcombank" | "uob" | "vib" | "vietcombank" | "vietinbank" | "vpbank" | "woori";
                /** @description Filter by co-brand partner identifier (comma-separated OR, e.g. "vietnam-airlines,grab") */
                co_brand?: string;
                /** @description Filter by spending intent slug (comma-separated OR, e.g. "shopee,lazada"). Returns cards whose intents[] array includes any of the given values. */
                intent?: "shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads" | "telecom" | "fashion" | "pets" | "books";
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
                rule_intent?: "shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads" | "telecom" | "fashion" | "pets" | "books" | "all";
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
                    intents?: ("shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads" | "telecom" | "fashion" | "pets" | "books")[];
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
                    intents?: ("shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads" | "telecom" | "fashion" | "pets" | "books")[];
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
                        /** @description Structured side-by-side comparison result. */
                        data?: {
                            /** @description Monthly spend used for cashback estimates (VND). */
                            monthly_spend: number;
                            /** @description Intent slugs used for cashback estimation, or null if none provided. */
                            intents_context?: string[] | null;
                            /** @description Intent slugs shared by all compared cards. */
                            intent_overlap: string[];
                            /** @description Per-card metadata and cashback breakdown. */
                            cards: {
                                card_id: string;
                                card_name: string;
                                bank_id: string;
                                network: string;
                                cashback_breakdown: Record<string, never>[];
                                cashback_reason?: string | null;
                                intents_used: string[];
                            }[];
                            /** @description Comparison rows - one per criterion. Values keyed by card_id. */
                            table: {
                                /**
                                 * @description Machine-readable criterion identifier.
                                 * @enum {string}
                                 */
                                criterion: "cashback_per_month" | "annual_fee" | "annual_supplementary_fee" | "issuance_fee" | "cancellation_fee" | "foreign_fee" | "foreign_dcc_fee" | "interest_free_days" | "min_spend_hurdle" | "network_rank" | "card_score" | "data_score";
                                /** @description Human-readable label for the criterion. */
                                label: string;
                                /**
                                 * @description Section grouping for display.
                                 * @enum {string}
                                 */
                                section?: "cashback" | "fees" | "payment" | "scores";
                                /**
                                 * @description Value unit for display formatting.
                                 * @enum {string|null}
                                 */
                                unit: "currency" | "percent" | "rank" | "score" | null;
                                /** @description Whether a higher value is considered better for this criterion. */
                                higher_is_better: boolean;
                                /** @description card_id of the winning card for this criterion, or null if tied. */
                                winner: string | null;
                                /** @description Criterion value for each card, keyed by card_id. */
                                values: {
                                    [key: string]: number;
                                };
                            }[];
                        };
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
                    intents?: ("shopee" | "lazada" | "tiktok-shop" | "tiki" | "ecommerce" | "grab" | "transport" | "dining" | "vietnam-airlines" | "bamboo-airways" | "agoda" | "travel" | "groceries" | "shopping" | "digital" | "insurance" | "education" | "health" | "cinema" | "entertainment" | "golf" | "ads" | "telecom" | "fashion" | "pets" | "books")[];
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
                                    /** @description True when this rule is outside its valid_from/valid_until window. Cashback is 0; spend is not consumed. */
                                    cashback_expired?: boolean;
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
                                /** @description Advisory notes for the consumer. Fires when optimal cashback spend across all rules is less than min_spend_per_period - informing the consumer that some spend must go to non-cashback categories to meet the monthly minimum. */
                                notes?: string[] | null;
                            };
                        };
                    };
                };
            };
            /** @description Bad request - no intents on card and none provided in body */
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
    lookupMcc: {
        parameters: {
            query: {
                /**
                 * @description 4-digit MCC code to look up (e.g. "7372")
                 * @example 7372
                 */
                mcc: string;
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
                        data?: {
                            /**
                             * @description The queried MCC code
                             * @example 7372
                             */
                            code: string;
                            /**
                             * @description Kebab-case slug if code is in the MCC registry
                             * @example software
                             */
                            slug?: string;
                            /**
                             * @description Vietnamese label if code is in the MCC registry
                             * @example Phần mềm
                             */
                            label?: string;
                            /** @description Merchants whose mcc[] includes this code. */
                            matched_merchants: components["schemas"]["Merchant"][];
                            /** @description IDs of cards that have a cashback rule targeting this MCC. */
                            matched_card_ids: string[];
                        };
                        meta?: {
                            merchant_count?: number;
                            card_count?: number;
                        };
                    };
                };
            };
            /** @description Missing or invalid mcc query param */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description MCC code not in registry and no matching merchants or cards */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
