# Write a blog post

You are writing a blog post for OpenWallet (openwallet.vn), a Vietnamese card comparison site.

## Create the file

Path: `content/posts/<slug>.mdx`
- Slug = lowercase kebab-case, no diacritics, a-z/0-9/hyphens only
- Slug becomes the URL: `/tin-tuc/<slug>`

## Frontmatter

```yaml
---
title: "String - max 80 chars, no clickbait"
description: "120–160 chars. Used as meta description."
date: "YYYY-MM-DD"
category: "One of the 4 categories below"
tags:
  - tag1
  - tag2
status: "draft"
ai_generated: true
card_slugs:
  - card-id-1
cover_image: "/images/posts/<slug>/<cover-filename>.webp"
image_prompts:
  cover: "English prompt for Gemini image generation"
  another-image-key: "English prompt"
---
```

### Required fields

| Field | Rules |
|-------|-------|
| `title` | Max 80 chars. Avoid clickbait. |
| `description` | 120–160 chars for meta. |
| `date` | ISO 8601: `"2026-01-15"` |
| `category` | **Exactly one of:** `"Review the"`, `"Huong dan"`, `"Tin tuc"`, `"So sanh the"` |
| `tags` | 2–8 free-form tags. Bank names, card names, topics. Vietnamese or English. |
| `status` | `"draft"` while writing, `"published"` when ready. |

### Optional fields

| Field | Rules |
|-------|-------|
| `author` | Omit to hide author line. |
| `ai_generated` | `true` = show AI badge. **Always set honestly.** |
| `card_slugs` | Card IDs from `GET https://api.openwallet.vn/api/v1/cards`. Shown as "The lien quan" sidebar. Only include cards directly discussed. |
| `cover_image` | Path to cover image. Convention: `/images/posts/<slug>/<filename>.webp` |
| `updated` | ISO date. Set when making significant edits to a published post. |
| `image_prompts` | Map of image keys to Gemini prompts. See image prompt rules below. |

## Categories

| Value | Use for |
|-------|---------|
| `Review the` | In-depth reviews of a specific card after real use |
| `Huong dan` | How-to guides, tips, tutorials |
| `Tin tuc` | Banking news, new card launches, regulatory updates |
| `So sanh the` | Head-to-head comparisons between cards/networks/strategies |

Do NOT invent new categories.

## Content rules

### Language
- Write in **Vietnamese**
- Technical terms stay English: API, JSON, Visa, Mastercard
- Monetary amounts: `200.000 VND` or `200k`

### Headings
- `##` main sections, `###` subsections, `####` sparingly
- **Never use `#`** - title is already h1
- Auto-TOC is generated from headings
- Heading IDs use Vietnamese slugification: `"Bat dau su dung"` -> `#bat-dau-su-dung`

### Links
- Internal: relative paths `/the/bidv-visa-classic` or `/ngan-hang/bidv`
- External: absolute URLs

### Code blocks
- Fenced with language identifier: ` ```json `, ` ```bash `

### Lists
- Dash `- ` for unordered
- Numbers for step-by-step

## Image prompts

Add `image_prompts` to frontmatter for every post.

### Keys
- `cover` = cover image
- Other keys = filename stems (without extension) of images in content
- Keys must be **SEO-friendly**: descriptive, keyword-rich, hyphen-separated Vietnamese slugs (no diacritics)
- 3–6 words describing the image subject
- **Good:** `so-sanh-cashback-visa-vs-mastercard`, `bieu-phi-thuong-nien-the-tin-dung`
- **Bad:** `image1`, `bang`, `hinh`

### Image paths in content

```
/images/posts/<slug>/<filename>.webp
```

Use `.webp` extension (admin server converts to WebP).

### Gemini prompt guidelines

- Write prompts in **English**
- Specify visual style: "flat illustration", "minimalist", "infographic style", "isometric"
- **No text in the image** (unless data-heavy infographic where labels are essential)
- Be specific: exact colors, layout, objects, quantities, relationships
- **Use real bank brands** with actual colors:
  - **Vietcombank** - dark green `#006633`
  - **BIDV** - dark blue `#003087` with red accent
  - **VietinBank** - red `#c8102e` with navy
  - **Techcombank** - bright red `#e30613`
  - **MB Bank** - teal/navy `#004f9f`
  - **VPBank** - green `#00a650` with orange accent (issues Amex in Vietnam)
  - **Shinhan Bank** - blue `#003b8e` (also issues Amex)
  - **Agribank** - dark green `#007a3d`
  - **ACB** - blue `#0066b2`
  - **TPBank** - purple/violet `#6b21a8`

### Cover image rules
- Must be an **eye-catching illustration**, never a table or diagram
- Show 2–4 concrete objects (cards, coins, buildings, devices)
- **Gradient background**: light blue to white (`#e0f2fe` -> `#ffffff`) or soft teal/slate
- **Faint geometric pattern** at 8–15% opacity (hexagons, dot grid, diagonal lines)
- Objects with depth: drop shadow, subtle shine, slight tilt

### Non-cover object images
- Slightly gradient background: `#dbeafe` -> `#eff6ff` or `#f1f5f9` -> `#e2e8f0`
- Subtle abstract pattern at low opacity
- Objects centered with breathing room

### Infographic images
- Avoid tables inside images (boring)
- Use: flow diagrams, icon+label grids, side-by-side panels, tier/podium layouts
- Tables allowed only when data density requires it, and only for non-cover images

## Card slugs lookup

```bash
# All cards
curl https://api.openwallet.vn/api/v1/cards

# Filter by bank
curl "https://api.openwallet.vn/api/v1/cards?bank_id=bidv"

# Filter by type
curl "https://api.openwallet.vn/api/v1/cards?type=credit"
```

Use the `id` field from the response.

## Post validation

After writing, run:
```bash
pnpm validate:posts
```

## Example structure

```mdx
---
title: "Shopee Card vs VIB Online Plus: Mua sam online chon the nao?"
description: "So sanh chi tiet Shopee Card va VIB Online Plus ve cashback, dieu kien va phi."
date: "2026-02-10"
category: "So sanh the"
tags:
  - Shopee Card
  - VIB Online Plus
  - hoan tien
  - mua sam online
  - the tin dung
card_slugs:
  - shopee-card
  - vib-online-plus-2
status: "published"
ai_generated: true
image_prompts:
  cover: "Flat minimalist illustration of two credit cards side by side..."
---

## Tong quan

...

## So sanh cashback

### Shopee Card

...

### VIB Online Plus

...

## Ket luan
```
