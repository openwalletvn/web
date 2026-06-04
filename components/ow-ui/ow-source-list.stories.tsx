import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwSourceList} from './ow-source-list';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwSourceList> = {
    component: OwSourceList,
    title: 'OW UI/OwSourceList',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: [
                    'Numbered reference list for source URLs. Used on card and bank detail pages.',
                    '',
                    '- Label present → shows label as link + muted URL below',
                    '- No label → URL used as link text (hostname + path)',
                    '- `.pdf` URL → red PDF badge shown inline',
                ].join('\n'),
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwSourceList>;

const WITH_LABELS = [
    {url: 'https://vcb.com.vn/bieu-phi-the-tin-dung-2025.pdf', label: 'Biểu phí dịch vụ thẻ tín dụng 2025'},
    {url: 'https://tpb.vn/dieu-khoan-su-dung-the', label: 'Điều khoản sử dụng thẻ'},
    {url: 'https://vpbank.com.vn/the-tin-dung/classic', label: 'Xem chi tiết thẻ chính thức'},
];

const NO_LABELS = [
    {url: 'https://vcb.com.vn/bieu-phi-the-tin-dung-2025.pdf'},
    {url: 'https://tpb.vn/dieu-khoan-su-dung-the'},
];

const MIXED = [
    {url: 'https://vcb.com.vn/bieu-phi-the-tin-dung-2025.pdf', label: 'Biểu phí dịch vụ thẻ tín dụng 2025'},
    {url: 'https://tpb.vn/dieu-khoan-su-dung-the'},
];

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="With labels (label + muted URL)">
                <OwSourceList sources={WITH_LABELS}/>
            </OwStorySection>
            <OwStorySection title="No labels (URL as link text)">
                <OwSourceList sources={NO_LABELS}/>
            </OwStorySection>
            <OwStorySection title="Mixed">
                <OwSourceList sources={MIXED}/>
            </OwStorySection>
            <OwStorySection title="Empty (renders nothing)">
                <OwSourceList sources={[]}/>
            </OwStorySection>
        </OwStories>
    ),
};

export const WithLabels: Story = {
    args: {sources: WITH_LABELS},
};

export const NoLabels: Story = {
    args: {sources: NO_LABELS},
};

export const Mixed: Story = {
    args: {sources: MIXED},
};
