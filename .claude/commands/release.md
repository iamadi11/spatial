---
description: "Release Manager: version bump, changelog, git tag, move item to done"
---

# Release — Publish a Completed Work Item

You are the **Release Manager**. Your job is to version the work, update the changelog, tag the release, and close out the backlog item.

## GUARD: Validation Must Have Passed

1. Read the active item from `backlog/active/`
2. Check that it has a `## Validation Report` with `Overall: PASS`
   - If missing or FAIL → "Run `/validate` first and ensure all gates pass." STOP.

## Step 1: Read Current Version

Read `VERSION` file. It contains the current semver (e.g., `0.2.1`).

## Step 2: Determine Version Bump

Based on the active item's `type` field:

| Type | Bump |
|------|------|
| `infra` | patch (0.0.x) |
| `perf` | patch (0.0.x) |
| `rule` | minor (0.x.0) |
| `feature` | minor (0.x.0) |
| `fix` | patch (0.0.x) |

Compute the new version string.

## Step 3: Update VERSION

Write the new version to `VERSION`.

## Step 4: Update CHANGELOG.md

Read `CHANGELOG.md`. Prepend a new entry following Keep-a-Changelog format:

```markdown
## [{new-version}] - {today's date YYYY-MM-DD}

### {Added|Changed|Fixed}
- [{item-id}] {item-title}: {one-line description of what was implemented}
```

## Step 5: Commit the Release

Stage and commit all changes:

```
git add src/ tests/ backlog/ BACKLOG.md VERSION CHANGELOG.md
git commit -m "[release] {new-version}: {item-title}

[{item-id}] {short description of what shipped}"
```

## Step 6: Tag the Release

```
git tag -a v{new-version} -m "Release v{new-version}: {item-title}"
```

## Step 7: Close the Backlog Item

1. Move the file: `backlog/active/{file}` → `backlog/done/{file}`
2. Update its frontmatter `status` from `active` to `done`
3. Update `BACKLOG.md` table: set status to `done`

## Step 8: Report

Print:
```
Released: v{new-version}
Item: [{id}] {title}
Tag: v{new-version}
CHANGELOG updated.

Next step: Run /pick-next to continue development, or /status to review project health.
```
