import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OwButton } from './ow-button';

const meta: Meta<typeof OwButton> = {
  component: OwButton,
  title: 'OW UI/UI/OwButton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Brand button component. Supports `default` and `primary` colors, `sm` and `md` sizes. Use `active` for toggled-on state, `disabled` for unavailable.',
      },
    },
  },
  args: {
    children: 'Tìm hiểu thẻ phù hợp',
    color: 'default',
    size: 'md',
    active: false,
    disabled: false,
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

export const Active: Story = {
  args: { color: 'primary', active: true, children: 'Đang so sánh' },
};

export const ActiveDefault: Story = {
  args: { color: 'default', active: true, children: 'Đã chọn' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledPrimary: Story = {
  args: { color: 'primary', disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <OwButton color="default" size="md">Xem tất cả thẻ</OwButton>
      <OwButton color="primary" size="md">Tìm thẻ phù hợp</OwButton>
      <OwButton color="default" size="sm">Xem thêm</OwButton>
      <OwButton color="primary" size="sm">So sánh ngay</OwButton>
      <OwButton color="primary" size="sm" active>Đang so sánh</OwButton>
      <OwButton color="primary" size="sm" disabled>Đã đủ 3 thẻ</OwButton>
    </div>
  ),
};
