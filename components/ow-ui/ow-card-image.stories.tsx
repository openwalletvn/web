import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {OwCardImage} from './ow-card-image';

const meta: Meta<typeof OwCardImage> = {
    component: OwCardImage,
    title: 'Card UI/OwCardImage',
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
        src: 'https://api.openwallet.vn/images/cards/msb/msb-visa-online',
        alt: 'MSB Visa Online',
        width: 130,
        height: 82,
        className: 'w-64',
    },
};

export const Vertical: Story = {
    args: {
        src: 'https://api.openwallet.vn/images/cards/acb/acb-express',
        alt: 'ACB Express',
        width: 72,
        height: 114,
        className: 'w-32',
    },
};

export const WithTilt: Story = {
    render: () => (
        <div className="flex gap-6 items-end">
            <OwCardImage
                src="https://api.openwallet.vn/images/cards/msb/msb-visa-online"
                alt="MSB Visa Online"
                width={130}
                height={82}
                tilt={true}
                className="w-48"
            />
            <OwCardImage
                src="https://api.openwallet.vn/images/cards/woori/woori-visa-platinum"
                alt="Woori Visa Platinum"
                width={130}
                height={82}
                tilt={true}
                className="w-48"
            />
        </div>
    ),
};
