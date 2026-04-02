---
description: "Release Manager: version bump, changelog, git tag, PR, merge to main, move item to done"
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

## Step 7: Push branch and create Pull Request

```
git push origin {current-branch}
```

Then create a PR using gh:

```
gh pr create \
  --title "[{id}] {item-title} (v{new-version})" \
  --body "## Summary
- Implements [{id}] {item-title}
- SOT Section: {sot-section}
- Version bump: {old-version} → {new-version}

## Changes
- {list key files added/changed}

## Quality Gates
- PM Validation: PASS
- QA Validation: PASS
- Dev Validation: PASS
- Test Coverage: PASS (all tests pass)

## Test Results
{paste npx vitest --run summary line}

🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
  --base main \
  --head {current-branch}
```

## Step 8: Merge PR to main

```
gh pr merge --merge --delete-branch
```

Wait for merge to complete, then:
```
git checkout main
git pull origin main
```

## Step 9: Close the Backlog Item

1. Move file: `backlog/active/{file}` → `backlog/done/{file}`
2. Update frontmatter `status: "done"`
3. Update `BACKLOG.md` status to `done`
4. Commit + push: `git add backlog/ BACKLOG.md && git commit -m "[chore] close item {id}: moved to done" && git push origin main`

## Step 10: IMMEDIATELY proceed to next item

Do NOT wait for the user. Immediately continue:

**Proceed directly to /pick-next now.**

Keep going until all backlog items are `done` or there are no more eligible items.
