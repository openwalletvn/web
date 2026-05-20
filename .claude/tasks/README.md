# .claude/tasks

This folder is managed by [clask](https://github.com/phucbm/clask) — an autonomous Claude Code task runner.

## How it works

Each `.md` file in `todo/` is a task spec. When you run `clask`, Claude reads the specs,
implements them in order, then moves each file to `done/` on success.

## Folder structure

```
.claude/tasks/
  todo/         ← task specs waiting to be implemented
  done/         ← completed task specs (moved here by clask after success)
  README.md     ← this file
```

## Task spec format

Each `.md` file should contain:
- A `# Title` heading
- **Task** section: what to implement
- **Acceptance Criteria** section: checklist Claude verifies before marking done
- **Files Affected** section (optional): which files will change
- **Notes** section (optional): dependencies, order hints, constraints

## For AI assistants reading this

If you see `.md` files in `todo/`, they are pending implementation specs.
Do not modify them unless asked. Do not move them to `done/` manually.
clask handles the lifecycle: read spec → implement → verify → move to done.
