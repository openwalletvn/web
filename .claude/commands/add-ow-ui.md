# Add to OW UI

Move a component into `components/ow-ui/`, ensure it follows OW UI conventions, create a Storybook story, then report usages.

## Storybook title groups

All OW UI stories use `'OW UI'` as the root prefix with subgroups based on component type:

| Subgroup | Pattern | Examples |
|----------|---------|---------|
| `Card UI/Ow*` | Components that display card data | `OwCardImage`, `OwCardRankedRow` |
| `OW UI/Ow*` | Generic UI primitives | `OwButton`, `OwChip`, `OwAccordion`, `OwLogo`, `OwBadgeNumberIcon` |
| `OW UI/Typography` | Type scale reference (no `Ow*` prefix) | `Typography` |

When adding a new component, pick the subgroup that best fits. Card-related → `Card`. Anything else → `UI`.

## Steps

### 1. Find the component

If user passes a name (e.g. `chip`), search `components/` for the file. Multiple matches → ask. Already in `ow-ui/` → skip move, go to step 3.

### 2. Move & rename

- Move file to `components/ow-ui/`
- Rename file to `ow-<name>.tsx` if not already (e.g. `chip.tsx` → `ow-chip.tsx`)
- Rename the exported function to `Ow<Name>` (PascalCase with `Ow` prefix) - e.g. `Chip` → `OwChip`
- Add `ow-<name>` CSS class to the wrapper element's `className` if not already present (per component conventions)
- Update all imports across the codebase to the new path + new export name

### 3. Apply interactivity pattern

Before writing the component, apply **DESIGN.md § Components → Pre-Write Checklist**:
- Default element → semantically neutral (`<span>` not `<button>`)
- Never hardcode `<button>` as default for components that can be display-only

**Choose pattern based on component structure:**

**A) Component renders `{children}` from caller** (chips, badges, pills) → use `asChild` + Slot:
- `asChild?: boolean` prop + import `Slot` from `"radix-ui"`
- `const Comp = asChild ? Slot : "span"`
- Interactive styles: `[&:is(button,a)]:cursor-pointer [&:is(button,a)]:hover:bg-primary/10`

**B) Component owns its internal content** (logo + text, icon + label, avatar + name) → use `href` prop:
- `href?: string` - renders `<Link href>` when provided, `<span>` otherwise
- Do NOT use `asChild` - Slot requires single child and will throw when component renders multiple internal elements

### 4. Props discipline

**Only port props that are actually used by existing callers.** Do not add props speculatively:
- Scan all usages before writing the component
- If a prop from the original component is never passed by any caller → omit it
- If user explicitly asks for a prop → add it
- Example: original has `size="sm|md"` but no caller passes `size` → drop `size` entirely

### 5. Create story file

Create `components/ow-ui/ow-<name>.stories.tsx` following the structure and rules in `commands/create-story.md`.

Title: `'OW UI/OwName'` - use `'Card UI/OwName'` for card-related components.

### 6. Report usages

After all changes, output a Markdown table:

| File | Line(s) | Purpose |
|------|---------|---------|
| `components/match/card-match-finder.tsx` | 150, 164, 184, 198, 201 | Spend/rank filter chips |

## After completing

- Confirm: new file path + export name
- Remind: `pnpm storybook` → `http://localhost:4000`
