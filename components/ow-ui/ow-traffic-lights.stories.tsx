import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwTrafficLights} from './ow-traffic-lights';
import {OwStories, OwStorySection} from './ow-story-section';
import {X, Minus, Square, ChevronDown, ChevronUp} from 'lucide-react';

const meta: Meta<typeof OwTrafficLights> = {
    component: OwTrafficLights,
    title: 'OW UI/OwTrafficLights',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'macOS-style traffic light button group. Dots show icons on group hover. Fully customizable via `buttons` prop.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwTrafficLights>;

export const Default: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Default (no icons)">
                <OwTrafficLights />
            </OwStorySection>

            <OwStorySection title="With icons (hover to reveal)">
                <OwTrafficLights
                    buttons={[
                        {id: 'close', color: '#ff5f57', icon: <X size={8} strokeWidth={2.5} />, label: 'Close'},
                        {id: 'minimize', color: '#febc2e', icon: <Minus size={8} strokeWidth={2.5} />, label: 'Minimize'},
                        {id: 'maximize', color: '#28c840', icon: <Square size={8} strokeWidth={2.5} />, label: 'Maximize'},
                    ]}
                />
            </OwStorySection>

            <OwStorySection title="Custom colors + actions">
                <OwTrafficLights
                    buttons={[
                        {id: 'up', color: '#3b82f6', icon: <ChevronUp size={8} />, onClick: () => alert('up'), label: 'Up'},
                        {id: 'down', color: '#8b5cf6', icon: <ChevronDown size={8} />, onClick: () => alert('down'), label: 'Down'},
                    ]}
                />
            </OwStorySection>

            <OwStorySection title="Large size">
                <OwTrafficLights buttonClass="size-5" className="gap-3" />
            </OwStorySection>

            <OwStorySection title="With disabled button">
                <OwTrafficLights
                    buttons={[
                        {id: 'close', color: '#ff5f57', icon: <X size={8} strokeWidth={2.5} />, label: 'Close'},
                        {id: 'minimize', color: '#febc2e', icon: <Minus size={8} strokeWidth={2.5} />, label: 'Minimize', disabled: true},
                        {id: 'maximize', color: '#28c840', icon: <Square size={8} strokeWidth={2.5} />, label: 'Maximize'},
                    ]}
                />
            </OwStorySection>
        </OwStories>
    ),
};
