import type { Card } from '@/lib/api';

export type RankedCard = {
    card: Card;
    rank: number;
    cashback_result: {
        cashback: number;
        actual_rate: number;
        optimal_spend: number;
    };
};

export const DEFAULT_MONTHLY_SPEND = 3_000_000;

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
    const feeW = winner.fees?.annual?.amount ?? 0;
    const feeL = loser.fees?.annual?.amount ?? 0;
    if (feeW < feeL) {
        return feeW === 0
            ? `Miễn phí thường niên · ${loser.name} tính phí`
            : `Phí thường niên thấp hơn ${loser.name}`;
    }
    const netW = NETWORK_POPULARITY[winner.card_network] ?? 99;
    const netL = NETWORK_POPULARITY[loser.card_network] ?? 99;
    if (netW < netL) {
        const w = winner.card_network.charAt(0).toUpperCase() + winner.card_network.slice(1);
        const l = loser.card_network.charAt(0).toUpperCase() + loser.card_network.slice(1);
        return `${w} phổ biến hơn ${l}`;
    }
    return null;
}
