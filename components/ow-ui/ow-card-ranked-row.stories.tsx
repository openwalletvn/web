import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwCardRankedRow} from './ow-card-ranked-row';
import type {RankedCard} from '@/lib/card-ranker';
import {DEMO_CARD_HORIZONTAL} from './ow-story-constants';

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

const baseRanked: RankedCard = {
    card: {
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
    } as RankedCard['card'],
    rank: 1,
    rank_reason: 'Hoàn tiền cao nhất trong danh mục ăn uống',
    rank_reason_type: 'higher_cashback',
    tiebreaker_delta: undefined,
    cashback_result: {cashback: 150000, breakdown: []},
};

export const ResponsiveOverview: Story = {
    render: (args) => (
        <div className="flex flex-col gap-8">
            {([1024, 768, 640, 375] as const).map(w => (
                <div key={w}>
                    <p className="text-xs text-gray-400 mb-2">{w}px container</p>
                    <div style={{maxWidth: w}} className="ring">
                        <OwCardRankedRow {...args} />
                    </div>
                </div>
            ))}
        </div>
    ),
    args: {ranked: baseRanked},
};

export const Default: Story = {
    args: {ranked: baseRanked},
};

export const Muted: Story = {
    args: {ranked: {...baseRanked, rank: 4}, muted: true},
};

export const WithTiebreakerUp: Story = {
    args: {ranked: {...baseRanked, tiebreaker_delta: 2}},
};

export const WithTiebreakerDown: Story = {
    args: {ranked: {...baseRanked, rank: 3, tiebreaker_delta: -1}},
};

export const WithIntentChips: Story = {
    args: {
        ranked: baseRanked,
        intentMap: new Map([
            ['dining', {slug: 'dining', label: 'Ăn uống', icon: '🍜'}],
            ['shopping', {slug: 'shopping', label: 'Mua sắm', icon: '🛍️'}],
        ]),
        highlightedSlugs: ['dining'],
        intentSlug: 'dining',
    },
};

export const WithRankReason: Story = {
    args: {
        ranked: {
            ...baseRanked,
            rank_reason: 'Miễn phí thường niên, tiết kiệm hơn thẻ tương đương',
            rank_reason_type: 'lower_annual_fee',
        },
    },
};
