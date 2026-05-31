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
                component: 'Renders a fee entry (currency or rate) with styled value, unit, and optional period suffix.',
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
                <OwFeeAmount fee={{amount: 399000, type: 'currency'}} period="năm"/>
            </OwStorySection>
            <OwStorySection title="Currency / tháng">
                <OwFeeAmount fee={{amount: 50000, type: 'currency'}} period="tháng"/>
            </OwStorySection>
            <OwStorySection title="Rate (no period)">
                <OwFeeAmount fee={{amount: 1.5, type: 'rate'}} period={null}/>
            </OwStorySection>
            <OwStorySection title="Free">
                <OwFeeAmount fee={{amount: 0, type: 'currency'}}/>
            </OwStorySection>
            <OwStorySection title="Compact — 100k, 399k, 1tr, 1.5tr">
                <div className="flex flex-col gap-1">
                    <OwFeeAmount fee={{amount: 100000, type: 'currency'}} period="năm" compact/>
                    <OwFeeAmount fee={{amount: 1000000, type: 'currency'}} period="năm" compact/>
                    <OwFeeAmount fee={{amount: 1500000, type: 'currency'}} period="năm" compact/>
                    <OwFeeAmount fee={{amount: 399000, type: 'currency'}} period="năm" compact/>
                </div>
            </OwStorySection>
        </OwStories>
    ),
};

export const CurrencyAnnual: Story = {
    render: () => <OwFeeAmount fee={{amount: 399000, type: 'currency'}} period="năm"/>,
};

export const CurrencyMonthly: Story = {
    render: () => <OwFeeAmount fee={{amount: 50000, type: 'currency'}} period="tháng"/>,
};

export const Rate: Story = {
    render: () => <OwFeeAmount fee={{amount: 1.5, type: 'rate'}} period={null}/>,
};

export const Free: Story = {
    render: () => <OwFeeAmount fee={{amount: 0, type: 'currency'}}/>,
};

export const Compact100k: Story = {
    render: () => <OwFeeAmount fee={{amount: 100000, type: 'currency'}} period="năm" compact/>,
};

export const Compact1tr: Story = {
    render: () => <OwFeeAmount fee={{amount: 1000000, type: 'currency'}} period="năm" compact/>,
};

export const Compact1point5tr: Story = {
    render: () => <OwFeeAmount fee={{amount: 1500000, type: 'currency'}} period="năm" compact/>,
};

export const Compact399k: Story = {
    render: () => <OwFeeAmount fee={{amount: 399000, type: 'currency'}} period="năm" compact/>,
};
