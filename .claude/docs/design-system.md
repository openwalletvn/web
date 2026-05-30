# Design System — LLM Reference

Single source of truth for components, tokens, and layout patterns.
Read this before creating any UI. Check here before adding new primitives.

---

## Rules — Before Writing Any UI

Follow this checklist in order. Stop at the first match.

### 1. Check `components/ui/` first
Primitives already exist: `button`, `badge`, `chip`, `dialog`, `input`, `select`, `skeleton`, `tooltip`, `empty-state`, `form-field`, `sheet`, `popover`, `separator`, `switch`, `accordion`, `collapsible`, `command`, `sidebar`, `navigation-menu`, `breadcrumb`, `brand-badge`, `brand-button`, `dashed-badge`, `page-container`.

**If it's there — use it. Do not recreate.**

### 2. Check this doc for domain components
Badge/display components, card variants, page shells — all catalogued below.

**If it exists as a variant prop — use the variant, not a new component.**

Example: need a compact card in a list? → `<CardDisplay variant="slim" />`, not a new file.

### 3. Consider adding a variant before creating a new file
New visual treatment of an existing component → add `variant` prop to existing component.
New file only when: fundamentally different structure, different domain, or 3+ callers with incompatible prop shapes.

### 4. Only create a new component when ROI is clear
New component justified when:
- Used in 2+ places, or
- Complexity warrants isolation (>80 lines of JSX), or
- Domain is clearly distinct

Single-use, simple markup → inline it. No premature abstraction.

### 5. Every new component must have `ow-` class
Pattern: `ow-<filename-kebab-case>` on the wrapper element.
```
my-widget.tsx → className="ow-my-widget ..."
```
Prepend to existing `className`. Never add a wrapper element just for this.

### 6. Interactive components — use `asChild` + `Slot`, not hardcoded element

Two patterns depending on intent:

**A) Display components that are *sometimes* interactive** (chips, badges, tags, pills, avatars)
Default to neutral element (`<span>`). Caller opts in via `asChild`:

```tsx
// display only
<OwChip>Label</OwChip>

// interactive — caller provides the element
<OwChip asChild><button onClick={fn}>Filter</button></OwChip>
<OwChip asChild><a href="/x">Link</a></OwChip>
```

**B) Components that are *always* interactive** (header buttons, trigger buttons, nav items)
Default to `"button"`. `asChild` lets caller swap to `<a>` or custom element:

```tsx
// default — renders <button>
<OwButtonHeader onClick={fn}>...</OwButtonHeader>

// swap to link
<OwButtonHeader asChild><a href="/search">...</a></OwButtonHeader>
```

Rules:
- `asChild` prop + Radix `Slot` (import from `"radix-ui"`) delegates rendering to child
- **Display components** (can be display-only) → default `"span"`, interactive styles via `[&:is(button,a)]`
- **Always-interactive components** → default `"button"`, no `[&:is(button,a)]` guard needed
- Never hardcode `<button>` on display components; never default to `<span>` on always-interactive ones
- Pattern A applies to: chips, badges, tags, pills, avatars
- Pattern B applies to: header buttons, search triggers, nav action buttons

### 7. Token/style rules
- Colors, spacing, radius → tokens from `DESIGN.md`, not hardcoded values
- Typography → classes from `typography.css`, never Tailwind text/font utilities on `<h1>`–`<h6>`
- Layout → `ow-container`, never ad-hoc `max-w-*`
- Conditional classes → `cn()` from `@/lib/utils`
- No inline styles for static values

---

## Card Display Variants

**File:** `components/cards/variants/card-display.tsx`
**Export:** `<CardDisplay variant="..." />`

| Variant | Use case | Context |
|---------|----------|---------|
| `tile` | Grid layouts, card browsing | `card-masonry`, `compare-suggested-cards` |
| `row` | List rows with optional slot | No active consumer (available) |
| `slim` | Compact sidebar/list items | `sidebar-related-cards` |
| `inline` | Inline text embeds | No active consumer (available) |

### Props by variant

**tile** — full card with hover glow + action buttons
```tsx
<CardDisplay
  variant="tile"
  card={card}
  bank={bank}           // optional, falls back to card.bank_data
  href="/the/custom"    // optional, defaults to /the/{card.id}
  badge="Best pick"     // optional tooltip on hover
  showActions={true}    // compare + bank + link buttons on hover
  badges={{ network, type, metal, status, fee }}
  className="..."
/>
```

**row** — horizontal card row with image + badges + optional slot
```tsx
<CardDisplay
  variant="row"
  card={card}
  bank={bank}
  slot={<Button>Action</Button>}   // right-side slot
  badges={{ network, type, metal, status }}
/>
```

**slim** — compact list item, optionally a link
```tsx
<CardDisplay
  variant="slim"
  card={card}
  showThumb={false}     // show card image thumbnail
  asLink={true}         // wraps in <Link href=/the/{id}>
  badges={{ network, type, fee }}
/>
```

**inline** — inline text span/link
```tsx
<CardDisplay
  variant="inline"
  card={card}
  showLogo={true}       // show network logo vs text label
  asLink={false}        // wraps in <Link>
  badges={{ network }}
/>
```

### Badge config defaults by variant

| badge | tile | row | slim | inline |
|-------|------|-----|------|--------|
| network | ✓ | ✓ | ✓ | ✓ |
| type | ✓ | ✓ | — | — |
| metal | ✓ | — | ✓ (always on) | — |
| status | ✓ | — | ✓ (always on) | — |
| fee | ✓ | — | — | — |

---

## Badge / Display Components

All in `components/shared/badges/`.

| Component | File | Use when |
|-----------|------|----------|
| `NetworkBadge` | `shared/badges/network-badge.tsx` | Show Visa/MC/JCB network on card |
| `CardTypeBadge` | `shared/badges/card-type-badge.tsx` | Single card type label |
| `CardTypeBadges` | `shared/badges/card-type-badge.tsx` | All types on a card (handles Hybrid auto-merge) |
| `BankDisplay` | `shared/badges/bank-display.tsx` | Bank logo + name, optionally linked |
| `ContactlessBadge` | `shared/badges/contactless-badge.tsx` | NFC/contactless payment method pill |
| `MetalBadge` | `shared/badges/metal-badge.tsx` | "Kim loại" gradient badge for metal cards |

### NetworkBadge props
```tsx
<NetworkBadge card={card} size="sm|md" variant="full|slim" />
```
- `full` — bordered pill with logo + text (default)
- `slim` — logo only (or text if no logo)

### BankDisplay props
```tsx
<BankDisplay bank={bank} size="sm|md" asLink={false} showName={true} />
```

### ContactlessBadge props
```tsx
<ContactlessBadge method={method} showName={true} />
```

---

## Page Layout Shells

| Shell | File | Use for |
|-------|------|---------|
| `MarketingPageShell` | `layout/marketing-page-shell.tsx` | Card listing, category, bank pages |
| `BlogPageShell` | `layout/blog-page-shell.tsx` | Blog listing, post pages |
| `ProsePageShell` | `layout/prose-page-shell.tsx` | Legal, about, static content |

All shells include:
- `ow-container` (max-w 1440px, auto margins, px-6)
- `Breadcrumbs`
- `<h1>` title
- Optional `description` + JSON-LD script

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

## Typography Utility Classes

Source: `app/typography.css`. **Never use Tailwind text/font utilities on `<h1>`–`<h6>`.**

| Class | Font | Size | Use for |
|-------|------|------|---------|
| `.text-hero` | Display | clamp(2.5rem → 72px) | Homepage hero |
| `.text-section` | Display | clamp(1.75rem → 56px) | Section headings |
| `.text-display-md` | Display | clamp(1.5rem → 40px) | Feature headings |
| `.text-card-heading` | Display | clamp(1.125rem → 24px) | Card section titles |
| `.text-ui` | Display | clamp(1rem → 18px) | UI labels, nav |
| `.text-body-lg` | Body | 22px | Lead text |
| `.text-body-md` | Body | 18px | Standard body |
| `.text-body` | Body | 16px | Default body |
| `.text-body-sm` | Body | 14px | Secondary text |
| `.text-label` | Body | 12px | Uppercase labels |
| `.text-nav` | Body | 14px | Nav items (uppercase) |
| `.text-link` | — | — | Inline links (red + underline) |

Heading elements `h1`–`h6` have base styles applied automatically.
Use utility classes when visual size doesn't match semantic level.

---

## Tokens (colors, spacing, radius, typography values)

See `.claude/docs/DESIGN.md` — authoritative Figma export. Token values, full `:root` CSS block, UI pattern specs (button, chip, card, glass).

Use as Tailwind classes: `bg-primary`, `text-text-muted`, `border-border`, etc.

---

## Layout Rules (summary)

Full rules: `.claude/docs/layout.md`

- Container: always `ow-container`, never ad-hoc `max-w-*`
- Pattern: `<section bg-*><div ow-container>{content}</div></section>`
- Conditional classes: always `cn()` from `@/lib/utils`
- No inline styles for static values — use Tailwind arbitrary values
- Dynamic runtime values only: `style={{ width: \`${pct}%\` }}`

---

## Component Class Naming

Every component wrapper must have `ow-<filename-kebab-case>` class.

```
post-card.tsx → ow-post-card
card-display.tsx → ow-card-display
```

Prepend to existing `className`. No new wrapper elements.

---

## UI Primitives (`components/ui/`)

Check here before creating anything new.

`accordion`, `badge`, `brand-badge`, `brand-button`, `breadcrumb`, `button`, `chip`,
`collapsible`, `command`, `dashed-badge`, `dialog`, `empty-state`, `form-field`,
`heading`, `input`, `navigation-menu`, `page-container`, `popover`, `select`,
`separator`, `sheet`, `sidebar`, `skeleton`, `stack`, `switch`, `text`, `tooltip`

### `Text` — body copy
```tsx
<Text variant="body|body-sm|body-md|body-lg|label|nav" as="p|span|div|li" />
```

### `Heading` — display headings
```tsx
<Heading as="h1|h2|h3|h4|h5|h6" variant="hero|section|display-md|card-heading|ui" />
// variant is optional — omit to use element's default base style
```

### `Stack` — flex layout
```tsx
<Stack direction="col|row" gap={4} align="start|center|end|stretch" justify="start|between|..." wrap={false} as="div" />
```
Gap values: `1 2 3 4 5 6 8 10 12` (maps to Tailwind `gap-*`).
