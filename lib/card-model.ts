import type {Card} from '@/lib/api';
import {getCardImageUrl} from '@/lib/api';
import {buildSlugRateMap, getRateDisplay} from './card-display-utils';
import {
    getNextDueDate,
    getNextDueDiff,
    getTimelineForCard,
    resolveStatementDay,
    type TimelineResult,
} from './card-dates';

/**
 * Domain model for a catalog card. Wraps a plain `Card` API object and exposes
 * all display/computation helpers as instance methods.
 *
 * **Usage:** construct at the call site from any `Card` prop or API result —
 * `new CardModel(card)` — then use `card.` autocomplete to discover methods.
 * The underlying data object is never mutated; the class is stateless.
 *
 * **RSC / serialization:** pass the raw `Card` across server→client boundaries
 * as usual; reconstruct `new CardModel(card)` inside the client component.
 *
 * **Future:** intended to be extracted to `@openwallet/card` so third-party
 * integrations share the same computation layer.
 *
 * ## Raw data getters
 * All schema field access goes through typed getters below. If the API renames
 * a field (e.g. `bank_data` → `bank`), update the getter — zero call-site churn.
 */
export class CardModel {
    constructor(private readonly data: Card) {
    }

    // ─── Raw data getters (SSOT for schema field access) ──────────────────────

    /** The card's unique id. */
    getId(): string {
        return this.data.id;
    }

    /** The card's display name. */
    getName(): string {
        return this.data.name;
    }

    /** Resolved bank object attached to this card, or `undefined` when not populated. */
    getBankData(): Card['bank_data'] {
        return this.data.bank_data;
    }

    /** Resolved card-network object (Visa, MC, JCB…), or `undefined` when not populated. */
    getNetworkData(): Card['card_network_data'] {
        return this.data.card_network_data;
    }

    /** Resolved contactless-payment method objects, empty array when none. */
    getContactlessMethods(): NonNullable<Card['contactless_methods_data']> {
        return this.data.contactless_methods_data ?? [];
    }

    /** Raw card-type array (e.g. `['credit', 'hybrid']`). */
    getCardTypes(): Card['card_type'] {
        return this.data.card_type;
    }

    /** Intent slugs this card covers (e.g. `['shopee', 'groceries']`), empty array when none. */
    getIntents(): string[] {
        return this.data.intents ?? [];
    }

    /** Catalog statement close day (1–31), or `undefined` when not set. */
    getStatementDate(): number | undefined {
        return this.data.statement_date;
    }

    /** Number of interest-free days from statement close to payment due, or `undefined`. */
    getInterestFreeDays(): number | undefined {
        return this.data.interest_free_days;
    }

    /** Full cashback config block, or `undefined` when the card has no cashback programme. */
    getCashback(): Card['cashback'] {
        return this.data.cashback;
    }

    /** Cashback rules array, empty when the card has no cashback programme. */
    getCashbackRules(): NonNullable<Card['cashback']>['rules'] {
        return this.data.cashback?.rules ?? [];
    }

    /** Fee block, or `undefined` when not populated. */
    getFees(): Card['fees'] {
        return this.data.fees;
    }

    /** Card image metadata block, or `undefined`/`null` when not available. */
    getImage(): Card['image'] {
        return this.data.image;
    }

    /** Absolute URL to the card image, or empty string when unavailable. */
    getCardImageUrl(): string {
        return getCardImageUrl(this.data);
    }

    /** Card status (`'published'` | `'discontinued'` | `'draft'`), or `undefined`. */
    getStatus(): Card['status'] {
        return this.data.status;
    }

    /** Card tier slug (e.g. `'signature'`, `'platinum'`), or `undefined`. */
    getCardTier(): Card['card_tier'] {
        return this.data.card_tier;
    }

    /** Resolved card-tier data object, or `undefined` when not populated. */
    getCardTierData(): Card['card_tier_data'] {
        return this.data.card_tier_data;
    }

    /** Whether this is a metal card. */
    isMetal(): boolean {
        return this.data.is_metal === true;
    }

    /** External URL to the card's official page, or `undefined`. */
    getCardLink(): string | undefined {
        return this.data.card_link;
    }

    /** Bank ID string (e.g. `'bidv'`). */
    getBankId(): string {
        return this.data.bank_id;
    }

    /** Card's payment network (e.g. `'visa'`, `'mastercard'`). */
    getCardNetwork(): Card['card_network'] {
        return this.data.card_network;
    }

    /** Co-brand partner identifier, or `undefined` when none. */
    getCoBrand(): Card['co_brand'] {
        return this.data.co_brand;
    }

    /** Resolved co-brand data object, or `undefined` when not populated. */
    getCoBrandData(): Card['co_brand_data'] {
        return this.data.co_brand_data;
    }

    /** Whether this card targets business customers. */
    isForBusiness(): boolean {
        return this.data.for_business === true;
    }

    /** Editorial description in Vietnamese, or `undefined`. */
    getDescription(): string | undefined {
        return this.data.description;
    }

    /** Source reference array, or `undefined`. */
    getSources(): Card['sources'] {
        return this.data.sources;
    }

    /** ISO timestamp of last admin edit, or `undefined`. */
    getLastModified(): string | null | undefined {
        return this.data.last_modified;
    }

    /** Returns the underlying raw `Card` object. Use only at serialization/API boundaries. */
    toRaw(): Card {
        return this.data;
    }

    // ─── Display / computation methods ────────────────────────────────────────

    /**
     * Returns the cashback rate display string for this card, e.g. `"5%"` or `"1%–3%"`.
     *
     * When `intentSlug` is provided, matches rules that cover that specific intent or
     * merchant before falling back to catch-all rules (`all`, `all-online`, `all-offline`).
     * Returns an empty string when no applicable rules exist.
     */
    getRateDisplay(intentSlug?: string): string {
        return getRateDisplay(this.data, intentSlug);
    }

    /**
     * Builds a `Map<slug, rate>` of all non-catch-all intent and merchant slugs
     * to their cashback rates. Useful for rendering per-intent rate badges.
     *
     * First-write-wins: if a slug appears in multiple rules the highest-priority
     * (earliest) rule's rate is kept.
     */
    buildSlugRateMap(): Map<string, number> {
        return buildSlugRateMap(this.data.cashback?.rules ?? []);
    }

    /**
     * Resolves the effective statement day (1–31) for this card.
     *
     * Priority: `walletStatementDate` (user override) → `card.statement_date` (catalog default).
     * Guards against `NaN` produced by `parseInt('')`.
     * Returns `null` when neither source provides a valid day.
     */
    resolveStatementDay(walletStatementDate?: number | null): number | null {
        return resolveStatementDay(walletStatementDate, this.data.statement_date);
    }

    /**
     * Returns the next upcoming payment due `Date` for this card, or `null` when
     * the statement day or interest-free days are unavailable.
     *
     * @param walletStatementDate - Optional user override for the statement day (1–31).
     * @param today - Defaults to `new Date()`. Pass an explicit value in tests.
     */
    getNextDueDate(walletStatementDate?: number | null, today?: Date): Date | null {
        const day = this.resolveStatementDay(walletStatementDate);
        return getNextDueDate(day, this.data.interest_free_days, today);
    }

    /**
     * Returns the next due date and how many days until it (negative = overdue),
     * or `null` when the statement day or interest-free days are unavailable.
     *
     * @param walletStatementDate - Optional user override for the statement day (1–31).
     * @param today - Defaults to `new Date()`. Pass an explicit value in tests.
     */
    getNextDueDiff(walletStatementDate?: number | null, today?: Date): { dueDate: Date; dueDiff: number } | null {
        const day = this.resolveStatementDay(walletStatementDate);
        return getNextDueDiff(day, this.data.interest_free_days, today);
    }

    /**
     * Returns the full billing-cycle timeline (milestones + summary string) for display,
     * or `null` when the card lacks the required statement day or interest-free days data.
     *
     * Chains internally: resolveStatementDay → getRelatedStatements → getMilestones →
     * getDisplayMilestones → summary string.
     *
     * @param walletStatementDate - Optional user override for the statement day (1–31).
     * @param today - Defaults to `new Date()`. Pass an explicit value in tests.
     */
    getTimeline(walletStatementDate?: number | null, today?: Date): TimelineResult | null {
        const day = this.resolveStatementDay(walletStatementDate);
        if (day == null || this.data.interest_free_days == null) return null;
        return getTimelineForCard(day, this.data.interest_free_days, today);
    }
}
