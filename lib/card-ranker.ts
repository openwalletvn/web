import type {Card} from '@/lib/api';
import {calcCashback, type CashbackResult} from '@/lib/cashback-calc';

export type RankedCard = {
    card: Card;
    rank: number;
    result: CashbackResult;
};

export const DEFAULT_MONTHLY_SPEND = 3_000_000;

/**
 * Ranking factors (applied in priority order):
 * 1. Estimated monthly cashback (higher = better) — via calcCashback()
 * 2. Network popularity (lower tier = better): visa/mastercard > napas > jcb/unionpay/amex
 * 3. Annual fee (lower = better): card.fees?.annual?.amount, 0 if free
 */

// Lower = more widely accepted.
const NETWORK_POPULARITY: Record<string, number> = {
    visa: 1,
    mastercard: 1,
    napas: 2,
    jcb: 3,
    unionpay: 3,
    amex: 3,
};

/** Returns a Vietnamese label explaining why `winner` ranks above `loser` when cashback is equal. Null if no detectable reason. */
export function getTiebreakerReason(winner: Card, loser: Card): string | null {
    const netW = NETWORK_POPULARITY[winner.card_network] ?? 99;
    const netL = NETWORK_POPULARITY[loser.card_network] ?? 99;
    if (netW < netL) {
        const name = winner.card_network.charAt(0).toUpperCase() + winner.card_network.slice(1);
        return `Mạng ${name} phổ biến hơn`;
    }
    const feeW = winner.fees?.annual?.amount ?? 0;
    const feeL = loser.fees?.annual?.amount ?? 0;
    if (feeW < feeL) return feeW === 0 ? 'Miễn phí thường niên' : 'Phí thường niên thấp hơn';
    return null;
}

export function rankCards(cards: Card[], spendProfile: Record<string, number>): RankedCard[] {
    return cards
        .map(card => ({card, result: calcCashback(card, spendProfile)}))
        .sort((a, b) => {
            const cashbackDiff = b.result.cashback - a.result.cashback;
            if (cashbackDiff !== 0) return cashbackDiff;
            const netA = NETWORK_POPULARITY[a.card.card_network] ?? 99;
            const netB = NETWORK_POPULARITY[b.card.card_network] ?? 99;
            const netDiff = netA - netB;
            if (netDiff !== 0) return netDiff;
            const feeA = a.card.fees?.annual?.amount ?? 0;
            const feeB = b.card.fees?.annual?.amount ?? 0;
            return feeA - feeB;
        })
        .map((item, i) => ({...item, rank: i + 1}));
}
