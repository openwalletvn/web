import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwTooltip} from './ow-tooltip';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwTooltip> = {
    component: OwTooltip,
    title: 'OW UI/OwTooltip',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: [
                    'Animated tooltip wrapper. Hover to reveal. Slight random rotation for personality.',
                    '',
                    '```tsx',
                    '<OwTooltip tooltip="Helpful hint">',
                    '  <button>Hover me</button>',
                    '</OwTooltip>',
                    '```',
                    '',
                    '**Align:** `top` (default) | `bottom`',
                ].join('\n'),
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwTooltip>;

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Top (default)">
                <OwTooltip tooltip="Tooltip on top">
                    <button className="px-3 py-1.5 rounded bg-neutral-100 text-sm font-medium">Hover me</button>
                </OwTooltip>
            </OwStorySection>
            <OwStorySection title="Bottom">
                <OwTooltip tooltip="Tooltip on bottom" side="bottom">
                    <button className="px-3 py-1.5 rounded bg-neutral-100 text-sm font-medium">Hover me</button>
                </OwTooltip>
            </OwStorySection>
            <OwStorySection title="Rich content tooltip">
                <OwTooltip tooltip={<span>💳 <strong>Cashback 5%</strong> at Shopee</span>}>
                    <button className="px-3 py-1.5 rounded bg-neutral-100 text-sm font-medium">Rich tooltip</button>
                </OwTooltip>
            </OwStorySection>
            <OwStorySection title="No tooltip (passthrough)">
                <OwTooltip>
                    <button className="px-3 py-1.5 rounded bg-neutral-100 text-sm font-medium">No tooltip</button>
                </OwTooltip>
            </OwStorySection>
        </OwStories>
    ),
};

export const Top: Story = {
    args: {
        tooltip: 'Tooltip on top',
        children: <button className="px-3 py-1.5 rounded bg-neutral-100 text-sm font-medium">Hover me</button>,
    },
};

export const Bottom: Story = {
    args: {
        tooltip: 'Tooltip on bottom',
        side: 'bottom',
        children: <button className="px-3 py-1.5 rounded bg-neutral-100 text-sm font-medium">Hover me</button>,
    },
};

export const RichContent: Story = {
    args: {
        tooltip: <span>💳 <strong>Cashback 5%</strong></span>,
        children: <button className="px-3 py-1.5 rounded bg-neutral-100 text-sm font-medium">Rich tooltip</button>,
    },
};
