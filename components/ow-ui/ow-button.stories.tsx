import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwButton} from './ow-button';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwButton> = {
    component: OwButton,
    title: 'OW UI/OwButton',
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

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Default / Primary">
                <div className="flex flex-wrap items-center gap-4">
                    <OwButton color="default" size="md">Xem tất cả thẻ</OwButton>
                    <OwButton color="primary" size="md">Tìm thẻ phù hợp</OwButton>
                </div>
            </OwStorySection>
            <OwStorySection title="Small">
                <div className="flex flex-wrap items-center gap-4">
                    <OwButton color="default" size="sm">Xem thêm</OwButton>
                    <OwButton color="primary" size="sm">So sánh ngay</OwButton>
                </div>
            </OwStorySection>
            <OwStorySection title="Active">
                <div className="flex flex-wrap items-center gap-4">
                    <OwButton color="default" size="md" active>Đã chọn</OwButton>
                    <OwButton color="primary" size="sm" active>Đang so sánh</OwButton>
                </div>
            </OwStorySection>
            <OwStorySection title="Disabled">
                <div className="flex flex-wrap items-center gap-4">
                    <OwButton color="default" size="md" disabled>Không khả dụng</OwButton>
                    <OwButton color="primary" size="sm" disabled>Đã đủ 3 thẻ</OwButton>
                </div>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const Default: Story = {};

export const Primary: Story = {
    args: {color: 'primary'},
};

export const Small: Story = {
    args: {size: 'sm'},
};

export const SmallPrimary: Story = {
    args: {color: 'primary', size: 'sm'},
};

export const Active: Story = {
    args: {color: 'primary', active: true, children: 'Đang so sánh'},
};

export const ActiveDefault: Story = {
    args: {color: 'default', active: true, children: 'Đã chọn'},
};

export const Disabled: Story = {
    args: {disabled: true},
};

export const DisabledPrimary: Story = {
    args: {color: 'primary', disabled: true},
};
