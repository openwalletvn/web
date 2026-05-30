import type { Preview } from '@storybook/nextjs-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: ['OW UI', ['Typography', '*'], '*'],
      },
    },
  },
  initialGlobals: {
    viewport: { value: 'iphone12', isRotated: false },
  },
};

export default preview;
