// Shared demo constants for Storybook stories

export const DEMO_CARD_HORIZONTAL = {
    id: 'msb-visa-online',
    name: 'MSB Visa Online',
    image: {
        url: '/the/msb-visa-online.avif',
        orientation: 'horizontal' as const,
        width: 386,
        height: 243,
    },
};

export const DEMO_CARD_VERTICAL = {
    id: 'sacombank-uniq',
    name: 'Sacombank Uniq',
    image: {
        url: '/the/sacombank-uniq.avif',
        orientation: 'vertical' as const,
        width: 243,
        height: 386,
    },
};

