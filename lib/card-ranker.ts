import type {Card} from '@/lib/api';
import {calcCashback, type CashbackResult} from '@/lib/cashback-calc';

export type RankedCard = {
    card: Card;
    rank: number;
    result: CashbackResult;
};

export const DEFAULT_MONTHLY_SPEND = 3_000_000;

/**
 * Ranks cards by estimated monthly cashback for a given spend profile.
 * Cards with no matching rules or unmet min_spend land at the bottom (cashback = 0).
 *
 * For single-intent pages: rankCards(cards, { shopee: DEFAULT_MONTHLY_SPEND })
 * For recommendation:      rankCards(cards, { shopee: 3_000_000, dining: 2_000_000 })
 */
export function rankCards(cards: Card[], spendProfile: Record<string, number>): RankedCard[] {
    return cards
        .map(card => ({card, result: calcCashback(card, spendProfile)}))
        .sort((a, b) => b.result.cashback - a.result.cashback)
        .map((item, i) => ({...item, rank: i + 1}));
}
