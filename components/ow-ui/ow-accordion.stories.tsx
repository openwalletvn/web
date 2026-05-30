import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwAccordion} from './ow-accordion';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwAccordion> = {
    component: OwAccordion,
    title: 'OW UI/OwAccordion',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Collapsible FAQ-style accordion. Wraps Radix Accordion with single or multiple open modes.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwAccordion>;

const sampleItems = [
    {
        value: '1',
        trigger: 'Thẻ tín dụng hoàn tiền là gì?',
        content: 'Thẻ tín dụng hoàn tiền trả lại một phần chi tiêu dưới dạng tiền mặt hoặc điểm quy đổi.',
    },
    {
        value: '2',
        trigger: 'Lãi suất thẻ tín dụng được tính như thế nào?',
        content: 'Lãi suất tính trên dư nợ chưa thanh toán sau ngày đáo hạn, thường từ 1.5% đến 3.5%/tháng.',
    },
    {
        value: '3',
        trigger: 'Có nên mở nhiều thẻ tín dụng không?',
        content: 'Phụ thuộc vào khả năng quản lý tài chính. Nhiều thẻ cho phép tận dụng ưu đãi từng loại nhưng cần kiểm soát chi tiêu chặt chẽ.',
    },
];

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Single (collapsible)">
                <OwAccordion items={sampleItems} type="single" collapsible />
            </OwStorySection>
            <OwStorySection title="Multiple (two open by default)">
                <OwAccordion items={sampleItems} type="multiple" defaultValue={['1', '2']} />
            </OwStorySection>
            <OwStorySection title="All open">
                <OwAccordion items={sampleItems} type="multiple" defaultValue={['1', '2', '3']} />
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const Default: Story = {
    render: () => <OwAccordion items={sampleItems} type="single" collapsible />,
};

export const Multiple: Story = {
    render: () => <OwAccordion items={sampleItems} type="multiple" defaultValue={['1', '2']} />,
};

export const AllOpen: Story = {
    render: () => <OwAccordion items={sampleItems} type="multiple" defaultValue={['1', '2', '3']} />,
};
