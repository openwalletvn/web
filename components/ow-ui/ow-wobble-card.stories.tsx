import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwWobbleCard} from './ow-wobble-card';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwWobbleCard> = {
    component: OwWobbleCard,
    title: 'OW UI/OwWobbleCard',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: [
                    'Wobble card with brand color background. Wraps the `WobbleCard` primitive.',
                    '',
                    '**Props:**',
                    '- `brandColor` — hex color for card background tint (default: `#e1795d`)',
                    '- `href` — makes the card a clickable link',
                    '- `renderCondition` — pass `false` to hide the card entirely',
                    '',
                    '```tsx',
                    '<OwWobbleCard brandColor="#e1795d" href="/linh-vuc/shopee">',
                    '  <span className="font-semibold">Shopee</span>',
                    '  <span className="text-sm">Hoàn tiền cao nhất cho Shopee</span>',
                    '</OwWobbleCard>',
                    '```',
                ].join('\n'),
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwWobbleCard>;

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Default brand color">
                <div className="grid grid-cols-3 gap-4">
                    <OwWobbleCard>
                        <span className="font-semibold text-white">Default</span>
                        <span className="text-sm text-white/70">No custom color</span>
                    </OwWobbleCard>
                </div>
            </OwStorySection>
            <OwStorySection title="Custom brand colors">
                <div className="grid grid-cols-3 gap-4">
                    <OwWobbleCard brandColor="#e1795d">
                        <span className="font-semibold text-white">Orange</span>
                        <span className="text-sm text-white/70">#e1795d</span>
                    </OwWobbleCard>
                    <OwWobbleCard brandColor="#3b82f6">
                        <span className="font-semibold text-white">Blue</span>
                        <span className="text-sm text-white/70">#3b82f6</span>
                    </OwWobbleCard>
                    <OwWobbleCard brandColor="#22c55e">
                        <span className="font-semibold text-white">Green</span>
                        <span className="text-sm text-white/70">#22c55e</span>
                    </OwWobbleCard>
                </div>
            </OwStorySection>
            <OwStorySection title="With href (clickable)">
                <div className="grid grid-cols-3 gap-4">
                    <OwWobbleCard brandColor="#a855f7" href="/linh-vuc/shopee">
                        <span className="font-semibold text-white">🛍️ Shopee</span>
                        <span className="text-sm text-white/70">Click me</span>
                    </OwWobbleCard>
                </div>
            </OwStorySection>
            <OwStorySection title="renderCondition=false (hidden)">
                <OwWobbleCard renderCondition={false}>
                    <span>You should not see this</span>
                </OwWobbleCard>
                <span className="text-sm text-muted-foreground">Nothing rendered above</span>
            </OwStorySection>
        </OwStories>
    ),
};

export const Default: Story = {
    args: {
        brandColor: '#e1795d',
        children: <><span className="font-semibold text-white">Card title</span><span className="text-sm text-white/70">Card description</span></>,
    },
};

export const WithHref: Story = {
    args: {
        brandColor: '#3b82f6',
        href: '/linh-vuc/shopee',
        children: <><span className="font-semibold text-white">🛍️ Shopee</span><span className="text-sm text-white/70">Hoàn tiền cao nhất cho Shopee</span></>,
    },
};
