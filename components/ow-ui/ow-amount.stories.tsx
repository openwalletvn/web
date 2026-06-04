import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwAmount} from './ow-amount';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwAmount> = {
    component: OwAmount,
    title: 'OW UI/OwAmount',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Renders an amount with styled value, optional unit suffix, and optional period.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwAmount>;

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="VND / year">
                <OwAmount amount={399000} unit="vnd" period="year"/>
            </OwStorySection>
            <OwStorySection title="VND / month">
                <OwAmount amount={50000} unit="vnd" period="month"/>
            </OwStorySection>
            <OwStorySection title="Free (zero + vnd/k → Miễn phí)">
                <OwAmount amount={0} unit="vnd"/>
                <OwAmount amount={0} unit="vnd" zeroLabel="Miễn phí thường niên"/>
                <OwAmount amount={0} unit="vnd" zeroLabel="Miễn phí hủy thẻ"/>
            </OwStorySection>
            <OwStorySection title="Medium (heading-5)">
                <OwAmount amount={399000} unit="vnd" period="year" medium/>
                <OwAmount amount={0} unit="vnd" medium/>
            </OwStorySection>
            <OwStorySection title="Compact (k) — 100k, 399k, 1tr, 1.5tr">
                <div className="flex flex-col gap-1">
                    <OwAmount amount={100000} unit="k" period="year"/>
                    <OwAmount amount={1000000} unit="k" period="year"/>
                    <OwAmount amount={1500000} unit="k" period="year"/>
                    <OwAmount amount={399000} unit="k" period="year"/>
                </div>
            </OwStorySection>
            <OwStorySection title="Percent">
                <OwAmount amount={1.5} unit="percent"/>
            </OwStorySection>
            <OwStorySection title="Large (no unit)">
                <OwAmount amount={500000} large/>
            </OwStorySection>
            <OwStorySection title="Null variant">
                <OwAmount null/>
                <OwAmount null unit="percent"/>
                <OwAmount null unit="vnd" period="year"/>
                <OwAmount null unit="k" period="month"/>
                <OwAmount nullLabel="Chưa có" unit="vnd" period="year"/>
            </OwStorySection>
            <OwStorySection title="Text only — no style classes">
                <OwAmount amount={399000} unit="vnd" period="year" textOnly/>
                <OwAmount amount={0} textOnly/>
                <OwAmount amount={1500000} unit="k" period="year" textOnly/>
            </OwStorySection>
        </OwStories>
    ),
};

export const VndAnnual: Story = {
    render: () => <OwAmount amount={399000} unit="vnd" period="year"/>,
};

export const VndMonthly: Story = {
    render: () => <OwAmount amount={50000} unit="vnd" period="month"/>,
};

export const Free: Story = {
    render: () => <OwAmount amount={0} unit="vnd"/>,
};

export const FreeCustomLabel: Story = {
    render: () => <OwAmount amount={0} unit="vnd" zeroLabel="Miễn phí thường niên"/>,
};

export const Medium: Story = {
    render: () => <OwAmount amount={399000} unit="vnd" period="year" medium/>,
};

export const MediumFree: Story = {
    render: () => <OwAmount amount={0} unit="vnd" medium/>,
};

export const Compact100k: Story = {
    render: () => <OwAmount amount={100000} unit="k" period="year"/>,
};

export const Compact1tr: Story = {
    render: () => <OwAmount amount={1000000} unit="k" period="year"/>,
};

export const Compact1point5tr: Story = {
    render: () => <OwAmount amount={1500000} unit="k" period="year"/>,
};

export const Percent: Story = {
    render: () => <OwAmount amount={1.5} unit="percent"/>,
};

export const LargeNoUnit: Story = {
    render: () => <OwAmount amount={500000} large/>,
};

export const TextOnly: Story = {
    render: () => <OwAmount amount={399000} unit="vnd" period="year" textOnly/>,
};

export const TextOnlyFree: Story = {
    render: () => <OwAmount amount={0} textOnly/>,
};

export const TextOnlyCompact: Story = {
    render: () => <OwAmount amount={1500000} unit="k" period="year" textOnly/>,
};

export const Null: Story = {
    render: () => <OwAmount null unit="percent"/>,
};

export const NullVndAnnual: Story = {
    render: () => <OwAmount null unit="vnd" period="year"/>,
};
