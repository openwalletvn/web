# Commit All

Stage and commit all unstaged/untracked changes in logical groups, each with a conventional commit message.

## Steps

### 1. Inspect current state

Run:
```
git status
git diff
```

List every modified, deleted, and untracked file. Do NOT stage anything yet.

### 2. Group files logically

Analyze the files and group them by **semantic intent** - what changed together for the same reason. Each group becomes one commit.

Grouping heuristics (in priority order):
- Same feature/component → one commit
- Same layer (e.g. all stories, all styles, all config) → one commit if no stronger semantic tie
- Unrelated files → separate commits even if small
- Deleted files that are part of a rename/move → same commit as the new file

### 3. Order groups

Order commits so each builds on the previous. General order:
1. Config / tooling changes
2. Core lib / utility changes
3. Component additions or refactors
4. Story files (always after their component)
5. Page / route changes
6. Docs / content changes

### 4. Commit each group

For each group, in order:

1. `git add <specific files>` - never `git add .` or `git add -A`
2. Craft commit message:
   - Subject: `<type>(<scope>): <what changed>` - ≤50 chars, imperative, lowercase after colon
   - Body: only when the **why** is non-obvious. One short line max.
   - Types: `feat` `fix` `refactor` `style` `chore` `docs` `test` `perf` `build` `ci`
   - Scope: filename stem, component name, or area (e.g. `ow-logo`, `storybook`, `header`)
3. `git commit -m "..."` using heredoc for multi-line

### 5. Report

After all commits, output a table:

| # | Commit message | Files |
|---|---------------|-------|
| 1 | `feat(ow-logo): add size prop` | `ow-logo.tsx`, `ow-logo.stories.tsx` |

## Rules

- Never use `git add .` or `git add -A` - add files explicitly by name
- Never skip `--no-verify` unless user explicitly asks
- Never commit files that look like secrets (`.env`, credentials)
- If a file's intent is ambiguous, ask before grouping
- Story files (`.stories.tsx`) always go in the same commit as their component unless the component has no changes
- If only stories changed (component untouched), commit stories alone: `docs(ow-foo): add storybook story`
