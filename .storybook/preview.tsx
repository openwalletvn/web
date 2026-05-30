import type { Preview } from '@storybook/nextjs-vite';
import posthog from 'posthog-js';
import '../app/globals.css';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story, context) => {
      posthog.capture('storybook_story_viewed', {
        story: context.id,
        component: context.title,
        name: context.name,
      });
      return <Story />;
    },
  ],
};

export default preview;
