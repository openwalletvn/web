# Layout rules

## Container

**Single source of truth:** `.ow-container` (defined in `app/globals.css`)

```
max-width: 1440px
margin-inline: auto
padding-inline: 1.5rem (px-6)
width: 100%
```

### Rules
- **Always use `.ow-container`** for page-width content wrappers. Never use `max-w-container mx-auto px-4`, `container mx-auto`, or any ad-hoc combination.
- Apply on the **inner wrapper** inside a full-bleed section, not on the section itself (so sections can have full-bleed backgrounds).
- Hero and other intentionally full-width sections are exempt.

### Pattern
```tsx
<section className="ow-some-section bg-whatever py-12">
  <div className="ow-container">
    {/* content */}
  </div>
</section>
```

### Do not
- `max-w-container mx-auto px-4` → use `ow-container`
- `container mx-auto` → use `ow-container`
- `max-w-[1440px] mx-auto px-6` → use `ow-container`

## CSS & typography rules
- **Typography source of truth:** `app/typography.css` — all text styles live here (h1–h6 base + utility classes).
- **No hardcoded styles:** Never write hardcoded `font-size`, `font-weight`, `line-height`, `letter-spacing`, `color`, or `text-decoration` values in components or inline styles. Always use an existing class from `app/typography.css`. If no class fits, stop and ask for approval before adding one.
- **Reusable utility classes over inline chains:** Before writing multi-class chains like `text-[#EF3C23] underline hover:opacity-70 transition-opacity`, check `app/typography.css` for an existing utility. If none exists, create one there. Example: inline link styling → `.text-link`. This applies to any recurring visual pattern, not just typography.
- **Do not use `[&_a]:` Tailwind arbitrary variants to compose multi-property styles.** The `[&_a]:` pattern is fine for single Tailwind utilities (e.g. `[&_a]:font-medium`), but multi-property patterns belong in a utility class in `app/typography.css` applied directly to the element.
- **No Tailwind typography overrides on heading elements:** Never put `text-sm`, `text-xs`, `text-lg`, `font-bold`, `font-semibold`, `font-medium`, or any other Tailwind text/font utility directly on `<h1>`–`<h6>` elements. These bypass the design system just as much as hardcoded values. Use the correct typography utility class (`text-section`, `text-display-md`, `text-body`, etc.) or change the element to a `<p>` / `<span>` if the semantic level doesn't match the visual intent.
- **`globals.css` scope:** Variables and tokens only (`@theme`, `:root`, `@layer base` for non-typography resets). Typography belongs in `app/typography.css`.
- **Prefer Tailwind classes over inline styles:** Never use `style={{ ... }}` for values that can be expressed as Tailwind utilities. Use arbitrary values (`w-[48px]`, `top-[calc(100%+8px)]`) before reaching for inline styles. Inline styles only for truly dynamic values that cannot be expressed statically (e.g. `style={{ width: \`${pct}%\` }}` where `pct` is runtime data).
- **`cn()` for conditional classes:** Use `cn()` from `@/lib/utils` for all conditional or merged className expressions. Never use template literals (`className={\`...\`}`).
- **After any CSS/layout change:** Re-read these rules and confirm nothing violates them.
- **Responsive layout:** Every component must be checked for mobile/tablet/desktop breakpoints. Never ship a layout change without verifying responsive behavior.
