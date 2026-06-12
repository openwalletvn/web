import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import Link from 'next/link';
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
                    'Wobble card with brand color background. Wraps the internal `WobbleCard` primitive.',
                    '',
                    '**Props:**',
                    '- `brandColor` - hex color for card background tint (default: `#e1795d`)',
                    '- `className` - extra classes on outer container (for bento grid sizing)',
                    '- `renderCondition` - pass `false` to hide the card entirely',
                    '',
                    '```tsx',
                    '<Link href="/linh-vuc/shopee">',
                    '  <OwWobbleCard brandColor="#e1795d">',
                    '    <span className="font-semibold">Shopee</span>',
                    '    <span className="text-sm">Hoàn tiền cao nhất cho Shopee</span>',
                    '  </OwWobbleCard>',
                    '</Link>',
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
            <OwStorySection title="With Link (clickable)">
                <div className="grid grid-cols-3 gap-4">
                    <Link href="/linh-vuc/shopee">
                        <OwWobbleCard brandColor="#a855f7">
                            <span className="font-semibold text-white">🛍️ Shopee</span>
                            <span className="text-sm text-white/70">Click me</span>
                        </OwWobbleCard>
                    </Link>
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

export const BentoGrid: Story = {
    render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
            <OwWobbleCard
                brandColor="#be185d"
                className="col-span-1 lg:col-span-2 h-full min-h-[500px] lg:min-h-[300px]"
            >
                <div className="max-w-xs">
                    <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                        Gippity AI powers the entire universe
                    </h2>
                    <p className="mt-4 text-left text-base/6 text-neutral-200">
                        With over 100,000 monthly active bot users, Gippity AI is the most popular AI platform for developers.
                    </p>
                </div>
                <img
                    src="/linear.webp"
                    width={500}
                    height={500}
                    alt="linear demo image"
                    className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
                />
            </OwWobbleCard>
            <OwWobbleCard className="col-span-1 min-h-[300px]">
                <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    No shirt, no shoes, no weapons.
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                    If someone yells "stop!", goes limp, or taps out, the fight is over.
                </p>
            </OwWobbleCard>
            <OwWobbleCard
                brandColor="#1e40af"
                className="col-span-1 lg:col-span-3 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]"
            >
                <div className="max-w-sm">
                    <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                        Signup for blazing-fast cutting-edge state of the art Gippity AI wrapper today!
                    </h2>
                    <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                        With over 100,000 monthly active bot users, Gippity AI is the most popular AI platform for developers.
                    </p>
                </div>
                <img
                    src="/linear.webp"
                    width={500}
                    height={500}
                    alt="linear demo image"
                    className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
                />
            </OwWobbleCard>
        </div>
    ),
};

export const WithLink: Story = {
    render: () => (
        <Link href="/linh-vuc/shopee">
            <OwWobbleCard brandColor="#3b82f6">
                <span className="font-semibold text-white">🛍️ Shopee</span>
                <span className="text-sm text-white/70">Hoàn tiền cao nhất cho Shopee</span>
            </OwWobbleCard>
        </Link>
    ),
};
