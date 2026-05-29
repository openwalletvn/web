# DESIGN TOKENS — Openwallet Homepage

> Extracted from Figma CSS export. Use this as the source of truth for variables, styles, and typography setup.

---

## Colors

### Brand

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#EF3C23` | CTA buttons, accents, badges, highlights |
| `--color-black` | `#000000` | Dark backgrounds, primary text |
| `--color-white` | `#FFFFFF` | Light backgrounds, text on dark |

### Neutrals

| Token | Value | Usage |
|---|---|---|
| `--color-bg-light` | `#F7F7F7` | Page background, card backgrounds |
| `--color-bg-warm` | `#E9E7E8` | Section backgrounds, decorative fills |
| `--color-bg-muted` | `#EDEDED` | Subtle panel backgrounds |
| `--color-bg-green` | `#EDEFEC` | Tag/chip default background |
| `--color-border` | `#E2E2E2` | Card borders |
| `--color-border-dark` | `#DCDCDC` | Input borders, dividers |
| `--color-border-mid` | `#C8C8C8` | Filter tab borders |
| `--color-divider` | `#D9D9D9` | Card dividers |

### Text

| Token | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#000000` | Headings, body text |
| `--color-text-near-black` | `#0E0F0C` | Section headings |
| `--color-text-body-alt` | `#000001` | Article titles (near-black variant) |
| `--color-text-muted` | `#646664` | Labels, captions, secondary text |
| `--color-text-subtle` | `#9A9A9A` | Descriptions on dark backgrounds |
| `--color-text-accent` | `#EF3C23` | Highlighted names, links |

---

## Typography

### Font Families

```css
/* Display / Headings */
font-family: 'Cal Sans', sans-serif;

/* Body / UI */
font-family: 'Inter Tight', sans-serif;
```

### Type Scale

#### Cal Sans (Display)

| Role | Size | Line Height | Letter Spacing | Weight |
|---|---|---|---|---|
| Hero | `72px` | `100%` | `-1.5px` | 400 |
| Section heading | `56px` | `120%` | `-1px` | 400 |
| Sub-heading | `40px` | `100%` | `-1.05517px` | 400 |
| Card heading | `24px` | `130%` | — | 400 |
| UI label / CTA | `18px` | `130%` | — | 400 |
| Small display | `24px` | `100%` | `-1px` | 400 |

#### Inter Tight (Body / UI)

| Role | Size | Line Height | Letter Spacing | Weight |
|---|---|---|---|---|
| Body large | `22px` | `130%` | — | 500 |
| Body medium | `18px` | `130%` | — | 500 |
| Body default | `16px` | `130%` | — | 500 |
| Body small | `14px` | `130%` | — | 500 |
| Label / Caption | `12px` | `130%` | `1px` | 600 |
| Nav label | `14px` | `130%` | `1px` | 600 |

### Heading Tag Scale

| Tag | Max Size | Font | Notes |
|---|---|---|---|
| `h1` | `72px` | Cal Sans | Hero only |
| `h2` | `56px` | Cal Sans | Section headings |
| `h3` | `24px` | Cal Sans | Card/block headings |
| `h4` | `20px` | Cal Sans | Sub-headings |
| `h5` | `18px` | Cal Sans | UI labels |
| `h6` | `16px` | Cal Sans | Small labels |

---

## CSS Variables Setup

Paste this into your `:root` or global CSS file:

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

  /* Typography */
  --font-display: 'Cal Sans', sans-serif;
  --font-body: 'Inter Tight', sans-serif;

  /* Font sizes */
  --text-hero: 72px;
  --text-section: 56px;
  --text-display-md: 40px;
  --text-card-heading: 24px;
  --text-ui: 18px;
  --text-body-lg: 22px;
  --text-body-md: 18px;
  --text-body: 16px;
  --text-body-sm: 14px;
  --text-label: 12px;

  /* Line heights */
  --leading-tight: 100%;
  --leading-snug: 120%;
  --leading-normal: 130%;

  /* Letter spacing */
  --tracking-hero: -1.5px;
  --tracking-section: -1px;
  --tracking-display: -1.05517px;
  --tracking-label: 1px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 11px;
  --space-4: 12px;
  --space-5: 16px;
  --space-6: 20px;
  --space-7: 22px;
  --space-8: 24px;
  --space-9: 28px;
  --space-10: 32px;
  --space-11: 39px;
  --space-12: 48px;
  --space-13: 67px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 32px;
  --radius-2xl: 40px;
  --radius-pill: 48px;
  --radius-full: 96px;
  --radius-circle: 112px;
}
```

---

## Typography CSS Classes

```css
/* Display styles */
.text-hero {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 400;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-hero);
}

.text-section {
  font-family: var(--font-display);
  font-size: var(--text-section);
  font-weight: 400;
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-section);
}

.text-display-md {
  font-family: var(--font-display);
  font-size: var(--text-display-md);
  font-weight: 400;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-display);
}

.text-card-heading {
  font-family: var(--font-display);
  font-size: var(--text-card-heading);
  font-weight: 400;
  line-height: var(--leading-normal);
}

.text-ui {
  font-family: var(--font-display);
  font-size: var(--text-ui);
  font-weight: 400;
  line-height: var(--leading-normal);
}

/* Body styles */
.text-body-lg {
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  font-weight: 500;
  line-height: var(--leading-normal);
}

.text-body-md {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  font-weight: 500;
  line-height: var(--leading-normal);
}

.text-body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 500;
  line-height: var(--leading-normal);
}

.text-body-sm {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  font-weight: 500;
  line-height: var(--leading-normal);
}

.text-label {
  font-family: var(--font-body);
  font-size: var(--text-label);
  font-weight: 600;
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.text-nav {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}
```

---

## Spacing Notes

Gaps used in auto-layout frames follow this pattern:

| Context | Gap |
|---|---|
| Tight (tags, icon rows) | `4px`, `8px` |
| Card inner content | `11px`, `12px` |
| Section stack | `16px`, `24px` |
| Major section gap | `32px`, `39px`, `48px` |
| Hero / loose layout | `67px` |

---

## Border Radius Notes

| Context | Value |
|---|---|
| Small image corners | `4px` |
| Input, card | `8px` |
| Card / panel | `16px` |
| Large panel | `32px`, `40px` |
| CTA button | `48px` |
| Badge / chip | `52px`, `96px` |
| Navbar search | `88px`, `112px` |

---

## Key UI Patterns

**CTA Button (Primary)**
```css
background: #000000;
border-radius: 48px;
padding: 16px 24px;
font-family: 'Cal Sans';
font-size: 18px;
color: #FFFFFF;
```

**CTA Button (Brand Red)**
```css
background: #EF3C23;
border-radius: 96px;
padding: 8px;
```

**Tag / Chip (default)**
```css
background: #EDEFEC;
border: 1px solid #D3D3D3;
border-radius: 52px;
padding: 8px 16px;
font-size: 16px;
font-weight: 500;
```

**Tag / Chip (active)**
```css
background: #EF3C23;
color: #FFFFFF;
```

**Card**
```css
border: 1px solid #E2E2E2;
border-radius: 16px;
background: #FFFFFF;
```

**Glass / Frosted bar**
```css
background: rgba(124, 124, 124, 0.4);
border: 1px solid rgba(236, 236, 236, 0.3);
backdrop-filter: blur(14px);
border-radius: 112px;
```

**FAQ / Accordion item**
```css
background: #FFFFFF;
border: 1px solid #DCDCDC;
border-radius: 8px;
padding: 24px;
```
