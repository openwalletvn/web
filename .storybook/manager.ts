import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'OpenWallet UI',
    brandUrl: 'https://openwallet.vn',
    brandImage: '/icon.png',
    brandTarget: '_blank',

    // Colors from design system
    colorPrimary: '#e02424', // red brand
    colorSecondary: '#e02424',
  }),
});
