You will be given one or more post slugs (filenames without extension). For each slug:

1. Read the corresponding MDX file in `content/posts/<slug>.mdx`
2. Analyze the full content to decide where images would improve understanding or visual appeal
3. For each image placement:
    - Insert `![descriptive alt text](/images/posts/<slug>/<slug>-<n>.jpg)` at the appropriate spot in the MDX content (n starts at 1)
    - The first image (`<slug>-1.jpg`) must be placed near the top of the content (after the intro paragraph)
4. Update the frontmatter with `cover_image: "/images/posts/<slug>/<slug>-1.jpg"`
5. Save the updated MDX file

After processing all given posts, print a consolidated image checklist:

---
📸 IMAGE CHECKLIST
──────────────────────────────────────────────
[ ] <slug>-1.jpg  ← cover
Search: "keyword one" | "keyword two"
URL: https://unsplash.com/s/photos/<keyword-hyphenated>
Save to: public/images/posts/<slug>/<slug>-1.jpg

[ ] <slug>-2.jpg
Search: "keyword one" | "keyword two"
URL: https://unsplash.com/s/photos/<keyword-hyphenated>
Save to: public/images/posts/<slug>/<slug>-2.jpg
──────────────────────────────────────────────
Total: X images needed across Y posts
---

Rules:
- Do NOT create any folders
- Do NOT download any images
- Do NOT add images where content is self-explanatory and doesn't benefit visually
- Keep alt text descriptive and in Vietnamese
- Aim for 2–4 images per post depending on length

Before starting, provide a todo list of what will be changed.
```

---

**2. Prompt to run it in Claude Code:**
```
Read and execute the instructions in `prompts/image-brief.md` for the following posts:
- <slug-1>
- <slug-2>