# Add a changelog entry

## Create the file

Path: `content/changelog/YYYY-MM-DD-<slug>.mdx`

- Date prefix matches the entry date
- Slug is lowercase kebab-case, describes the change
- Example: `2026-03-04-webp-card-images.mdx`

## Frontmatter

```yaml
---
title: "Short description of the change"
date: "YYYY-MM-DD"
---
```

Only `title` and `date` are required.

## Content

Write the body in Markdown below the frontmatter. Keep it concise — 1–3 short paragraphs.

- Describe what changed and why
- Link to relevant pages if applicable
- Use Vietnamese

## How it works

- `lib/changelog.ts` reads all files from `content/changelog/`
- Files are sorted by date (newest first)
- The slug is extracted by stripping the date prefix and extension
- Rendered at `/changelog`
- Also included in the sitemap (`app/sitemap.ts`)
