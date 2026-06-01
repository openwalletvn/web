import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwBankImage} from './ow-bank-image';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwBankImage> = {
    component: OwBankImage,
    title: 'Bank UI/OwBankImage',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Bank logo image. Pass `href` to render as a link.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwBankImage>;

const MOCK_BANK = {
    id: 'techcombank',
    name: 'Techcombank',
    full_name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    link: 'https://techcombank.com/',
    logo_url: '/images/banks/techcombank.png',
    group: 'commercial' as const,
};

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Default">
                <OwBankImage bank={MOCK_BANK} priority/>
            </OwStorySection>
            <OwStorySection title="As link (href)">
                <OwBankImage bank={MOCK_BANK} href="/ngan-hang/techcombank" priority/>
            </OwStorySection>
            <OwStorySection title="Custom size">
                <OwBankImage bank={MOCK_BANK} className="w-[200px] h-8" priority/>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const Default: Story = {
    render: () => <OwBankImage bank={MOCK_BANK} priority/>,
};

export const AsLink: Story = {
    render: () => <OwBankImage bank={MOCK_BANK} href="/ngan-hang/techcombank"/>,
};

export const CustomSize: Story = {
    render: () => <OwBankImage bank={MOCK_BANK} className="w-[200px] h-8"/>,
};
