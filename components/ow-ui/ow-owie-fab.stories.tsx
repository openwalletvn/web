import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwOwieFab} from './ow-owie-fab';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof OwOwieFab> = {
    component: OwOwieFab,
    title: 'OW UI/OwOwieFab',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Persistent floating action button. Fixed bottom-right (`bottom-3 right-3 z-50`). Hover shows "Chào CT!" tooltip.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwOwieFab>;

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Default (fixed to iframe corner)">
                <div className="h-48 w-full border border-dashed border-border rounded-lg bg-bg-muted flex items-center justify-center text-text-muted text-sm">
                    Page content - FAB sits bottom-right of preview
                </div>
                <OwOwieFab/>
            </OwStorySection>
        </OwStories>
    ),
};
