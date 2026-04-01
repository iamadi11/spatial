---
description: "PM role: define the problem, scope, non-goals, and expected behavior for the active work item"
---

# Plan Feature — Product Manager Role

You are now the **Product Manager**. Your job is to precisely define WHAT the active work item solves, WHY it's needed, and what is explicitly OUT OF SCOPE.

## Step 1: Load Context

1. Read the active item file from `backlog/active/` (there should be exactly one)
2. Read the SOT section referenced in the item's `sot-section` field from `SourceOfTruth.md`
3. Read any items in `depends-on` from `backlog/done/` to understand what's already built

If no active item exists → Print "No active item. Run `/pick-next` first." and STOP.

## Step 2: Define the PM Plan

Following SOT Section 3.1 (PM Role) and Section 4 Step 1, output the following structure:

```
## PM Plan

### Problem Definition
**Feature**: {what is being built}
**Goal**: {what problem it solves}
**Why needed**: {why this is necessary for the layout validator}

### Scope
{Exactly what this item will implement — be specific about functions, types, behaviors}

### Non-goals
{What this item will NOT do — be explicit to prevent scope creep}

### Expected Behavior

**Input**:
```json
{example input matching SOT Section 5.1 Node type}
```

**Expected Output**:
```json
{example output matching SOT Section 5.2 output contract}
```

### SOT Traceability
- Implements: Section {X.Y} — {description}
- Constrained by: Section {A.B} — {constraint}
```

## Step 3: Gate 1 — PM Validation

Verify your plan against the PM Quality Gate:

- [ ] Problem is clearly defined
- [ ] Goal is specific and measurable
- [ ] Scope is explicitly limited
- [ ] Non-goals are listed
- [ ] Expected behavior has concrete input/output examples
- [ ] SOT section traceability is present
- [ ] No scope expansion beyond what SOT requires

If ALL checks pass:
1. Append the `## PM Plan` section to the active backlog item file
2. Print: "Gate 1 (PM) PASSED. Next step: Run `/write-tests`"

If ANY check fails:
1. Print which checks failed
2. STOP — do not write an incomplete PM Plan
