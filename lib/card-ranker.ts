import type { Card } from '@/lib/api';

export type IntentBreakdownItem = {
    intent: string;
    cashback: number;
    is_capped: boolean;
};

export type CashbackBreakdownItem = {
    cashback: number;
    rate: number;
    rate_max?: number;
    intents?: string[];
    merchants?: string[];
    is_catchall: boolean;
    matched_intents?: string[];
    intent_breakdown?: IntentBreakdownItem[];
};

export type RankedCard = {
    card: Card;
    rank: number;
    rank_reason: string;
    rank_reason_type: 'higher_cashback' | 'lower_annual_fee' | 'better_network' | 'no_min_spend' | 'tied' | 'baseline';
    tiebreaker_delta?: number;
    cashback_result: {
        cashback: number;
        breakdown?: CashbackBreakdownItem[];
    };
};
