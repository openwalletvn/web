import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OwButton } from './ow-button';

const meta: Meta<typeof OwButton> = {
  component: OwButton,
  title: 'OW UI/OwButton',
  tags: ['autodocs'],
  args: {
    children: 'Tìm hiểu thẻ phù hợp',
    color: 'default',
    size: 'md',
  },
};
export default meta;

type Story = StoryObj<typeof OwButton>;

export const Default: Story = {};

export const Primary: Story = {
  args: { color: 'primary' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const SmallPrimary: Story = {
  args: { color: 'primary', size: 'sm' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <OwButton color="default" size="md">Xem tất cả thẻ</OwButton>
      <OwButton color="primary" size="md">Tìm thẻ phù hợp</OwButton>
      <OwButton color="default" size="sm">Xem thêm</OwButton>
      <OwButton color="primary" size="sm">So sánh ngay</OwButton>
    </div>
  ),
};
