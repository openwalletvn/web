import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwLogo} from './ow-logo';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta = {
    title: 'Assistant UI/OwTypingBubble',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Animated typing indicator shown while the assistant is generating a response but has not yet produced any text.',
            },
        },
    },
};
export default meta;

type Story = StoryObj;

// ─── Overview ────────────────────────────────────────────────────────────────
// OwTypingBubble reads from assistant-ui thread state (useAuiState) and renders
// only when the message is running and has no text yet — it cannot be rendered
// standalone without a thread context. Show the visual output as a static mock.

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Typing state (visual mock)">
                <div className="ow-typing-bubble flex items-center gap-2 px-2 py-1">
                    <OwLogo variant="full" color="red" href={null} className="h-5 w-auto animate-bounce"/>
                    <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]"/>
                    <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]"/>
                    <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]"/>
                </div>
            </OwStorySection>
        </OwStories>
    ),
};
