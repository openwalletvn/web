# Create Storybook Story

Create a `.stories.tsx` file for a component. The user will pass a component path or name.

## Steps

1. **Find the component** — if user passes just a name (e.g. `card-image`), search `components/` for the file. If multiple matches, ask which one.

2. **Read the component** — understand its props interface, variants, required vs optional props.

3. **Generate the story file** — create `<same-dir>/<filename>.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComponentName } from './<filename>';

const meta: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: '<Folder/ComponentName>',  // e.g. 'Cards/CardImage', 'UI/Chip', 'Marketing/HeroSection'
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ComponentName>;

export const Default: Story = { args: { /* required props with realistic Vietnamese data */ } };
// Add more named exports for key visual states: Loading, Empty, WithX, WithoutY, etc.
```

## Title convention

Map folder → Storybook group:
- `components/ui/` → `UI/`
- `components/cards/` → `Cards/`
- `components/marketing/` → `Marketing/`
- `components/shared/` → `Shared/`
- `components/blog/` → `Blog/`
- `components/search/` → `Search/`
- `components/compare/` → `Compare/`
- `components/layout/` → `Layout/`
- `components/wallet/` → `Wallet/`

## Story rules

- Use realistic Vietnamese data in args (card names, bank names, Vietnamese text)
- Cover key visual states: default, empty/null props, active/inactive, loading (if shimmer exists)
- If component requires API data or complex objects, import type from the relevant `lib/api-types.ts` or mock a minimal object
- If component has no props (fully self-contained), use `render: () => <ComponentName />` instead of `args`
- Never mock Next.js router — `@storybook/nextjs-vite` handles it automatically
- Never mock `apiFetch` — if component fetches data, note it in a comment and use a static prop version if available

## After creating

- Confirm the file path to the user
- Remind: `pnpm storybook` → `http://localhost:4000`
