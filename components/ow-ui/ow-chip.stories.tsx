import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OwChip } from './ow-chip';

const meta: Meta<typeof OwChip> = {
  component: OwChip,
  title: 'OW UI/OwChip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Filter chip for toggling options. Use `active` to highlight selected state. Common in spend selectors and ranking filters.',
      },
    },
  },
  args: {
    children: 'Hoàn tiền',
    active: false,
  },
};
export default meta;

type Story = StoryObj<typeof OwChip>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <OwChip>Hoàn tiền</OwChip>
      <OwChip active>Phí thường niên</OwChip>
      <OwChip>Miễn phí năm đầu</OwChip>
      <OwChip active>Chi tiêu online</OwChip>
      <OwChip disabled>Không khả dụng</OwChip>
    </div>
  ),
};
