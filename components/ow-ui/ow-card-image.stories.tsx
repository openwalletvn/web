import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwCardImage} from './ow-card-image';

const meta: Meta<typeof OwCardImage> = {
    component: OwCardImage,
    title: 'OW UI/OwCardImage',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Displays a credit card image with responsive border-radius, optional 3D tilt on hover, LQIP blur placeholder, and shimmer overlay.',
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof OwCardImage>;

export const Default: Story = {
    args: {
        src: '/the/msb-visa-online.avif',
        alt: 'MSB Visa Online',
        width: 130,
        height: 82,
        className: 'w-64',
    },
};

export const Vertical: Story = {
    args: {
        src: '/the/sacombank-uniq.avif',
        alt: 'Sacombank Uniq',
        width: 72,
        height: 114,
        className: 'w-32',
    },
};

export const WithTilt: Story = {
    render: () => (
        <div className="flex gap-6 items-end">
            <OwCardImage
                src="/the/msb-visa-online.avif"
                alt="MSB Visa Online"
                width={130}
                height={82}
                tilt={true}
                className="w-48"
            />
            <OwCardImage
                src="/the/woori-vv-hype-point-gold.avif"
                alt="Woori Card"
                width={63}
                height={100}
                tilt={true}
                className="w-28"
            />
        </div>
    ),
};
