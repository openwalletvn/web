import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwCardBadge, OwCardBadges, CARD_TYPE_LABELS} from './ow-card-badge';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwCardBadge> = {
    component: OwCardBadge,
    title: 'Card UI/OwCardBadge',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Domain badge for card type and network. Default variant: consumer passes text as children. `variant="network"` adds logo + structured label. Display-only by default; use `asChild` to make interactive.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwCardBadge>;

const NETWORKS = [
    {id: 'visa' as const, name: 'Visa', logo_url: 'https://api.openwallet.vn/images/networks/visa.png'},
    {id: 'mastercard' as const, name: 'Mastercard', logo_url: 'https://api.openwallet.vn/images/networks/mastercard.png'},
    {id: 'jcb' as const, name: 'JCB', logo_url: 'https://api.openwallet.vn/images/networks/jcb.png'},
    {id: 'napas' as const, name: 'NAPAS', logo_url: 'https://api.openwallet.vn/images/networks/napas.png'},
    {id: 'amex' as const, name: 'American Express', logo_url: 'https://api.openwallet.vn/images/networks/amex.png'},
    {id: 'unionpay' as const, name: 'UnionPay', logo_url: 'https://api.openwallet.vn/images/networks/unionpay.png'},
];

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Card types">
                <OwCardBadges>
                    {(Object.keys(CARD_TYPE_LABELS) as (keyof typeof CARD_TYPE_LABELS)[]).map(type => (
                        <OwCardBadge key={type} cardType={type}/>
                    ))}
                </OwCardBadges>
            </OwStorySection>
            <OwStorySection title="Network — no tier">
                <OwCardBadges>
                    {NETWORKS.map(n => <OwCardBadge key={n.id} networkData={n}/>)}
                </OwCardBadges>
            </OwStorySection>
            <OwStorySection title="Network — with tier">
                <OwCardBadges>
                    {NETWORKS.map(n => <OwCardBadge key={n.id} networkData={n} tier="Platinum"/>)}
                </OwCardBadges>
            </OwStorySection>
            <OwStorySection title="Multiple types (co-branded use case)">
                <OwCardBadges>
                    {(['credit', 'co-branded'] as const).map(t => <OwCardBadge key={t} cardType={t}/>)}
                </OwCardBadges>
            </OwStorySection>
            <OwStorySection title="Interactive (asChild)">
                <OwCardBadge asChild>
                    <button onClick={() => alert('clicked')}>Tín dụng</button>
                </OwCardBadge>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const CardType: Story = {
    render: () => <OwCardBadge cardType="credit"/>,
};

export const NetworkNoTier: Story = {
    render: () => <OwCardBadge networkData={NETWORKS[0]}/>,
};

export const NetworkWithTier: Story = {
    render: () => <OwCardBadge networkData={NETWORKS[0]} tier="Platinum"/>,
};

export const AsChildButton: Story = {
    render: () => (
        <OwCardBadge asChild>
            <button onClick={() => alert('clicked')}>Tín dụng</button>
        </OwCardBadge>
    ),
};
