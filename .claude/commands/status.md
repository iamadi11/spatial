---
description: "Dashboard: show project health, backlog state, and test results"
---

# Status — Project Health Dashboard

You are the **Dashboard**. Your job is to give a complete snapshot of project state at any time.

## Step 1: Read Project State

Read the following in parallel:
- `VERSION` — current version
- `BACKLOG.md` — full item index
- `backlog/ready/` — items waiting to be picked
- `backlog/active/` — currently in-progress item (should be 0 or 1)
- `backlog/done/` — completed items
- `CHANGELOG.md` — last entry for most recent release info

## Step 2: Run Tests

Run: `npx vitest --run 2>&1 | tail -20`

Capture: total tests, passed, failed, skipped.

If no test files exist yet, note "No tests written yet."

## Step 3: SOT Compliance Spot Check

Run:
```
grep -rn "document\.\|window\.\|Math\.random\|: any" src/ 2>/dev/null | wc -l
```

Report: `{N} potential SOT violations` (0 = clean).

## Step 4: Output Dashboard

Print the full status report:

```
╔══════════════════════════════════════════════╗
║         PROJECT STATUS DASHBOARD             ║
╚══════════════════════════════════════════════╝

Version: {version}
Date:    {today's date YYYY-MM-DD}

── BACKLOG ──────────────────────────────────────
Ready:   {N} items
Active:  {0 or 1} item(s)  [{id}: {title} if active}]
Done:    {N} items

── ACTIVE ITEM ──────────────────────────────────
{If active item exists:}
  ID:      {id}
  Title:   {title}
  Stage:   {which sections are filled: PM Plan ✓/✗ | QA Plan ✓/✗ | Impl Plan ✓/✗ | Validation ✓/✗}
  Branch:  {current git branch}
{If no active item:}
  None. Run /pick-next to start.

── TESTS ────────────────────────────────────────
Total:   {N}
Passed:  {N}
Failed:  {N}
Skipped: {N}
Status:  {CLEAN / FAILING}

── SOT COMPLIANCE ───────────────────────────────
Violations: {N} potential issues
Status: {CLEAN / NEEDS REVIEW}

── NEXT ACTIONS ─────────────────────────────────
{If no active item and backlog has ready items:}
  → Run /pick-next to start on [{id}] {title} (priority {P})
{If active item in progress:}
  → Continue with /{next-command} on [{id}] {title}
{If tests failing:}
  → Run /detect-bugs to investigate failures
{If backlog is empty:}
  → Run /brainstorm to propose new work, or project is complete!
```

## Step 5: Backlog Table

Print the full backlog table (copy from BACKLOG.md), highlighting:
- `active` items in bold
- `done` items with a checkmark prefix
