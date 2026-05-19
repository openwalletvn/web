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
- **No hardcoded styles:** Never write hardcoded `font-size`, `font-weight`, `line-height`, `letter-spacing` values in components or inline styles. Always use an existing class from `app/typography.css`. If no class fits, stop and ask for approval before adding one.
- **`globals.css` scope:** Variables and tokens only (`@theme`, `:root`, `@layer base` for non-typography resets). Typography belongs in `app/typography.css`.
- **After any CSS/layout change:** Re-read these rules and confirm nothing violates them.
- **Responsive layout:** Every component must be checked for mobile/tablet/desktop breakpoints. Never ship a layout change without verifying responsive behavior.
