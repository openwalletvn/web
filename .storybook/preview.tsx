import type { Preview } from '@storybook/nextjs-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    docs: {
      page: () => (
        <>
          <Title/>
          <Subtitle/>
          <Description/>
          <Primary/>
          <Controls/>
          <Stories includePrimary={false}/>
        </>
      ),
    },
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
