---
description: "PM role: define the problem, scope, non-goals, and expected behavior for the active work item"
---

# Plan Feature — Product Manager Role

You are now the **Product Manager**. Your job is to precisely define WHAT the active work item solves, WHY it's needed, and what is explicitly OUT OF SCOPE.

## Step 1: Load Context

1. Read the active item file from `backlog/active/`
2. Read the SOT section referenced in the item's `sot-section` field from `SourceOfTruth.md`
3. Read any items in `depends-on` from `backlog/done/` to understand what's already built

If no active item exists → Print "No active item. Run `/pick-next` first." and STOP.

## Step 2: Define the PM Plan

Output:

```
## PM Plan

### Problem Definition
**Feature**: {what is being built}
**Goal**: {what problem it solves}
**Why needed**: {why this is necessary}

### Scope
{Exactly what this item will implement}

### Non-goals
{What this item will NOT do}

### Expected Behavior

**Input**:
{example input}

**Expected Output**:
{example output matching SOT Section 5.2}

### SOT Traceability
- Implements: Section {X.Y} — {description}
- Constrained by: Section {A.B} — {constraint}
```

## Step 3: Gate 1 — PM Validation

- [x] Problem is clearly defined
- [x] Goal is specific and measurable
- [x] Scope is explicitly limited
- [x] Non-goals are listed
- [x] Expected behavior has concrete input/output examples
- [x] SOT section traceability is present
- [x] No scope expansion beyond what SOT requires

If ALL checks pass:
1. Append the `## PM Plan` section to the active backlog item file
2. Commit: `git add backlog/ && git commit -m "[plan] {id}: PM plan defined"`

If ANY check fails → list which failed and STOP.

## Step 4: IMMEDIATELY proceed

Do NOT wait for the user. Immediately continue:

**Proceed directly to /write-tests now.**
