import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {IconCreditCard, IconSettings, IconCircleCheck, IconBuildingBank} from '@tabler/icons-react';
import {OwBadgeNumberIcon} from './ow-badge-number-icon';

const meta: Meta<typeof OwBadgeNumberIcon> = {
    component: OwBadgeNumberIcon,
    title: 'OW UI/OwBadgeNumberIcon',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Pill badge combining a large number, label text, and an icon — used for stat callouts on hero and landing sections.',
            },
        },
    },
    argTypes: {
        icon: {control: false},
    },
};
export default meta;

type Story = StoryObj<typeof OwBadgeNumberIcon>;

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
        text: 'ngân hàng',
        iconPosition: 'right',
        color: 'black',
    },
};

export const IndependentStat: Story = {
    args: {
        number: '100%',
        icon: IconCircleCheck,
        text: 'độc lập',
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
