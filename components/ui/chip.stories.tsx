import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Chip } from './chip';

const meta: Meta<typeof Chip> = {
  component: Chip,
  title: 'UI/Chip',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = { args: { children: 'Thẻ tín dụng' } };
export const Active: Story = { args: { children: 'Thẻ tín dụng', active: true } };
export const Disabled: Story = { args: { children: 'Thẻ tín dụng', disabled: true } };
