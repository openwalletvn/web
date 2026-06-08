---
name: OpenWallet
colors:
  primary: "#EF3C23"
  black: "#000000"
  white: "#FFFFFF"
  bg-light: "#F7F7F7"
  bg-warm: "#E9E7E8"
  bg-muted: "#EDEDED"
  bg-green: "#EDEFEC"
  border: "#E2E2E2"
  border-dark: "#DCDCDC"
  border-mid: "#C8C8C8"
  divider: "#D9D9D9"
  text-primary: "#000000"
  text-near-black: "#0E0F0C"
  text-body-alt: "#000001"
  text-muted: "#646664"
  text-subtle: "#9A9A9A"
  text-accent: "#EF3C23"
typography:
  display:
    family: "'Cal Sans', sans-serif"
    weight: 400
  body:
    family: "'Inter Tight', sans-serif"
    weight: 500
  hero:
    family: "'Cal Sans', sans-serif"
    size: "clamp(2.5rem, 5vw, 72px)"
    weight: 400
    lineHeight: "100%"
    letterSpacing: "-1.5px"
  section:
    family: "'Cal Sans', sans-serif"
    size: "clamp(1.75rem, 4vw, 56px)"
    weight: 400
    lineHeight: "120%"
    letterSpacing: "-1px"
  display-md:
    family: "'Cal Sans', sans-serif"
    size: "clamp(1.5rem, 3vw, 40px)"
    weight: 400
    lineHeight: "100%"
    letterSpacing: "-1.05517px"
  card-heading:
    family: "'Cal Sans', sans-serif"
    size: "clamp(1.125rem, 2vw, 24px)"
    weight: 400
    lineHeight: "130%"
  ui:
    family: "'Cal Sans', sans-serif"
    size: "clamp(1rem, 1.5vw, 18px)"
    weight: 400
    lineHeight: "130%"
  body-lg:
    family: "'Inter Tight', sans-serif"
    size: "22px"
    weight: 500
    lineHeight: "130%"
  body-md:
    family: "'Inter Tight', sans-serif"
    size: "18px"
    weight: 500
    lineHeight: "130%"
  body:
    family: "'Inter Tight', sans-serif"
    size: "16px"
    weight: 500
    lineHeight: "130%"
  body-sm:
    family: "'Inter Tight', sans-serif"
    size: "14px"
    weight: 500
    lineHeight: "130%"
  label:
    family: "'Inter Tight', sans-serif"
    size: "12px"
    weight: 600
    lineHeight: "130%"
    letterSpacing: "1px"
    textTransform: "uppercase"
  nav:
    family: "'Inter Tight', sans-serif"
    size: "14px"
    weight: 600
    lineHeight: "130%"
    letterSpacing: "1px"
    textTransform: "uppercase"
spacing:
  1: "4px"
  2: "8px"
  3: "11px"
  4: "12px"
  5: "16px"
  6: "20px"
  7: "22px"
  8: "24px"
  9: "28px"
  10: "32px"
  11: "39px"
  12: "48px"
  13: "67px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "32px"
  2xl: "40px"
  pill: "48px"
  full: "96px"
  circle: "112px"
components:
  button-primary:
    background: "{colors.black}"
    borderRadius: "{rounded.pill}"
    padding: "16px 24px"
    color: "{colors.white}"
    fontFamily: "{typography.display.family}"
    fontSize: "18px"
  button-brand:
    background: "{colors.primary}"
    borderRadius: "{rounded.full}"
    padding: "8px"
  chip:
    background: "{colors.bg-green}"
    border: "1px solid #D3D3D3"
    borderRadius: "52px"
    padding: "8px 16px"
    fontSize: "16px"
    fontWeight: 500
  chip-active:
    background: "{colors.primary}"
    color: "{colors.white}"
  card:
    border: "1px solid {colors.border}"
    borderRadius: "{rounded.lg}"
    background: "{colors.white}"
  glass:
    background: "rgba(124, 124, 124, 0.4)"
    border: "1px solid rgba(236, 236, 236, 0.3)"
    backdropFilter: "blur(14px)"
    borderRadius: "{rounded.circle}"
  accordion:
    background: "{colors.white}"
    border: "1px solid {colors.border-dark}"
    borderRadius: "{rounded.md}"
    padding: "24px"
---

# OpenWallet Design System

Single source of truth for tokens, components, and UI rules. Read this before writing any UI. All three concerns live here: design tokens, layout rules, component catalog.

---

## Overview

- **Font display:** Cal Sans — headings, CTAs, UI labels
- **Font body:** Inter Tight — body copy, captions, nav
- **Token usage:** CSS vars via `--color-*`, `--space-*`, `--radius-*`. Tailwind aliases: `bg-primary`, `text-text-muted`, `border-border`, etc.
- **Typography source of truth:** `app/typography.css` — all text utility classes live there
- **Container source of truth:** `ow-container` defined in `app/globals.css`

---

## Colors

### CSS Variables

```css
:root {
  /* Brand */
  --color-primary: #EF3C23;
  --color-black: #000000;
  --color-white: #FFFFFF;

  /* Backgrounds */
  --color-bg-light: #F7F7F7;
  --color-bg-warm: #E9E7E8;
  --color-bg-muted: #EDEDED;
  --color-bg-green: #EDEFEC;

  /* Borders */
  --color-border: #E2E2E2;
  --color-border-dark: #DCDCDC;
  --color-border-mid: #C8C8C8;
  --color-divider: #D9D9D9;

  /* Text */
  --color-text-primary: #000000;
  --color-text-near-black: #0E0F0C;
  --color-text-body-alt: #000001;
  --color-text-muted: #646664;
  --color-text-subtle: #9A9A9A;
  --color-text-accent: #EF3C23;
}
```

### Usage

| Token | Usage |
|-------|-------|
| `--color-primary` | CTA buttons, accents, badges, highlights |
| `--color-black` | Dark backgrounds, primary text |
| `--color-white` | Light backgrounds, text on dark |
| `--color-bg-light` | Page background, card backgrounds |
| `--color-bg-warm` | Section backgrounds, decorative fills |
| `--color-bg-muted` | Subtle panel backgrounds |
| `--color-bg-green` | Tag/chip default background |
| `--color-border` | Card borders |
| `--color-border-dark` | Input borders, dividers |
| `--color-border-mid` | Filter tab borders |
| `--color-divider` | Card dividers |
| `--color-text-primary` | Headings, body text |
| `--color-text-muted` | Labels, captions, secondary text |
| `--color-text-subtle` | Descriptions on dark backgrounds |
| `--color-text-accent` | Highlighted names, links |

---

## Typography

**Never use Tailwind text/font utilities on `<h1>`–`<h6>`.** Use classes from `app/typography.css` only.

### Font Families

```css
--font-display: 'Cal Sans', sans-serif;   /* headings, CTAs */
--font-body: 'Inter Tight', sans-serif;   /* body, UI, nav */
```

**Source of truth: `app/typography.css`** — always read that file for the authoritative class list and values. The table below is a snapshot; the file is canonical.

### Utility Classes

**Display (Cal Sans) — applied automatically to `h1`–`h6`, or use as override classes:**

| Class | Size (mobile → desktop) | Use for |
|-------|--------------------------|---------|
| `.heading-1` | 40px → 72px | Page hero |
| `.heading-2` | 31px → 56px | Section headings |
| `.heading-3` | 23px → 42px | Feature headings |
| `.heading-4` | 20px → 36px | Card section titles |
| `.heading-5` | 17px → 30px | UI labels |
| `.heading-6` | 14px → 20px | Small UI labels |

**Body (Inter Tight):**

| Class | Size | Use for |
|-------|------|---------|
| `.text-body-lg` | 22px | Lead text |
| `.text-body-md` | 18px | Standard body |
| `.text-body` | 16px | Default body |
| `.text-body-sm` | 14px | Secondary text |
| `.text-caption` | 14px | Captions |
| `.text-label` | 12px | Uppercase labels |
| `.text-numeral` | 24px bold | Stat numbers |
| `.text-link` | — | Inline links (red + underline) |

### Heading Elements

`h1`–`h6` get `heading-1` through `heading-6` automatically via `@layer base`. Use a different `.heading-*` class on the element when visual size should differ from semantic level.

### Typography Rules

- No hardcoded `font-size`, `font-weight`, `line-height`, `letter-spacing` in components
- No Tailwind `text-sm`, `text-xs`, `text-lg`, `font-bold`, `font-semibold` on `<h1>`–`<h6>`
- No `[&_a]:` Tailwind variants for multi-property styles — use a utility class in `typography.css`
- Recurring visual pattern → create utility class in `typography.css`, not an inline chain
- `globals.css` scope: variables and tokens only (`@theme`, `:root`, `@layer base` for non-typography resets)

### `Text` + `Heading` Components

```tsx
<Text variant="body|body-sm|body-md|body-lg|label" as="p|span|div|li" />
<Heading as="h1|h2|h3|h4|h5|h6" />
// variant optional — omit to use element's default base style
```

---

## Layout

### Container

**Always `ow-container`.** Never `max-w-container mx-auto px-4`, `container mx-auto`, or `max-w-[1440px] mx-auto px-6`.

```
max-width: 1440px
margin-inline: auto
padding-inline: 1.5rem (px-6)
width: 100%
```

### Section Pattern

```tsx
<section className="ow-some-section bg-whatever py-12">
  <div className="ow-container">
    {/* content */}
  </div>
</section>
```

Apply `ow-container` on the **inner wrapper**, not the section. Sections can be full-bleed.

### CSS Rules

- Conditional/merged classes → always `cn()` from `@/lib/utils`. Never template literals.
- No inline styles for static values → Tailwind arbitrary values (`w-[48px]`) before `style={{}}`
- `style={{}}` only for truly dynamic runtime values: `style={{ width: \`${pct}%\` }}`
- After any CSS/layout change: re-read these rules and confirm no violations
- Every component must be checked for mobile/tablet/desktop breakpoints

### `Stack` Component

```tsx
<Stack direction="col|row" gap={4} align="start|center|end|stretch" justify="start|between|..." wrap={false} as="div" />
```

Gap values: `1 2 3 4 5 6 8 10 12` (maps to Tailwind `gap-*`).

---

## Spacing

### CSS Variables

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 11px;  --space-4: 12px;
--space-5: 16px;  --space-6: 20px;  --space-7: 22px;  --space-8: 24px;
--space-9: 28px;  --space-10: 32px; --space-11: 39px; --space-12: 48px;
--space-13: 67px;
```

### Context Guide

| Context | Gap |
|---------|-----|
| Tight (tags, icon rows) | `4px`, `8px` |
| Card inner content | `11px`, `12px` |
| Section stack | `16px`, `24px` |
| Major section gap | `32px`, `39px`, `48px` |
| Hero / loose layout | `67px` |

---

## Shapes (Border Radius)

**Use only `ow-rounded-large` and `ow-rounded-small` utility classes on components.** Never use raw `rounded-*`, `--radius-*` vars, or arbitrary values for component border radius.

```css
/* Defined in globals.css as @utility */
ow-rounded-large: 1rem → 2rem (sm) → 2.5rem (lg)   /* cards, panels, large containers */
ow-rounded-small: 0.5rem → 1rem (sm)                /* inputs, chips, small elements */
```

### CSS Variables (tokens only — do not use directly in components)

```css
--radius-sm: 4px;     --radius-md: 8px;    --radius-lg: 16px;
--radius-xl: 32px;    --radius-2xl: 40px;  --radius-pill: 48px;
--radius-full: 96px;  --radius-circle: 112px;
```

---

## Key UI Patterns

### CTA Button (Primary)

```css
background: #000000;
border-radius: 48px;
padding: 16px 24px;
font-family: 'Cal Sans';
font-size: 18px;
color: #FFFFFF;
```

### CTA Button (Brand Red)

```css
background: #EF3C23;
border-radius: 96px;
padding: 8px;
```

### Tag / Chip (default)

```css
background: #EDEFEC;
border: 1px solid #D3D3D3;
border-radius: 52px;
padding: 8px 16px;
font-size: 16px;
font-weight: 500;
```

### Tag / Chip (active)

```css
background: #EF3C23;
color: #FFFFFF;
```

### Card

```css
border: 1px solid #E2E2E2;
border-radius: 16px;
background: #FFFFFF;
```

### Glass / Frosted Bar

```css
background: rgba(124, 124, 124, 0.4);
border: 1px solid rgba(236, 236, 236, 0.3);
backdrop-filter: blur(14px);
border-radius: 112px;
```

### FAQ / Accordion Item

```css
background: #FFFFFF;
border: 1px solid #DCDCDC;
border-radius: 8px;
padding: 24px;
```

### Grid Card Layout (required pattern)

For any grid of cards (persona hubs, stat groups, feature tiles, key figures) use `OwWobbleCard` in a responsive CSS grid. Never flat bordered cards for this pattern. Never dashed borders anywhere.

```tsx
<div className="ow-my-section-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  <OwWobbleCard brandColor={color}>
    {/* content */}
  </OwWobbleCard>
  {/* … more cells */}
</div>
```

Reference: `ow-persona-hub-page-list` in `app/(marketing)/(persona)/linh-vuc/page.tsx`.

---

## Components

### Pre-Write Checklist

Follow in order. Stop at first match.

1. **Check `components/ui/` AND `components/ow-ui/` first** — primitives already exist (see list below). If it's there, use it. Do not recreate. If unsure whether a needed component exists, ask before creating.
2. **Check this doc for domain components** — if variant prop exists, use it.
3. **Add variant before new file** — new visual treatment → add `variant` prop to existing component.
4. **New file only when ROI is clear** — used in 2+ places, OR >80 lines JSX, OR clearly distinct domain.
5. **Every new component must have `ow-` class** — `ow-<filename-kebab-case>` on wrapper element.
6. **Interactive components** — use `asChild` + `Slot`, not hardcoded element (see pattern below).
7. **Token/style rules** — colors/spacing/radius from tokens, typography from `typography.css`, layout via `ow-container`.

### `ow-` Naming Convention

Every component wrapper must have `ow-<filename-kebab-case>` — purpose: identify components in browser DevTools inspector.

```
post-card.tsx       → ow-post-card
card-display.tsx    → ow-card-display
my-widget.tsx       → ow-my-widget
```

Prepend to existing `className`. No new wrapper elements.

### `asChild` + `Slot` Pattern

**A) Display components** (chips, badges, tags, pills, avatars) — sometimes interactive:

```tsx
<OwChip>Label</OwChip>                         // display only
<OwChip asChild><button onClick={fn}>Filter</button></OwChip>  // interactive
<OwChip asChild><a href="/x">Link</a></OwChip>
```

Default element: `<span>`. Interactive styles via `[&:is(button,a)]`.

**B) Always-interactive components** (header buttons, nav actions, triggers):

```tsx
<OwButtonHeader onClick={fn}>...</OwButtonHeader>       // renders <button>
<OwButtonHeader asChild><a href="/search">...</a></OwButtonHeader>  // swap to link
```

Default element: `<button>`. No `[&:is(button,a)]` guard needed.

Import `Slot` from `"radix-ui"`.

---

### UI Primitives

**Before writing any UI, check both component folders for existing primitives. If something looks like it should exist but doesn't, ask — don't invent.**

**`components/ui/`** (shadcn/radix primitives):

`accordion`, `badge`, `brand-badge`, `brand-button`, `breadcrumb`, `button`, `chip`,
`collapsible`, `command`, `dashed-badge`, `dialog`, `empty-state`, `form-field`,
`heading`, `input`, `navigation-menu`, `page-container`, `popover`, `select`,
`separator`, `sheet`, `sidebar`, `skeleton`, `stack`, `switch`, `text`, `tooltip`

**`components/ow-ui/`** (domain primitives — updated regularly):

**Source of truth: `ls components/ow-ui/`** — always list the directory before starting any UI work. The list below is a snapshot only.

`ow-accordion`, `ow-alert`, `ow-amount`, `ow-badge` + `ow-badges`, `ow-badge-number-icon`,
`ow-bank-image`, `ow-bank-row`, `ow-button`, `ow-button-header`, `ow-card-cashback-rule`,
`ow-card-image`, `ow-card-intent-badges`, `ow-card-ranked-row`, `ow-logo`, `ow-owie-fab`,
`ow-rank-badge`, `ow-range-slider`, `ow-source-list`, `ow-tooltip`, `ow-traffic-lights`,
`ow-wobble-card`

---

### Badge System

**`OwBadge`** — single primitive for all badge/chip UI. Import from `@/components/ow-ui/ow-badge`.

| Variant | Use |
|---------|-----|
| `variant="intent"` | Cashback intent, colored by slug |
| `variant="network"` | Card network with logo |
| `variant="card-type"` | Card type label |
| _(no variant)_ | Generic badge, pass `colorHex` |

All variants support `active`, `asChild`.

**`OwBadges`** — required wrapper for any badge group. Never raw `<div className="flex flex-wrap gap-*">`.

```tsx
<OwBadges>
  <OwBadge variant="intent" slug="dining" emoji="🍜" label="Dining" highlighted />
  <OwBadge variant="network" networkData={...} tier="Platinum" />
</OwBadges>

<OwBadges className="mt-2">...</OwBadges>
```

**Other badge components** (`components/shared/badges/`):

| Component | File | Use when |
|-----------|------|----------|
| `NetworkBadge` | `shared/badges/network-badge.tsx` | Visa/MC/JCB network on card |
| `CardTypeBadge` | `shared/badges/card-type-badge.tsx` | Single card type label |
| `CardTypeBadges` | `shared/badges/card-type-badge.tsx` | All types on a card |
| `OwBankBadge` | `ow-ui/ow-bank-badge.tsx` | Bank logo + name, optionally linked |
| `ContactlessBadge` | `shared/badges/contactless-badge.tsx` | NFC/contactless pill |
| `MetalBadge` | `shared/badges/metal-badge.tsx` | "Kim loại" gradient badge |

```tsx
<NetworkBadge card={card} size="sm|md" variant="full|slim" />
<OwBankBadge bank={bank} size="sm|md" showName={true} />
<OwBankBadge bank={bank} asChild><a href="/ngan-hang/id" /></OwBankBadge>
<ContactlessBadge method={method} showName={true} />
```

---

### CardDisplay Variants

**File:** `components/cards/variants/card-display.tsx`

| Variant | Use case |
|---------|----------|
| `tile` | Grid layouts, card browsing |
| `row` | List rows with optional slot |
| `slim` | Compact sidebar/list items |
| `inline` | Inline text embeds |

```tsx
// tile
<CardDisplay variant="tile" card={card} bank={bank} href="/custom" badge="Best pick"
  showActions={true} badges={{ network, type, metal, status, fee }} />

// row
<CardDisplay variant="row" card={card} bank={bank}
  slot={<Button>Action</Button>} badges={{ network, type, metal, status }} />

// slim
<CardDisplay variant="slim" card={card} showThumb={false} asLink={true}
  badges={{ network, type, fee }} />

// inline
<CardDisplay variant="inline" card={card} showLogo={true} asLink={false}
  badges={{ network }} />
```

Badge defaults by variant:

| Badge | tile | row | slim | inline |
|-------|------|-----|------|--------|
| network | ✓ | ✓ | ✓ | ✓ |
| type | ✓ | ✓ | — | — |
| metal | ✓ | — | always on | — |
| status | ✓ | — | always on | — |
| fee | ✓ | — | — | — |

---

### Page Layout Shells

| Shell | File | Use for |
|-------|------|---------|
| `MarketingPageShell` | `layout/marketing-page-shell.tsx` | Card listing, category, bank pages |
| `BlogPageShell` | `layout/blog-page-shell.tsx` | Blog listing, post pages |
| `ProsePageShell` | `layout/prose-page-shell.tsx` | Legal, about, static content |

All shells include: `ow-container`, `Breadcrumbs`, `<h1>` title, optional `description` + JSON-LD.

```tsx
<MarketingPageShell
  title="Thẻ tín dụng"
  description="Mô tả ngắn"
  breadcrumbItems={[{ label: 'Trang chủ', href: '/' }, { label: 'Thẻ tín dụng' }]}
  jsonLd={jsonLdObject}
>
  {children}
</MarketingPageShell>
```

---

## Do's and Don'ts

### Colors

- Use token vars (`--color-primary`, `bg-primary`) — never hardcode hex in components
- No hardcoded `color`, `background`, `border-color` values

### Typography

- Use `.text-*` utility classes — never hardcode `font-size`, `font-weight`, `line-height`
- Never put Tailwind `text-sm/xs/lg`, `font-bold/semibold/medium` on `<h1>`–`<h6>`
- No `[&_a]:` for multi-property styles — create utility class in `typography.css`

### Layout

- Use `ow-container` — never `max-w-*`, `container mx-auto`, ad-hoc width combos
- Use `cn()` — never template literals for conditional classes
- Use Tailwind arbitrary values or `style={{}}` for dynamic values only
- Grid of cards → `OwWobbleCard` in CSS grid — never flat bordered cards

### Border Radius

- Use only `ow-rounded-large` (cards/panels) and `ow-rounded-small` (inputs/chips)
- Never `rounded-*`, raw `--radius-*` vars, or arbitrary radius values in components

### Borders

- Never dashed borders (`border-dashed`) anywhere in UI
- No dashed dividers, no dashed separators, no dashed input styles

### Components

- Use existing primitive before creating new component
- Use `asChild` + `Slot` — never hardcode `<button>` on display components
- Use `OwBadges` wrapper — never raw flex div for badge groups
- Add `ow-<filename>` class to every component wrapper
