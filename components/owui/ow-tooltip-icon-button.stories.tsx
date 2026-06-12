import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwTooltipIconButton} from './ow-tooltip-icon-button';
import {OwStories, OwStorySection} from './ow-story-section';
import {Copy, Heart, Share2, Trash2} from 'lucide-react';

const meta: Meta<typeof OwTooltipIconButton> = {
    component: OwTooltipIconButton,
    title: 'OW UI/OwTooltipIconButton',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: [
                    'Ghost icon button with animated `OwTooltip`. Forwards ref to underlying `<button>`.',
                    '',
                    '```tsx',
                    '<OwTooltipIconButton tooltip="Copy">',
                    '  <Copy />',
                    '</OwTooltipIconButton>',
                    '```',
                ].join('\n'),
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwTooltipIconButton>;

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Top (default)">
                <OwTooltipIconButton tooltip="Copy">
                    <Copy />
                </OwTooltipIconButton>
            </OwStorySection>
            <OwStorySection title="Bottom">
                <OwTooltipIconButton tooltip="Share" side="bottom">
                    <Share2 />
                </OwTooltipIconButton>
            </OwStorySection>
            <OwStorySection title="Multiple buttons">
                <div className="flex gap-2">
                    <OwTooltipIconButton tooltip="Like">
                        <Heart />
                    </OwTooltipIconButton>
                    <OwTooltipIconButton tooltip="Share">
                        <Share2 />
                    </OwTooltipIconButton>
                    <OwTooltipIconButton tooltip="Delete">
                        <Trash2 />
                    </OwTooltipIconButton>
                </div>
            </OwStorySection>
            <OwStorySection title="Disabled">
                <OwTooltipIconButton tooltip="Cannot copy" disabled>
                    <Copy />
                </OwTooltipIconButton>
            </OwStorySection>
        </OwStories>
    ),
};

export const Top: Story = {
    args: {
        tooltip: 'Copy to clipboard',
        children: <Copy />,
    },
};

export const Bottom: Story = {
    args: {
        tooltip: 'Share',
        side: 'bottom',
        children: <Share2 />,
    },
};

export const Disabled: Story = {
    args: {
        tooltip: 'Cannot delete',
        disabled: true,
        children: <Trash2 />,
    },
};
