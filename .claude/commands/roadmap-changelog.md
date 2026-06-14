# /roadmap — Manage GitHub Projects Roadmap + Changelog

`/roadmap` is the SSOT for both the public roadmap and changelog at `/roadmap`.  
Edit in GitHub Projects UI → ISR revalidates within 60 min.

## Project IDs (do not change)

```
Project number : 1
Owner          : openwalletvn
Project ID     : PVT_kwDOD5xEPM4BamAq
Status field ID: PVTSSF_lADOD5xEPM4BamAqzhVcfVc
Shipped field ID: PVTF_lADOD5xEPM4BamAqzhVcoYs
```

## Status column option IDs

| Column      | ID         |
|-------------|------------|
| Todo        | f75ad846   |
| In Progress | 47fc9ee4   |
| Done        | 98236657   |

## Page sections

| Section | Source |
|---------|--------|
| Kanban (Todo / Planned / Future Ideas) | GH Projects non-Done items |
| Recently Shipped timeline | GH Projects Done items, sorted by Shipped date desc |

## Adding a roadmap item (future work)

```sh
# 1. Create draft item
gh api graphql -f query='
  mutation($projectId: ID!, $title: String!) {
    addProjectV2DraftIssue(input: {projectId: $projectId, title: $title}) {
      projectItem { id }
    }
  }' \
  -f projectId="PVT_kwDOD5xEPM4BamAq" \
  -f title="<title>"

# 2. Move to correct column
gh project item-edit \
  --id <ITEM_ID> \
  --project-id PVT_kwDOD5xEPM4BamAq \
  --field-id PVTSSF_lADOD5xEPM4BamAqzhVcfVc \
  --single-select-option-id <OPTION_ID>
```

## Adding a changelog entry (shipped feature)

1. Create draft item with title in English
2. Set body (markdown bullets, Vietnamese) — this is the changelog body
3. Set Status → Done (option ID: `98236657`)
4. Set Shipped date field via GraphQL:

```sh
gh api graphql -f query='
  mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $projectId itemId: $itemId fieldId: $fieldId value: { date: $date }
    }) { projectV2Item { id } }
  }' \
  -f projectId="PVT_kwDOD5xEPM4BamAq" \
  -f itemId="<ITEM_ID>" \
  -f fieldId="PVTF_lADOD5xEPM4BamAqzhVcoYs" \
  -f date="YYYY-MM-DD"
```

## Changelog body rules

- Vietnamese, professional tone — no marketing words ("đột phá", "tuyệt vời")
- No em dashes in bullet text — dùng dấu phẩy, dấu hai chấm
- Technical terms stay English (API, IndexedDB, MCP, SSR, ISR, WebP...)
- Max 4 bullets per entry
- Numbers must be verified from code, not from memory
- Only add for: card/bank data updates, new features, API changes, infra decisions, technical optimizations with measurable impact
- Do NOT add for: pure UI changes, minor bug fixes, marketing page content, internal config

## Moving item to Done (when work ships)

```sh
# Get item ID
gh project item-list 1 --owner openwalletvn --format json | jq '.items[] | select(.title == "<title>") | .id'

# Move to Done
gh project item-edit \
  --id <ITEM_ID> \
  --project-id PVT_kwDOD5xEPM4BamAq \
  --field-id PVTSSF_lADOD5xEPM4BamAqzhVcfVc \
  --single-select-option-id 98236657

# Set Shipped date (see above)

# Update body with changelog bullets if not already set
gh api graphql -f query='
  mutation($id: ID!, $body: String!) {
    updateProjectV2DraftIssue(input: { draftIssueId: $id, body: $body }) {
      draftIssue { id }
    }
  }' \
  -f id="<DRAFT_ISSUE_ID>" \
  -f body="<markdown bullets>"
```

## List all items with status

```sh
gh project item-list 1 --owner openwalletvn --format json | jq '.items[] | {title: .title, status: .status}'
```

## Notes

- `/roadmap` page ISR revalidates every 60 min. Changes appear within 60 min.
- `GITHUB_TOKEN` env var must have `read:project` scope for the page to fetch data.
- `gh` CLI needs `read:project` scope: `gh auth refresh -s read:project`
- Done item `draftIssueId` ≠ project `itemId` — use GraphQL to get `DraftIssue.id` for body updates.
