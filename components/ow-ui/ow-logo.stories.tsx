import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwLogo} from './ow-logo';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwLogo> = {
    component: OwLogo,
    title: 'OW UI/OwLogo',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Site logo — icon or full lockup, black/white/red, optionally wrapped in a link.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwLogo>;

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Icon">
                <OwLogo variant="icon"/>
            </OwStorySection>
            <OwStorySection title="Full — black">
                <OwLogo variant="full" color="black"/>
            </OwStorySection>
            <OwStorySection title="Full — white">
                <div className="bg-gray-900 p-4 rounded">
                    <OwLogo variant="full" color="white"/>
                </div>
            </OwStorySection>
            <OwStorySection title="Full — red">
                <OwLogo variant="full" color="red"/>
            </OwStorySection>
            <OwStorySection title="No link (display only)">
                <OwLogo variant="icon" href={null}/>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const Icon: Story = {args: {variant: 'icon'}};

export const FullBlack: Story = {args: {variant: 'full', color: 'black'}};

export const FullWhite: Story = {
    args: {variant: 'full', color: 'white'},
    parameters: {backgrounds: {default: 'dark'}},
};

export const FullRed: Story = {args: {variant: 'full', color: 'red'}};

export const NoLink: Story = {args: {variant: 'icon', href: null}};
