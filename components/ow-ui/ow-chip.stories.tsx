import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OwChip } from './ow-chip';

const meta: Meta<typeof OwChip> = {
  component: OwChip,
  title: 'OW UI/OwChip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Filter chip for toggling options. Use `active` to highlight selected state. Common in spend selectors and ranking filters.',
          '',
          'Renders as `<span>` by default (display only). For clickable chips, use `asChild` to render as the actual interactive element:',
          '',
          '```tsx',
          '// display only',
          '<OwChip>Label</OwChip>',
          '',
          '// clickable button',
          '<OwChip asChild><button onClick={fn}>Filter</button></OwChip>',
          '',
          '// link chip',
          '<OwChip asChild><a href="/x">Link</a></OwChip>',
          '```',
          '',
          '`cursor-pointer` and hover styles apply automatically to `<button>` and `<a>` elements via CSS selector — no extra props needed.',
        ].join('\n'),
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
  render: () => (
    <OwChip asChild><button disabled>Không khả dụng</button></OwChip>
  ),
};

export const AsButton: Story = {
  render: () => (
    <OwChip asChild><button onClick={() => alert('clicked')}>Bấm vào đây</button></OwChip>
  ),
};

export const AsLink: Story = {
  render: () => (
    <OwChip asChild><a href="#">Xem thêm</a></OwChip>
  ),
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const SmallActive: Story = {
  args: { size: 'sm', active: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <OwChip>Hiển thị</OwChip>
        <OwChip active>Đang chọn</OwChip>
        <OwChip asChild><button onClick={() => {}}>Nút bấm</button></OwChip>
        <OwChip asChild active><button onClick={() => {}}>Nút đang chọn</button></OwChip>
        <OwChip asChild><a href="#">Liên kết</a></OwChip>
        <OwChip asChild><button disabled>Vô hiệu</button></OwChip>
      </div>
      <div className="flex flex-wrap gap-2">
        <OwChip size="sm">Nhỏ</OwChip>
        <OwChip size="sm" active>Nhỏ đang chọn</OwChip>
        <OwChip size="sm" asChild><button onClick={() => {}}>Nút nhỏ</button></OwChip>
      </div>
    </div>
  ),
};
