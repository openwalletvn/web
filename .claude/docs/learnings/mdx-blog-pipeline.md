# MDX Blog Pipeline

## What Is MDX?

MDX = Markdown + JSX. You write blog posts in Markdown (easy, readable), but you can also embed React components inside them. This project uses it for the blog (`tin-tuc/`) and changelog.

## File Structure

```
content/
├── posts/          ← blog posts, one file per post
│   └── <slug>.mdx
└── changelog/      ← changelog entries
    └── YYYY-MM-DD-<slug>.mdx
```

## Frontmatter

Each `.mdx` file starts with YAML frontmatter (metadata between `---` lines):

```mdx
---
title: "So sánh VIB vs TPBank"
description: "Phân tích chi tiết..."
date: "2026-03-01"
category: "So sanh the"
tags: ["vib", "tpbank"]
status: "published"
---

# Your content here
```

Required fields: `title`, `description`, `date`, `category`, `tags`, `status`

## Categories (Exactly 4)

- `Review the`
- `Huong dan`
- `Tin tuc`
- `So sanh the`

Never add new categories without updating the filter UI.

## How Posts Are Read

`lib/mdx.ts` handles all post parsing:
- `getAllPosts()` - reads all MDX files, parses frontmatter, returns sorted list
- `getPostBySlug(slug)` - reads a single post, compiles MDX to renderable content
- TOC is auto-generated from `##`, `###`, `####` headings (never use `#`)

## Images

Post images live at `/public/images/posts/<slug>/<filename>.webp`. The `/generate-images` slash command helps create them with Gemini.

## Validation

`pnpm validate:posts` checks all posts have valid frontmatter. Always run before publishing.
