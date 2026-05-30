import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OwLogo } from './ow-logo';

const meta: Meta<typeof OwLogo> = {
    component: OwLogo,
    title: 'OW UI/OwLogo',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Site logo — icon or full lockup, black/white/red, optionally wrapped in a link.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwLogo>;

export const Icon: Story = { args: { variant: 'icon' } };

export const FullBlack: Story = { args: { variant: 'full', color: 'black' } };

export const FullWhite: Story = {
    args: { variant: 'full', color: 'white' },
    parameters: { backgrounds: { default: 'dark' } },
};

export const FullRed: Story = { args: { variant: 'full', color: 'red' } };

export const NoLink: Story = { args: { variant: 'icon', href: null } };
