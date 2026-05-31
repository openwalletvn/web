import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwRankBadge} from './ow-rank-badge';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwRankBadge> = {
    component: OwRankBadge,
    title: 'OW UI/OwRankBadge',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Displays a rank badge: laurel wreath icons for top 3, plain number text for others.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwRankBadge>;

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Top 3">
                <div className="flex gap-4 items-center">
                    <OwRankBadge rank={1}/>
                    <OwRankBadge rank={2}/>
                    <OwRankBadge rank={3}/>
                </div>
            </OwStorySection>
            <OwStorySection title="Other ranks">
                <div className="flex gap-4 items-center">
                    <OwRankBadge rank={4}/>
                    <OwRankBadge rank={10}/>
                    <OwRankBadge rank={99}/>
                </div>
            </OwStorySection>
        </OwStories>
    ),
};

export const Rank1: Story = {
    render: () => <OwRankBadge rank={1}/>,
};

export const Rank2: Story = {
    render: () => <OwRankBadge rank={2}/>,
};

export const Rank3: Story = {
    render: () => <OwRankBadge rank={3}/>,
};

export const OtherRank: Story = {
    render: () => <OwRankBadge rank={4}/>,
};
