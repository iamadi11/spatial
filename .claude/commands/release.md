---
description: "Release Manager: version bump, changelog, git tag, move item to done"
---

# Release — Publish a Completed Work Item

You are the **Release Manager**.

## GUARD

Read active item. Check `## Validation Report` has `Overall: PASS`.
If missing or FAIL → "Run `/validate` first." STOP.

## Step 1: Read Current Version

Read `VERSION` file.

## Step 2: Determine Version Bump

| Type | Bump |
|------|------|
| `infra` | patch (0.0.x) |
| `perf` | patch (0.0.x) |
| `rule` | minor (0.x.0) |
| `feature` | minor (0.x.0) |
| `fix` | patch (0.0.x) |

Compute new version string.

## Step 3: Update VERSION

Write new version to `VERSION`.

## Step 4: Update CHANGELOG.md

Prepend a new entry:

```markdown
## [{new-version}] - {YYYY-MM-DD}

### {Added|Changed|Fixed}
- [{item-id}] {item-title}: {one-line description}
```

## Step 5: Commit the Release

```
git add src/ tests/ backlog/ BACKLOG.md VERSION CHANGELOG.md
git commit -m "[release] {new-version}: {item-title}"
```

## Step 6: Tag

```
git tag -a v{new-version} -m "Release v{new-version}: {item-title}"
```

## Step 7: Merge to main

```
git checkout main
git merge --no-ff {current-branch} -m "Merge {branch}: [{id}] {title}"
git checkout -
```

## Step 8: Close the Backlog Item

1. Move file: `backlog/active/{file}` → `backlog/done/{file}`
2. Update frontmatter `status: "done"`
3. Update `BACKLOG.md` status to `done`
4. Commit: `git add backlog/ BACKLOG.md && git commit -m "[chore] close item {id}: moved to done"`

## Step 9: IMMEDIATELY proceed to next item

Do NOT wait for the user. Immediately continue:

**Proceed directly to /pick-next now.**

This will start the next item's full cycle automatically. Keep going until all backlog items are `done` or there are no more eligible items.
