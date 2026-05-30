# Add to OW UI

Move a component into `components/ow-ui/`, ensure it follows OW UI conventions, create a Storybook story, then report usages.

## Storybook title prefix constant

All OW UI stories use: `'OW UI'` as the group prefix → `'OW UI/OwButton'`, `'OW UI/OwChip'`, etc.
Change this one line here to rename the group across all stories.

## Steps

### 1. Find the component

If user passes a name (e.g. `chip`), search `components/` for the file. Multiple matches → ask. Already in `ow-ui/` → skip move, go to step 3.

### 2. Move & rename

- Move file to `components/ow-ui/`
- Rename file to `ow-<name>.tsx` if not already (e.g. `chip.tsx` → `ow-chip.tsx`)
- Rename the exported function to `Ow<Name>` (PascalCase with `Ow` prefix) — e.g. `Chip` → `OwChip`
- Add `ow-<name>` CSS class to the wrapper element's `className` if not already present (per component conventions)
- Update all imports across the codebase to the new path + new export name

### 3. Create story file

Create `components/ow-ui/ow-<name>.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OwName } from './ow-name';

const meta: Meta<typeof OwName> = {
  component: OwName,
  title: 'OW UI/OwName',  // ← prefix constant: 'OW UI'
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '<one-line description of what this component does and when to use it>',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof OwName>;

export const Default: Story = { args: { /* required props with realistic Vietnamese data */ } };
// Add named exports for key visual states
```

**Story rules:**
- Use realistic Vietnamese data in args (card names, bank names, Vietnamese text)
- Cover key visual states: default, active/inactive, disabled, empty (where applicable)
- If no props (fully self-contained), use `render: () => <OwName />` instead of `args`
- Never mock Next.js router — `@storybook/nextjs-vite` handles it
- Never mock `apiFetch`

### 4. Report usages

After all changes, output a Markdown table:

| File | Line(s) | Purpose |
|------|---------|---------|
| `components/match/card-match-finder.tsx` | 150, 164, 184, 198, 201 | Spend/rank filter chips |

## After completing

- Confirm: new file path + export name
- Remind: `pnpm storybook` → `http://localhost:4000`
