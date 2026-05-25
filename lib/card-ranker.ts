import type { Card } from '@/lib/api';

export type CashbackBreakdownItem = {
    cashback: number;
    rate: number;
    rate_max?: number;
    categories?: string[];
    merchants?: string[];
    is_catchall: boolean;
};

export type RankedCard = {
    card: Card;
    rank: number;
    rank_reason: string;
    rank_reason_type: 'higher_cashback' | 'lower_annual_fee' | 'better_network' | 'no_min_spend' | 'tied' | 'baseline';
    cashback_result: {
        max_cashback: number;
        breakdown?: CashbackBreakdownItem[];
    };
};
