# Create Storybook Story

Create a `.stories.tsx` file for a component. The user will pass a component path or name.

## Steps

1. **Find the component** - if user passes just a name (e.g. `card-image`), search `components/` for the file. If multiple matches, ask which one.

2. **Read the component** - understand its props interface, variants, required vs optional props.

3. **Generate the story file** - create `<same-dir>/<filename>.stories.tsx` following the structure below.

## Story structure

Every story file follows this two-part layout:

```tsx
import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {ComponentName} from './<filename>';
import {OwStories, OwStorySection} from './ow-story-section';

const meta: Meta<typeof ComponentName> = {
    component: ComponentName,
    title: '<Folder/ComponentName>',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'One-line description of what this component does and when to use it.',
            },
        },
    },
    // global args only if component has Controls-friendly props (boolean, enum, string)
    args: {
        children: 'Realistic Vietnamese text',
    },
};
export default meta;

type Story = StoryObj<typeof ComponentName>;

// ─── Overview ────────────────────────────────────────────────────────────────
// First export = autodocs Primary = hero at top. Shows ALL variants at a glance.
// Use OwStories + OwStorySection to group. render: () => always (no args).

export const Overview: Story = {
    render: () => (
        <OwStories>
            <OwStorySection title="Default">
                <ComponentName>Nội dung</ComponentName>
            </OwStorySection>
            <OwStorySection title="Variant B">
                <ComponentName variantProp="b">Nội dung</ComponentName>
            </OwStorySection>
            {/* one section per meaningful visual state */}
        </OwStories>
    ),
};

// ─── Individual ──────────────────────────────────────────────────────────────
// One story per variant. Use args where possible → Controls panel works.
// Use render: () => only when args can't express the variant (complex objects, asChild, etc).

export const Default: Story = {};

export const VariantB: Story = {
    args: {variantProp: 'b'},
};
```

### When to use `args` vs `render:`

| Situation | Use |
|-----------|-----|
| Props are boolean / enum / string | `args` - Controls work |
| Props are objects, ReactNode, or asChild pattern | `render: () =>` |
| Overview story (always) | `render: () =>` |
| Component has no props | `render: () => <ComponentName />` |

### Controls decision

- Component has boolean/enum/string props → set global `args` in meta + use `args` in individual stories
- Component shows all variants best as a group (e.g. badge enums) → skip Controls, use `render:` in individuals too; Overview still required

## Title convention

Map folder → Storybook group:
- `components/ow-ui/` → `OW UI/` for primitive/generic components; `Card UI/` for card-domain components (name contains "card", wraps card data, used in card listing/detail contexts); `Bank UI/` for bank-domain components (name contains "bank", wraps bank data, used in bank listing/detail contexts)
- `components/cards/` → `Cards/`
- `components/marketing/` → `Marketing/`
- `components/shared/` → `Shared/`
- `components/blog/` → `Blog/`
- `components/search/` → `Search/`
- `components/compare/` → `Compare/`
- `components/layout/` → `Layout/`
- `components/wallet/` → `Wallet/`

## Story rules

- `Overview` is always the **first export** - autodocs renders it as the Primary hero at top
- `includePrimary={false}` is set globally in `.storybook/preview.tsx` - no double render
- Use realistic Vietnamese data in args (card names, bank names, Vietnamese text)
- Cover key visual states: default, empty/null props, active/inactive, loading (if shimmer exists)
- If component requires API data or complex objects, import type from the relevant `lib/api-types.ts` or mock a minimal object
- Never mock Next.js router - `@storybook/nextjs-vite` handles it automatically
- Never mock `apiFetch` - if component fetches data, note it in a comment and use a static prop version if available

## After creating

- Confirm the file path to the user
- Remind: `pnpm storybook` → `http://localhost:4000`
