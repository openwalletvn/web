import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {IconCreditCard, IconSettings, IconCircleCheck, IconBuildingBank} from '@tabler/icons-react';
import {OwBadgeNumberIcon} from './ow-badge-number-icon';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwBadgeNumberIcon> = {
    component: OwBadgeNumberIcon,
    title: 'OW UI/OwBadgeNumberIcon',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Pill badge combining a large number, label text, and an icon - used for stat callouts on hero and landing sections.',
            },
        },
    },
    argTypes: {
        icon: {control: false},
    },
};
export default meta;

type Story = StoryObj<typeof OwBadgeNumberIcon>;

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Primary - icon left / right">
                <div className="flex flex-wrap gap-4">
                    <OwBadgeNumberIcon number="150+" icon={IconCreditCard} text="Thẻ ngân hàng" iconPosition="left" color="primary"/>
                    <OwBadgeNumberIcon number="100%" icon={IconCircleCheck} text="Độc lập" iconPosition="right" color="primary"/>
                </div>
            </OwStorySection>
            <OwStorySection title="Black - icon left / right">
                <div className="flex flex-wrap gap-4">
                    <OwBadgeNumberIcon number="40+" icon={IconBuildingBank} text="Ngân hàng" iconPosition="left" color="black"/>
                    <OwBadgeNumberIcon number="25+" icon={IconSettings} text="Tính năng" iconPosition="right" color="black"/>
                </div>
            </OwStorySection>
            <OwStorySection title="Small">
                <div className="flex flex-wrap gap-4">
                    <OwBadgeNumberIcon number="150+" icon={IconCreditCard} text="Thẻ ngân hàng" iconPosition="left" color="primary" size="sm"/>
                    <OwBadgeNumberIcon number="40+" icon={IconBuildingBank} text="Ngân hàng" iconPosition="right" color="black" size="sm"/>
                </div>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const Default: Story = {
    args: {
        number: '150+',
        icon: IconCreditCard,
        text: 'Thẻ ngân hàng',
        iconPosition: 'left',
        color: 'primary',
    },
};

export const BlackVariant: Story = {
    args: {
        number: '40+',
        icon: IconBuildingBank,
        text: 'Ngân hàng',
        iconPosition: 'left',
        color: 'black',
    },
};

export const IconRight: Story = {
    args: {
        number: '25+',
        icon: IconSettings,
        text: 'Tính năng',
        iconPosition: 'right',
        color: 'black',
    },
};

export const IndependentStat: Story = {
    args: {
        number: '100%',
        icon: IconCircleCheck,
        text: 'Độc lập',
        iconPosition: 'right',
        color: 'primary',
    },
};

export const Small: Story = {
    args: {
        number: '150+',
        icon: IconCreditCard,
        text: 'Thẻ ngân hàng',
        iconPosition: 'left',
        color: 'primary',
        size: 'sm',
    },
};

export const SmallBlack: Story = {
    args: {
        number: '40+',
        icon: IconBuildingBank,
        text: 'Ngân hàng',
        iconPosition: 'right',
        color: 'black',
        size: 'sm',
    },
};
