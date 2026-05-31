import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {IconStarFilled} from '@tabler/icons-react';
import {OwBadge, OwBadges} from './ow-badge';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwBadge> = {
    component: OwBadge,
    title: 'OW UI/OwBadge',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: [
                    'Single primitive for all badge and chip UI. Replaces `OwChip`, `OwCardBadge`, and `OwIntentBadge`.',
                    '',
                    '**Variants:** `intent` | `network` | `contactless` | `card-type` | `metal` | _(default)_',
                    '',
                    'All variants support `active` and `asChild` for interactive use:',
                    '',
                    '```tsx',
                    '// display',
                    '<OwBadge variant="intent" slug="dining" emoji="🍜" label="Dining" highlighted />',
                    '',
                    '// interactive button',
                    '<OwBadge asChild active={selected} onClick={toggle}>',
                    '  <button>Filter</button>',
                    '</OwBadge>',
                    '```',
                    '',
                    '**Color system:** `intent` and `network` variants resolve color from slug/id to hex, then compute `rgba` for bg/border/text — no Tailwind color classes. Pass `colorHex` on the default variant for custom brand color.',
                    '',
                    '**Wrapper:** Always use `<OwBadges>` to group multiple badges. Never use raw `flex flex-wrap` divs.',
                ].join('\n'),
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwBadge>;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SAMPLE_INTENTS = [
    {slug: 'shopee',           emoji: '🛍️', label: 'Shopee',           rate: 0.05},
    {slug: 'grab',             emoji: '🚗', label: 'Grab',             rate: 0.06},
    {slug: 'dining',           emoji: '🍜', label: 'Ăn uống',          rate: 0.03},
    {slug: 'travel',           emoji: '🌏', label: 'Du lịch',          rate: 0.05},
    {slug: 'groceries',        emoji: '🛒', label: 'Siêu thị',         rate: 0.02},
    {slug: 'shopping',         emoji: '👗', label: 'Mua sắm',          rate: 0.015},
    {slug: 'digital',          emoji: '📱', label: 'Dịch vụ số',       rate: 0.1},
    {slug: 'cinema',           emoji: '🎬', label: 'Điện ảnh',         rate: 0.05},
    {slug: 'health',           emoji: '🏥', label: 'Y tế',             rate: 0.02},
    {slug: 'insurance',        emoji: '🛡️', label: 'Bảo hiểm',        rate: 0.02},
    {slug: 'education',        emoji: '📚', label: 'Giáo dục',         rate: 0.02},
    {slug: 'golf',             emoji: '⛳', label: 'Golf',             rate: 0.05},
    {slug: 'vietnam-airlines', emoji: '✈️', label: 'Vietnam Airlines', rate: 0.05},
];

const NETWORKS = [
    {id: 'visa' as const, name: 'Visa', logo_url: '/images/networks/visa.png'},
    {id: 'mastercard' as const, name: 'Mastercard', logo_url: '/images/networks/mastercard.png'},
    {id: 'jcb' as const, name: 'JCB', logo_url: '/images/networks/jcb.png'},
    {id: 'napas' as const, name: 'NAPAS', logo_url: '/images/networks/napas.png'},
    {id: 'amex' as const, name: 'American Express', logo_url: '/images/networks/amex.png'},
    {id: 'unionpay' as const, name: 'UnionPay', logo_url: '/images/networks/unionpay.png'},
];

const CARD_TYPES = ['credit', 'debit', 'prepaid', '2in1', 'co-branded', 'atm', 'transit'] as const;

const CONTACTLESS = [
    {id: 'apple-pay' as const, name: 'Apple Pay', logo_url: '/images/wallets/apple-pay.png', link: ''},
    {id: 'google-pay' as const, name: 'Google Pay', logo_url: '/images/wallets/google-pay.png', link: ''},
    {id: 'samsung-pay' as const, name: 'Samsung Pay', logo_url: '/images/wallets/samsung-pay.png', link: ''},
    {id: 'garmin-pay' as const, name: 'Garmin Pay', logo_url: '/images/wallets/garmin-pay.png', link: ''},
];

// ─── Overview ─────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Intent — highlighted">
                <OwBadges>
                    {SAMPLE_INTENTS.map(i => (
                        <OwBadge key={i.slug} variant="intent" slug={i.slug} emoji={i.emoji} label={i.label} rate={i.rate} highlighted/>
                    ))}
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Intent — base">
                <OwBadges>
                    {SAMPLE_INTENTS.map(i => (
                        <OwBadge key={i.slug} variant="intent" slug={i.slug} emoji={i.emoji} label={i.label} rate={i.rate}/>
                    ))}
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Intent — unknown slug fallback">
                <OwBadges>
                    <OwBadge variant="intent" slug="unknown-slug" emoji="❓" label="Unknown" rate={0.02}/>
                    <OwBadge variant="intent" slug="unknown-slug" emoji="❓" label="Unknown" rate={0.02} highlighted/>
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Network — no tier">
                <OwBadges>
                    {NETWORKS.map(n => <OwBadge key={n.id} variant="network" networkData={n}/>)}
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Network — with tier">
                <OwBadges>
                    {NETWORKS.map(n => <OwBadge key={n.id} variant="network" networkData={n} tier="Platinum"/>)}
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Contactless">
                <OwBadges>
                    {CONTACTLESS.map(c => <OwBadge key={c.id} variant="contactless" contactlessData={c}/>)}
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Card type">
                <OwBadges>
                    {CARD_TYPES.map(t => <OwBadge key={t} variant="card-type" cardType={t}/>)}
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Card type — custom icon prop (component ref)">
                <OwBadges>
                    <OwBadge variant="card-type" cardType="prepaid" icon={IconStarFilled}/>
                    <OwBadge variant="card-type" cardType="co-branded" icon="🤝"/>
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Default — active state (filter chip use case)">
                <OwBadges>
                    <OwBadge>Inactive</OwBadge>
                    <OwBadge active>Active</OwBadge>
                    <OwBadge colorHex="#f97316">Custom color</OwBadge>
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Metal">
                <OwBadges>
                    <OwBadge variant="metal"/>
                    <OwBadge small variant="metal"/>
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Small — all variants">
                <OwBadges>
                    <OwBadge small variant="intent" slug="dining" emoji="🍜" label="Ăn uống" rate={0.03}/>
                    <OwBadge small variant="network" networkData={NETWORKS[0]}/>
                    <OwBadge small variant="contactless" contactlessData={CONTACTLESS[0]}/>
                    <OwBadge small variant="card-type" cardType="credit"/>
                    <OwBadge small variant="metal"/>
                    <OwBadge small>Default small</OwBadge>
                    <OwBadge small active>Active small</OwBadge>
                    <OwBadge small colorHex="#f97316">Custom small</OwBadge>
                </OwBadges>
            </OwStorySection>
            <OwStorySection title="Interactive — asChild (default variant only)">
                <OwBadges>
                    <OwBadge asChild><button onClick={() => alert('clicked')}>Button badge</button></OwBadge>
                    <OwBadge asChild active><button>Active button</button></OwBadge>
                    <OwBadge asChild colorHex="#f97316"><a href="#">Link badge</a></OwBadge>
                </OwBadges>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ───────────────────────────────────────────────────────────────

export const IntentHighlighted: Story = {
    args: {variant: 'intent', slug: 'shopee', emoji: '🛍️', label: 'Shopee', rate: 0.05, highlighted: true},
};

export const IntentBase: Story = {
    args: {variant: 'intent', slug: 'shopee', emoji: '🛍️', label: 'Shopee', rate: 0.05},
};

export const NetworkNoTier: Story = {
    args: {variant: 'network', networkData: NETWORKS[0]},
};

export const NetworkWithTier: Story = {
    args: {variant: 'network', networkData: NETWORKS[0], tier: 'Platinum'},
};

export const CardType: Story = {
    args: {variant: 'card-type', cardType: 'credit'},
};

export const CardTypeCustomIcon: Story = {
    args: {variant: 'card-type', cardType: 'prepaid', icon: IconStarFilled},
};

export const CardTypeEmojiIcon: Story = {
    args: {variant: 'card-type', cardType: 'co-branded', icon: '🤝'},
};

export const DefaultActive: Story = {
    args: {active: true, children: 'Active filter'},
};

export const DefaultColorHex: Story = {
    args: {colorHex: '#9333ea', children: 'Custom color'},
};

export const SmallDefault: Story = {
    args: {small: true, children: 'Small badge'},
};

export const SmallActive: Story = {
    args: {small: true, active: true, children: 'Small active'},
};

export const SmallIntent: Story = {
    args: {small: true, variant: 'intent', slug: 'dining', emoji: '🍜', label: 'Ăn uống', rate: 0.03},
};

export const SmallNetwork: Story = {
    args: {small: true, variant: 'network', networkData: NETWORKS[0]},
};

export const SmallCardType: Story = {
    args: {small: true, variant: 'card-type', cardType: 'credit'},
};

export const Contactless: Story = {
    args: {variant: 'contactless', contactlessData: CONTACTLESS[0]},
};

export const SmallContactless: Story = {
    args: {small: true, variant: 'contactless', contactlessData: CONTACTLESS[0]},
};

export const Metal: Story = {
    args: {variant: 'metal'},
};

export const SmallMetal: Story = {
    args: {small: true, variant: 'metal'},
};
