import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import type {Merchant} from '@/lib/api';
import {IntentModel} from '@/lib/intent-model';
import {OwCardCashbackRule} from './ow-card-cashback-rule';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwCardCashbackRule> = {
    component: OwCardCashbackRule,
    title: 'Card UI/OwCardCashbackRule',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Renders a single cashback rule: rate, scope, validity, spend tiers, applicable intents/merchants, cap, and note. Used inside the card detail cashback section.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwCardCashbackRule>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const INTENT_MAP = IntentModel.toMap([
    {slug: 'dining', label: 'Ăn uống', icon: '🍜', channel: 'both', merchants: [], groups: [], co_brands: []},
    {slug: 'shopping', label: 'Mua sắm', icon: '👗', channel: 'both', merchants: [], groups: [], co_brands: []},
    {slug: 'grab', label: 'Grab', icon: '🚗', channel: 'both', merchants: [], groups: [], co_brands: []},
    {slug: 'shopee', label: 'Shopee', icon: '🛍️', channel: 'online', merchants: [], groups: [], co_brands: []},
    {slug: 'digital', label: 'Dịch vụ số', icon: '📱', channel: 'online', merchants: [], groups: [], co_brands: []},
    {slug: 'travel', label: 'Du lịch', icon: '🌏', channel: 'both', merchants: [], groups: [], co_brands: []},
]);

const MERCHANT_MAP = new Map<string, Merchant>([
    ['lazada', {slug: 'lazada', label: 'Lazada', category: 'ecommerce', url: 'https://lazada.vn'}],
    ['tiki', {slug: 'tiki', label: 'Tiki', category: 'ecommerce', url: 'https://tiki.vn'}],
]);

// ─── Overview ─────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Standard — intents + cap">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.05,
                        intents: ['dining', 'shopping'],
                        cap: {amount: 200000},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Catch-all (tất cả chi tiêu còn lại)">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.003,
                        intents: ['all'],
                        cap: {amount: 50000},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Online scope">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.06,
                        intents: ['shopee', 'grab'],
                        scope: {channel: 'online'},
                        cap: {amount: 300000},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Offline + domestic scope">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.02,
                        intents: ['dining'],
                        scope: {channel: 'offline', geography: 'domestic'},
                        cap: {amount: 100000},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Rate range (rate_max)">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.03,
                        rate_max: 0.08,
                        intents: ['digital', 'travel'],
                        cap: {amount: -1},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Spend tiers">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.01,
                        intents: ['shopping'],
                        cap: {amount: 500000},
                        tiers: [
                            {min_spend: 0, rate: 0.01, cap: 50000},
                            {min_spend: 3000000, rate: 0.03, cap: 150000},
                            {min_spend: 10000000, rate: 0.05, cap: 500000},
                        ],
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Merchants">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.1,
                        merchants: ['lazada', 'tiki'],
                        cap: {amount: 200000},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Validity window">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.05,
                        intents: ['dining'],
                        valid_from: '2026-01-01',
                        valid_until: '2026-12-31',
                        cap: {amount: 200000},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Expired rule (opacity-50)">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.05,
                        intents: ['dining'],
                        valid_until: '2024-12-31',
                        cap: {amount: 200000},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="With note">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.05,
                        intents: ['grab'],
                        cap: {amount: 100000},
                        note: 'Áp dụng cho Grab Food, GrabCar. Không áp dụng GrabBike.',
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Multiple intents">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.05,
                        intents: ['dining', 'shopping', 'grab', 'shopee', 'digital'],
                        cap: {amount: 300000},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
            <OwStorySection title="Unlimited cap">
                <OwCardCashbackRule
                    rule={{
                        rate: 0.003,
                        intents: ['all'],
                        cap: {amount: -1},
                    }}
                    intentMap={INTENT_MAP}
                    merchantMap={MERCHANT_MAP}
                />
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ───────────────────────────────────────────────────────────────

export const StandardIntents: Story = {
    render: () => (
        <OwCardCashbackRule
            rule={{
                rate: 0.05,
                intents: ['dining', 'shopping'],
                cap: {amount: 200000},
            }}
            intentMap={INTENT_MAP}
            merchantMap={MERCHANT_MAP}
        />
    ),
};

export const CatchAll: Story = {
    render: () => (
        <OwCardCashbackRule
            rule={{
                rate: 0.003,
                intents: ['all'],
                cap: {amount: 50000},
            }}
            intentMap={INTENT_MAP}
            merchantMap={MERCHANT_MAP}
        />
    ),
};

export const OnlineScope: Story = {
    render: () => (
        <OwCardCashbackRule
            rule={{
                rate: 0.06,
                intents: ['shopee'],
                scope: {channel: 'online'},
                cap: {amount: 300000},
            }}
            intentMap={INTENT_MAP}
            merchantMap={MERCHANT_MAP}
        />
    ),
};

export const SpendTiers: Story = {
    render: () => (
        <OwCardCashbackRule
            rule={{
                rate: 0.01,
                intents: ['shopping'],
                cap: {amount: 500000},
                tiers: [
                    {min_spend: 0, rate: 0.01, cap: 50000},
                    {min_spend: 3000000, rate: 0.03, cap: 150000},
                    {min_spend: 10000000, rate: 0.05, cap: 500000},
                ],
            }}
            intentMap={INTENT_MAP}
            merchantMap={MERCHANT_MAP}
        />
    ),
};

export const Expired: Story = {
    render: () => (
        <OwCardCashbackRule
            rule={{
                rate: 0.05,
                intents: ['dining'],
                valid_until: '2024-12-31',
                cap: {amount: 200000},
            }}
            intentMap={INTENT_MAP}
            merchantMap={MERCHANT_MAP}
        />
    ),
};

export const WithMerchants: Story = {
    render: () => (
        <OwCardCashbackRule
            rule={{
                rate: 0.1,
                merchants: ['lazada', 'tiki'],
                cap: {amount: 200000},
            }}
            intentMap={INTENT_MAP}
            merchantMap={MERCHANT_MAP}
        />
    ),
};
