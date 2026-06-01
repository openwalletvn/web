import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwBankRow} from './ow-bank-row';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwBankRow> = {
    component: OwBankRow,
    title: 'Bank UI/OwBankRow',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Bank row card with logo, full name, card/network chips, and hover CTA. Used in the banks listing page.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwBankRow>;

const MOCK_BANK_FULL = {
    id: 'techcombank',
    name: 'Techcombank',
    full_name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    link: 'https://techcombank.com/',
    logo_url: '/images/banks/techcombank.png',
    group: 'commercial' as const,
    stats: {card_count: 8},
    networks: ['visa', 'mastercard', 'jcb'],
};

const MOCK_BANK_NO_STATS = {
    id: 'vietcombank',
    name: 'Vietcombank',
    full_name: 'Ngân hàng TMCP Ngoại thương Việt Nam',
    link: 'https://vietcombank.com.vn/',
    logo_url: '/images/banks/vietcombank.png',
    group: 'big4' as const,
};

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="With stats & networks">
                <OwBankRow bank={MOCK_BANK_FULL} priority/>
            </OwStorySection>
            <OwStorySection title="No stats / no networks">
                <OwBankRow bank={MOCK_BANK_NO_STATS} priority/>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const WithStats: Story = {
    render: () => <OwBankRow bank={MOCK_BANK_FULL}/>,
};

export const NoStats: Story = {
    render: () => <OwBankRow bank={MOCK_BANK_NO_STATS}/>,
};
