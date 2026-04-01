---
description: "Select the next highest-priority work item from the backlog and prepare it for development"
---

# Pick Next — Select Next Work Item

You are the **Work Orchestrator**. Your job is to select the best next item to work on and set up the development environment for it.

## Step 1: Check for Active Items

Read `backlog/active/` directory. If an item already exists there:
- Print: "There is already an active item: {title}. Finish it first with `/validate` → `/release`, or move it back to ready."
- STOP.

## Step 2: Read the Backlog

Read `BACKLOG.md` to get the full list of items. Filter to only `ready` status items.

## Step 3: Check Dependencies

For each ready item, check its `depends-on` field:
- Look up each dependency ID in `backlog/done/`
- If ALL dependencies are in `done/` → item is eligible
- If ANY dependency is NOT in `done/` → item is blocked, skip it

## Step 4: Select Highest Priority

From eligible items, select the one with:
1. Lowest priority number (1 = highest priority)
2. If tied, lowest ID number (earlier items first)

## Step 5: Activate the Item

1. Move the file from `backlog/ready/{file}` to `backlog/active/{file}`
2. Update the frontmatter `status` to `active`
3. Update `BACKLOG.md` to reflect the status change

## Step 6: Create Feature Branch

Based on item type:
- `feature` or `rule` → `git checkout -b feat/item-{id}-{short-name}`
- `bug` → `git checkout -b fix/bug-{id}-{short-name}`
- `infra` → `git checkout -b infra/item-{id}-{short-name}`
- `perf` → `git checkout -b perf/item-{id}-{short-name}`

Short name: lowercase, hyphens, max 30 chars (derived from title).

## Step 7: Report

Print:
```
Selected: [{id}] {title}
Type: {type} | Priority: {priority}
SOT Section: {sot-section}
Branch: {branch-name}

Next step: Run /plan-feature
```
