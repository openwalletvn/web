import type {Card, CashbackRule} from '@/lib/api';

export type RuleMatch = {
    rule: CashbackRule;
    matchedIntents: string[];
    spend: number;
    cashback: number;
};

export type CashbackResult = {
    cashback: number;       // VND earned at given spend
    actualRate: number;     // effective % (cashback / totalSpend × 100)
    optimalSpend: number;   // min spend to reach max cashback (0 = uncapped)
    breakdown: RuleMatch[];
};

const ZERO: CashbackResult = {cashback: 0, actualRate: 0, optimalSpend: 0, breakdown: []};

function ruleMatchesIntent(rule: CashbackRule, intent: string): boolean {
    if (!rule.merchants?.length && !rule.categories?.length) return true; // universal rule
    return !!(rule.merchants?.includes(intent) || rule.categories?.includes(intent));
}

function calcOptimalSpend(rate: number, cap: number | undefined): number {
    if (!cap || cap === -1) return 0; // uncapped
    return Math.ceil(cap / rate);
}

export function calcCashback(card: Card, spendProfile: Record<string, number>): CashbackResult {
    const cb = card.cashback;
    if (!cb?.rules?.length) return ZERO;

    const totalSpend = Object.values(spendProfile).reduce((a, b) => a + b, 0);
    if (totalSpend === 0) return ZERO;

    // min_spend_per_period gates ALL cashback
    if (cb.min_spend_per_period && totalSpend < cb.min_spend_per_period) return ZERO;

    // Process rules in order (specific first). Each intent claimed by first matching rule.
    const remaining = {...spendProfile};
    let totalCashback = 0;
    const breakdown: RuleMatch[] = [];

    for (const rule of cb.rules) {
        const matchedIntents = Object.keys(remaining).filter(slug => ruleMatchesIntent(rule, slug));
        if (!matchedIntents.length) continue;

        const ruleSpend = matchedIntents.reduce((s, slug) => s + remaining[slug], 0);
        const cap = rule.cap?.amount;
        const raw = ruleSpend * rule.rate;
        const ruleCashback = (cap && cap !== -1) ? Math.min(raw, cap) : raw;

        totalCashback += ruleCashback;
        breakdown.push({rule, matchedIntents, spend: ruleSpend, cashback: ruleCashback});

        for (const slug of matchedIntents) delete remaining[slug];
        if (!Object.keys(remaining).length) break;
    }

    // Apply global cap
    const globalCap = cb.global_cap?.amount;
    if (globalCap && globalCap !== -1) {
        totalCashback = Math.min(totalCashback, globalCap);
    }

    const actualRate = Math.round((totalCashback / totalSpend) * 10000) / 100;

    // optimalSpend: meaningful for single-rule single-intent; use first matched rule's cap
    const firstMatch = breakdown[0];
    const optimalSpend = firstMatch
        ? calcOptimalSpend(firstMatch.rule.rate, firstMatch.rule.cap?.amount ?? globalCap)
        : 0;

    return {cashback: Math.round(totalCashback), actualRate, optimalSpend, breakdown};
}

export function calcIntentCashback(card: Card, intentSlug: string, monthlySpend: number): CashbackResult {
    return calcCashback(card, {[intentSlug]: monthlySpend});
}
