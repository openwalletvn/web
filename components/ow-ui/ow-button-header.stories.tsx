import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {IconSearch, IconBell} from '@tabler/icons-react';
import {OwButtonHeader} from './ow-button-header';

const meta: Meta<typeof OwButtonHeader> = {
  component: OwButtonHeader,
  title: 'OW UI/OwButtonHeader',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Header action button with icon slot and optional kbd hint. Defaults to logo icon, no kbd.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof OwButtonHeader>;

export const Default: Story = {
  args: {children: 'Tìm kiếm thẻ tín dụng'},
};

export const WithSearchIcon: Story = {
  args: {
    icon: <IconSearch className="size-4 shrink-0"/>,
    kbd: 'K',
    children: 'Tìm kiếm',
  },
};

export const WithKbd: Story = {
  args: {
    icon: <IconBell className="size-4 shrink-0"/>,
    kbd: '/',
    children: 'Thông báo',
  },
};

export const NoKbd: Story = {
  args: {
    icon: <IconBell className="size-4 shrink-0"/>,
    children: 'Thông báo',
  },
};
