# Add a changelog entry

## File

Single file: `content/changelog.mdx`

Entries are appended at the **top** (newest first), below the `# Changelog` heading.

## Format

```mdx
## YYYY-MM-DD | Tiêu đề ngắn gọn, rõ ràng

- Bullet mô tả WHAT và WHY, không chỉ liệt kê tính năng
- Technical terms giữ tiếng Anh (API, IndexedDB, MCP, SSR, ISR, WebP...)
- Tối đa 4 bullets mỗi entry
```

## Rules

- Vietnamese, professional tone — no marketing words ("đột phá", "tuyệt vời")
- No em dashes in bullet text — dùng dấu phẩy, dấu hai chấm
- Numbers must be verified from code, not from memory (card count, bank count, etc.)
- Only add entries for: card/bank data updates, new features, API changes, infra decisions, technical optimizations with clear impact
- Do NOT add entries for: pure UI changes (color/spacing), minor bug fixes, marketing page content, internal config

## When to add

After completing:
- Card or bank data changes (even small, if paired with pipeline improvement)
- New feature launch
- Significant API change (new endpoint, new filter)
- Infrastructure decision (hosting, framework, test suite)
- Technical optimization with measurable impact (WebP, cache, ISR)

## Full guidelines

See `.claude/docs/changelog.md` for tone examples, good vs bad entries, and edge cases.
