import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwAlert} from './ow-alert';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwAlert> = {
    component: OwAlert,
    title: 'OW UI/OwAlert',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Inline alert banner for error, warning, info, and package-exclusive notices.',
            },
        },
    },
    args: {
        children: 'Đây là thông báo mẫu.',
    },
};
export default meta;

type Story = StoryObj<typeof OwAlert>;

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="error">
                <OwAlert variant="error">
                    <strong>Chương trình hoàn tiền đã kết thúc.</strong> Thông tin bên dưới chỉ mang tính tham khảo.
                </OwAlert>
            </OwStorySection>
            <OwStorySection title="warning">
                <OwAlert variant="warning">
                    Lưu ý: điều kiện áp dụng có thể thay đổi.
                </OwAlert>
            </OwStorySection>
            <OwStorySection title="info">
                <OwAlert variant="info">
                    Thông tin này được cập nhật hàng tháng.
                </OwAlert>
            </OwStorySection>
            <OwStorySection title="package">
                <OwAlert variant="package">
                    <strong>Chọn 1 gói khi phát hành thẻ.</strong> Mỗi gói áp dụng độc lập, không cộng dồn.
                </OwAlert>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const Error: Story = {
    args: {variant: 'error'},
};

export const Warning: Story = {
    args: {variant: 'warning'},
};

export const Info: Story = {
    args: {variant: 'info'},
};

export const Package: Story = {
    args: {variant: 'package'},
};
