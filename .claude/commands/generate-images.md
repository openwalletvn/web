# Generate images for blog posts

You will be given one or more post slugs. For each slug:

## Steps

1. Read `content/posts/<slug>.mdx`
2. Analyze content to decide where images improve understanding or visual appeal
3. For each image placement:
   - Insert `![descriptive alt text](/images/posts/<slug>/<filename>.webp "Short caption")` at the appropriate spot
   - First image goes near the top (after intro paragraph)
   - `alt` = descriptive text for accessibility/SEO (Vietnamese)
   - `title` (in quotes after URL) = short visible caption, under 100 chars
4. Update frontmatter:
   - Set `cover_image: "/images/posts/<slug>/<first-image-filename>.webp"`
   - Add/update `image_prompts` with a Gemini prompt for each image
5. Save the updated MDX file

## Image naming

- Filenames must be SEO-friendly: descriptive, keyword-rich, hyphen-separated, no diacritics
- 3–6 words describing the image subject
- Path: `/images/posts/<slug>/<filename>.webp`

## Image prompt rules

Write prompts in **English** for Gemini image generation.

### Cover image (first image, key = `cover`)
- Must be an **eye-catching illustration**, never a table or diagram
- Show 2–4 concrete objects (cards, coins, buildings, devices)
- Gradient background: `#e0f2fe` -> `#ffffff` or soft teal/slate
- Faint geometric pattern at 8–15% opacity
- Objects with depth: drop shadow, shine, slight tilt

### Object-focused images
- Gradient background: `#dbeafe` -> `#eff6ff` or `#f1f5f9` -> `#e2e8f0`
- Subtle abstract pattern, objects centered

### Infographic images
- Use flow diagrams, icon grids, side-by-side panels, tier layouts
- Avoid tables inside images (use only when data density requires it, non-cover only)

### Bank brand colors
- **Vietcombank** - `#006633` (dark green)
- **BIDV** - `#003087` (dark blue) + red accent
- **VietinBank** - `#c8102e` (red) + navy
- **Techcombank** - `#e30613` (bright red)
- **MB Bank** - `#004f9f` (teal/navy)
- **VPBank** - `#00a650` (green) + orange (issues Amex)
- **Shinhan Bank** - `#003b8e` (blue, also issues Amex)
- **ACB** - `#0066b2` (blue)
- **TPBank** - `#6b21a8` (purple)

### General prompt rules
- Specify visual style: "flat illustration", "minimalist", "isometric"
- **No text in images** unless data-heavy infographic
- Be specific: colors, layout, objects, quantities
- Use real bank brands with actual colors when relevant

## Rules

- Do NOT create folders or download images
- Do NOT add images where content is self-explanatory
- Aim for 2–4 images per post depending on length
- Alt text in Vietnamese, descriptive
- Always include a caption (title) in quotes after the URL

## Output

After processing all posts, print a consolidated checklist:

```
IMAGE CHECKLIST
──────────────────────────────────────────────
[ ] <filename>.webp  <- cover
    Prompt: "<Gemini prompt>"
    Save to: public/images/posts/<slug>/<filename>.webp

[ ] <filename>.webp
    Prompt: "<Gemini prompt>"
    Save to: public/images/posts/<slug>/<filename>.webp
──────────────────────────────────────────────
Total: X images needed across Y posts
```
