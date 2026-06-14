import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.mdx",
  ],
  "addons": [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
    "@github-ui/storybook-addon-performance-panel",
    "@chromatic-com/storybook"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ],
  "env": () => ({
    NEXT_PUBLIC_API_URL: '',
  }),
  viteFinal: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'next-mdx-remote/rsc': path.resolve(__dirname, './__mocks__/next-mdx-remote-rsc.tsx'),
      '@/components/blog/mdx-components': path.resolve(__dirname, './__mocks__/mdx-components.tsx'),
      '@/lib/remark-auto-link': path.resolve(__dirname, './__mocks__/remark-auto-link.ts'),
    };
    return config;
  },
};
export default config;