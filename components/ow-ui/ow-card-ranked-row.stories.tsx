import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwCardRankedRow} from './ow-card-ranked-row';
import type {RankedCard} from '@/lib/card-ranker';
import {DEMO_CARD_HORIZONTAL, DEMO_CARD_VERTICAL} from './ow-story-constants';

const meta: Meta<typeof OwCardRankedRow> = {
    component: OwCardRankedRow,
    title: 'Card UI/OwCardRankedRow',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Displays a ranked card row with cashback info, intent chips, and rank badge. Used in ranking tables and card match finder.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwCardRankedRow>;

const baseCard: RankedCard['card'] = {
    id: DEMO_CARD_HORIZONTAL.id,
    name: DEMO_CARD_HORIZONTAL.name,
    bank_id: 'msb',
    card_type: ['credit'],
    card_network: 'visa',
    image: DEMO_CARD_HORIZONTAL.image,
    fees: {annual: {amount: 0, type: 'currency' as const}},
    cashback: {
        min_spend_per_period: 3000000,
        rules: [
            {rate: 0.05, intents: ['dining', 'shopping'], merchants: [], scope: {}},
            {rate: 0.01, intents: ['all-spend'], merchants: [], scope: {}},
        ],
    },
} as RankedCard['card'];

const baseRanked: RankedCard = {
    card: baseCard,
    rank: 1,
    rank_reason: 'Hoàn tiền cao nhất trong danh mục ăn uống',
    rank_reason_type: 'higher_cashback',
    tiebreaker_delta: undefined,
    cashback_result: {cashback: 150000},
};

const intentMap = new Map([
    ['dining', {slug: 'dining', label: 'Ăn uống', icon: '🍜'}],
    ['shopping', {slug: 'shopping', label: 'Mua sắm', icon: '🛍️'}],
    ['travel', {slug: 'travel', label: 'Du lịch', icon: '✈️'}],
    ['fuel', {slug: 'fuel', label: 'Xăng dầu', icon: '⛽'}],
]);

const verticalCard: RankedCard['card'] = {
    id: DEMO_CARD_VERTICAL.id,
    name: DEMO_CARD_VERTICAL.name,
    bank_id: 'sacombank',
    card_type: ['debit'],
    card_network: 'mastercard',
    image: DEMO_CARD_VERTICAL.image,
    fees: {annual: {amount: 399000, type: 'currency' as const}},
    cashback: {
        min_spend_per_period: 5000000,
        rules: [
            {rate: 0.03, intents: ['travel', 'fuel'], merchants: [], scope: {}},
            {rate: 0.02, intents: ['all-online'], merchants: [], scope: {channel: 'online'}},
            {rate: 0.005, intents: ['all-spend'], merchants: [], scope: {}},
        ],
    },
} as RankedCard['card'];

const rows: Array<{label: string; ranked: RankedCard; intentMap?: typeof intentMap; highlightedSlugs?: string[]; intentSlug?: string}> = [
    {
        label: 'horizontal · intents highlighted · tiebreaker +2',
        ranked: {...baseRanked, rank: 1, tiebreaker_delta: 2},
        intentMap,
        highlightedSlugs: ['dining'],
        intentSlug: 'dining',
    },
    {
        label: 'vertical · paid fee · reason shown',
        ranked: {
            card: verticalCard,
            rank: 1,
            rank_reason: 'Miễn phí thường niên, tiết kiệm hơn thẻ tương đương',
            rank_reason_type: 'lower_annual_fee',
            tiebreaker_delta: undefined,
            cashback_result: {cashback: 195000},
        },
        intentMap,
    },
    {
        label: 'zero cashback',
        ranked: {...baseRanked, rank: 1, cashback_result: {cashback: 0}},
    },
];

// ─── Responsive layout ────────────────────────────────────────────────────────

export const ResponsiveOverview: Story = {
    render: () => (
        <div className="flex flex-col gap-10">
            {([1024, 768, 640, 375] as const).map(w => (
                <div key={w}>
                    <p className="text-sm font-semibold text-gray-500 mb-3">{w}px container</p>
                    <div style={{maxWidth: w}} className="flex flex-col divide-y border rounded">
                        {rows.map(({label, ...props}) => (
                            <div key={label} className="p-3">
                                <p className="text-[10px] text-gray-400 mb-2">{label}</p>
                                <OwCardRankedRow {...props} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
};

// ─── Rank badge variants ──────────────────────────────────────────────────────

export const AllRanks: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            {[1, 2, 3, 4, 10].map(rank => (
                <div key={rank}>
                    <p className="text-xs text-gray-400 mb-1">rank={rank}</p>
                    <OwCardRankedRow ranked={{...baseRanked, rank}}/>
                </div>
            ))}
        </div>
    ),
};

// ─── Tiebreaker delta ─────────────────────────────────────────────────────────

export const TiebreakerUp: Story = {
    args: {ranked: {...baseRanked, tiebreaker_delta: 2}},
};

export const TiebreakerDown: Story = {
    args: {ranked: {...baseRanked, rank: 3, tiebreaker_delta: -1}},
};

// ─── Rank reason ─────────────────────────────────────────────────────────────

export const RankReasonLowerFee: Story = {
    args: {
        ranked: {
            ...baseRanked,
            rank_reason: 'Miễn phí thường niên, tiết kiệm hơn thẻ tương đương',
            rank_reason_type: 'lower_annual_fee',
        },
    },
};

export const RankReasonHiddenForHigherCashback: Story = {
    name: 'RankReason hidden (higher_cashback)',
    args: {
        ranked: {
            ...baseRanked,
            rank_reason: 'This should NOT be shown',
            rank_reason_type: 'higher_cashback',
        },
    },
};

// ─── Cashback display variants ────────────────────────────────────────────────

export const ZeroCashback: Story = {
    args: {ranked: {...baseRanked, cashback_result: {cashback: 0}}},
};

export const WithCashback: Story = {
    args: {
        ranked: {
            ...baseRanked,
            cashback_result: {cashback: 195000},
        },
        intentMap,
    },
};

export const WithBreakdown: Story = {
    args: {
        ranked: {
            ...baseRanked,
            cashback_result: {cashback: 195000},
            cashback_breakdown: {
                total_cashback: 195000,
                effective_rate: 0.065,
                by_intent: {
                    dining: {budget: 2_000_000, rate: 0.05, cashback: 100_000},
                    shopping: {budget: 1_000_000, rate: 0.05, cashback: 50_000},
                    travel: {budget: 900_000, rate: 0.05, cashback: 45_000},
                },
                by_card: {'msb-visa-platinum': {notes: ['Chi tiêu tối thiểu chưa đủ để hoàn tiền tối đa']}},
            },
        },
        intentMap,
    },
};

// ─── Annual fee variants ──────────────────────────────────────────────────────

export const PaidAnnualFee: Story = {
    args: {
        ranked: {
            ...baseRanked,
            card: {...baseCard, fees: {annual: {amount: 399000, type: 'currency' as const}}},
        },
    },
};

export const NoMinSpend: Story = {
    args: {
        ranked: {
            ...baseRanked,
            card: {...baseCard, cashback: {rules: baseCard.cashback!.rules}},
        },
    },
};

// ─── Card type variants ───────────────────────────────────────────────────────

export const CardTypeDebit: Story = {
    args: {ranked: {...baseRanked, card: {...baseCard, card_type: ['debit']}}},
};

export const CardTypeHybrid: Story = {
    args: {ranked: {...baseRanked, card: {...baseCard, card_type: ['credit', 'debit']}}},
};

// ─── Intent chips ─────────────────────────────────────────────────────────────

export const IntentChipsNoHighlight: Story = {
    args: {ranked: baseRanked, intentMap},
};

export const IntentChipsHighlighted: Story = {
    args: {ranked: baseRanked, intentMap, highlightedSlugs: ['dining'], intentSlug: 'dining'},
};

export const IntentChipsWithCatchall: Story = {
    args: {
        ranked: {
            ...baseRanked,
            card: {
                ...baseCard,
                cashback: {
                    min_spend_per_period: 3000000,
                    rules: [
                        {rate: 0.05, intents: ['dining'], merchants: [], scope: {}},
                        {rate: 0.02, intents: ['all-online'], merchants: [], scope: {channel: 'online'}},
                        {rate: 0.01, intents: ['all-spend'], merchants: [], scope: {}},
                    ],
                },
            },
        },
        intentMap,
        highlightedSlugs: ['dining'],
        intentSlug: 'dining',
    },
};
