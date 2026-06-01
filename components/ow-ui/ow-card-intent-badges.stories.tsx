import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwCardIntentBadges} from './ow-card-intent-badges';
import type {IntentItem} from './ow-card-intent-badges';
import {OwStories, OwStorySection} from './ow-story-section';

const INTENTS: IntentItem[] = [
    {slug: 'dining', icon: '🍜', label: 'Ăn uống', rate: 0.05},
    {slug: 'grocery', icon: '🛒', label: 'Siêu thị', rate: 0.03},
    {slug: 'travel', icon: '✈️', label: 'Du lịch', rate: 0.08},
    {slug: 'fuel', icon: '⛽', label: 'Xăng dầu', rate: 0.02},
    {slug: 'entertainment', icon: '🎬', label: 'Giải trí', rate: 0.01},
];

const meta: Meta<typeof OwCardIntentBadges> = {
    component: OwCardIntentBadges,
    title: 'Card UI/OwCardIntentBadges',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Renders a row of intent badges for a card. Handles rate lookup via slugRateMap or inline rate on each intent.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwCardIntentBadges>;

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Default">
                <OwCardIntentBadges intents={INTENTS}/>
            </OwStorySection>
            <OwStorySection title="Highlighted (all)">
                <OwCardIntentBadges intents={INTENTS} highlighted/>
            </OwStorySection>
            <OwStorySection title="Highlighted (selective)">
                <OwCardIntentBadges intents={INTENTS} highlighted={new Set(['dining', 'travel'])}/>
            </OwStorySection>
            <OwStorySection title="Small">
                <OwCardIntentBadges intents={INTENTS} highlighted small/>
            </OwStorySection>
            <OwStorySection title="Rate from slugRateMap (no inline rate)">
                <OwCardIntentBadges
                    intents={INTENTS.map(({rate: _, ...i}) => i)}
                    slugRateMap={new Map(INTENTS.map(i => [i.slug, i.rate!]))}
                    highlighted
                />
            </OwStorySection>
        </OwStories>
    ),
};

export const Default: Story = {
    render: () => <OwCardIntentBadges intents={INTENTS}/>,
};

export const HighlightedAll: Story = {
    render: () => <OwCardIntentBadges intents={INTENTS} highlighted/>,
};

export const HighlightedSelective: Story = {
    render: () => (
        <OwCardIntentBadges intents={INTENTS} highlighted={new Set(['dining', 'travel'])}/>
    ),
};

export const Small: Story = {
    render: () => <OwCardIntentBadges intents={INTENTS} highlighted small/>,
};
