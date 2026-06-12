import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwTypingBubble} from './ow-typing-bubble';
import {OwStories, OwStorySection} from "@/components/owui/ow-story-section";

const meta: Meta<typeof OwTypingBubble> = {
    component: OwTypingBubble,
    title: 'OW AI/OwTypingBubble',
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

type Story = StoryObj<typeof OwTypingBubble>;

// ─── Overview ────────────────────────────────────────────────────────────────

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Visible">
                <OwTypingBubble visible={true}/>
            </OwStorySection>
            <OwStorySection title="Hidden">
                <span className="text-muted-foreground text-sm">renders nothing</span>
                <OwTypingBubble visible={false}/>
            </OwStorySection>
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────

export const Visible: Story = {args: {visible: true}};

export const Hidden: Story = {args: {visible: false}};
