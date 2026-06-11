import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwCardImage} from './ow-card-image';
import {DEMO_CARD_HORIZONTAL, DEMO_CARD_VERTICAL} from './ow-story-constants';

const meta: Meta<typeof OwCardImage> = {
    component: OwCardImage,
    title: 'Card UI/OwCardImage',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Displays a credit card image with responsive border-radius, optional 3D tilt on hover, LQIP blur placeholder, and shimmer overlay. Accepts either a `card` object (resolves URL, dimensions, and LQIP automatically) or raw `src`/`alt`/`width`/`height` props.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwCardImage>;

export const Default: Story = {
    args: {
        src: DEMO_CARD_HORIZONTAL.image.url,
        alt: DEMO_CARD_HORIZONTAL.name,
        width: DEMO_CARD_HORIZONTAL.image.width,
        height: DEMO_CARD_HORIZONTAL.image.height,
        className: 'w-64',
    },
};

export const Vertical: Story = {
    args: {
        src: DEMO_CARD_VERTICAL.image.url,
        alt: DEMO_CARD_VERTICAL.name,
        width: DEMO_CARD_VERTICAL.image.width,
        height: DEMO_CARD_VERTICAL.image.height,
        className: 'w-32',
    },
};

export const WithTilt: Story = {
    render: () => (
        <div className="flex gap-6 items-end">
            <OwCardImage
                src={DEMO_CARD_HORIZONTAL.image.url}
                alt={DEMO_CARD_HORIZONTAL.name}
                width={DEMO_CARD_HORIZONTAL.image.width}
                height={DEMO_CARD_HORIZONTAL.image.height}
                tilt={true}
                className="w-48"
            />
            <OwCardImage
                src={DEMO_CARD_VERTICAL.image.url}
                alt={DEMO_CARD_VERTICAL.name}
                width={DEMO_CARD_VERTICAL.image.width}
                height={DEMO_CARD_VERTICAL.image.height}
                tilt={true}
                className="w-28"
            />
        </div>
    ),
};
