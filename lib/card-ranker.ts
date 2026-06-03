import type { Card, CashbackResult } from '@/lib/api';

export type RankedCard = {
    card: Card;
    rank: number;
    rank_reason: string;
    rank_reason_type: 'higher_cashback' | 'lower_annual_fee' | 'better_network' | 'no_min_spend' | 'tied' | 'baseline';
    tiebreaker_delta?: number;
    cashback_result: {
        cashback: number;
        net_benefit?: number;
    };
    cashback_breakdown?: CashbackResult | null;
};
