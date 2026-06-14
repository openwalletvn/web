# /roadmap — Manage GitHub Projects Roadmap

Manage the OpenWallet roadmap at https://github.com/orgs/openwalletvn/projects/1 via `gh` CLI.

## Project IDs (do not change)

```
Project number : 1
Owner          : openwalletvn
Project ID     : PVT_kwDOD5xEPM4BamAq
Status field ID: PVTSSF_lADOD5xEPM4BamAqzhVcfVc
```

## Status column option IDs

| Column      | ID         |
|-------------|------------|
| Todo        | f75ad846   |
| In Progress | 47fc9ee4   |
| Done        | 98236657   |

## Common operations

### List all items with status
```sh
gh project item-list 1 --owner openwalletvn --format json | jq '.items[] | {title: .title, status: .status}'
```

### Create an issue and add to project
```sh
# 1. Create issue
gh issue create --repo openwalletvn/web --title "Feature: <title>" --body "<description>"

# 2. Add to project (use the issue URL from step 1)
gh project item-add 1 --owner openwalletvn --url <issue-url>
```

### Move item to a different column
```sh
# Get item ID first
gh project item-list 1 --owner openwalletvn --format json | jq '.items[] | select(.title == "<title>") | .id'

# Move to column (replace ITEM_ID and OPTION_ID)
gh project item-edit \
  --id <ITEM_ID> \
  --project-id PVT_kwDOD5xEPM4BamAq \
  --field-id PVTSSF_lADOD5xEPM4BamAqzhVcfVc \
  --single-select-option-id <OPTION_ID>
```

### Add a draft item (no issue needed)
```sh
gh project item-add 1 --owner openwalletvn --title "<title>"
```

### Archive/delete an item
```sh
gh project item-delete 1 --owner openwalletvn --id <ITEM_ID>
```

## Workflow for "add roadmap item" requests

1. Ask user: title, description (optional), which column (Todo/In Progress/Done)
2. If it maps to real work: create issue first, then add to project
3. If it's just a placeholder: add as draft item
4. Move to correct column
5. Confirm with: `gh project item-list 1 --owner openwalletvn --format json`

## Notes

- `/roadmap` page at openwallet.vn revalidates every hour (ISR). Changes appear within 60 min.
- `GITHUB_TOKEN` env var must have `read:project` scope for the page to fetch data.
- `gh` CLI needs `read:project` scope: `gh auth refresh -s read:project`
