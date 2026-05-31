import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwFeeAmount} from './ow-fee-amount';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwFeeAmount> = {
    component: OwFeeAmount,
    title: 'OW UI/OwFeeAmount',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Renders a fee amount with styled value, unit, and optional period suffix.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwFeeAmount>;

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Currency / năm">
                <OwFeeAmount amount={399000} period="năm"/>
            </OwStorySection>
            <OwStorySection title="Currency / tháng">
                <OwFeeAmount amount={50000} period="tháng"/>
            </OwStorySection>
            <OwStorySection title="Free">
                <OwFeeAmount amount={0}/>
            </OwStorySection>
            <OwStorySection title="Compact — 100k, 399k, 1tr, 1.5tr">
                <div className="flex flex-col gap-1">
                    <OwFeeAmount amount={100000} period="năm" compact/>
                    <OwFeeAmount amount={1000000} period="năm" compact/>
                    <OwFeeAmount amount={1500000} period="năm" compact/>
                    <OwFeeAmount amount={399000} period="năm" compact/>
                </div>
            </OwStorySection>
            <OwStorySection title="Text only — no style classes">
                <OwFeeAmount amount={399000} period="năm" textOnly/>
                <OwFeeAmount amount={0} textOnly/>
                <OwFeeAmount amount={1500000} period="năm" compact textOnly/>
            </OwStorySection>
        </OwStories>
    ),
};

export const CurrencyAnnual: Story = {
    render: () => <OwFeeAmount amount={399000} period="năm"/>,
};

export const CurrencyMonthly: Story = {
    render: () => <OwFeeAmount amount={50000} period="tháng"/>,
};

export const Free: Story = {
    render: () => <OwFeeAmount amount={0}/>,
};

export const Compact100k: Story = {
    render: () => <OwFeeAmount amount={100000} period="năm" compact/>,
};

export const Compact1tr: Story = {
    render: () => <OwFeeAmount amount={1000000} period="năm" compact/>,
};

export const Compact1point5tr: Story = {
    render: () => <OwFeeAmount amount={1500000} period="năm" compact/>,
};

export const Compact399k: Story = {
    render: () => <OwFeeAmount amount={399000} period="năm" compact/>,
};

export const TextOnly: Story = {
    render: () => <OwFeeAmount amount={399000} period="năm" textOnly/>,
};

export const TextOnlyFree: Story = {
    render: () => <OwFeeAmount amount={0} textOnly/>,
};

export const TextOnlyCompact: Story = {
    render: () => <OwFeeAmount amount={1500000} period="năm" compact textOnly/>,
};
