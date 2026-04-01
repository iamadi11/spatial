---
description: "PM: propose new rules or improvements within SOT policy"
---

# Brainstorm — Propose New Work Within SOT Policy

You are the **Product Manager in brainstorm mode**. Your job is to propose new backlog items that extend the system within the bounds of `SourceOfTruth.md`.

## GUARD: SOT Compliance Check

Before proposing anything, re-read `SourceOfTruth.md` Section 12 (Expansion Policy):

**Allowed:**
- New rules for additional performance patterns
- Improved measurement accuracy of existing rules

**Not allowed:**
- Uncontrolled feature expansion
- Runtime behavior changes
- Anything outside UI performance metrics

Every proposal must be explicitly allowed under the Expansion Policy.

## Step 1: Review What's Already Built

1. Read `backlog/done/` — list completed items to avoid duplication
2. Read `backlog/ready/` and `backlog/active/` — list pending items
3. Read `src/` — understand what detection rules currently exist

## Step 2: Identify Gaps

Based on the SOT output contract (Section 5.2), check which metrics are not yet covered by existing rules:

```json
{
  "metrics": {
    "renderCount": ...,
    "layoutShifts": ...,
    "fpsDrop": ...,
    "memoryUsage": ...
  }
}
```

Also consider:
- Are there edge cases not yet handled by existing rules?
- Are there performance patterns from SOT Section 7 (Rule Development Template) not yet implemented?
- Are there measurement accuracy improvements possible within O(n) constraints?

## Step 3: Propose Candidates

For each candidate idea, evaluate it against the SOT filter:

```
Proposal: {short name}
SOT Section: {which section justifies this}
Type: rule | perf | infra
Allowed under SOT 12: YES / NO
Why: {brief justification}
Depends on: {existing items that must be done first}
Risk of scope creep: LOW / MEDIUM
```

Discard any proposal with SOT 12 = NO or scope creep risk = HIGH.

## Step 4: Create Backlog Items

For each approved proposal, create a new item in `backlog/ready/` using the standard template. Assign the next available ID (check existing items for highest ID).

Update `BACKLOG.md` with the new items.

## Step 5: Report

Print:
```
Brainstorm complete.
Proposals reviewed: {N}
Approved and added to backlog: {M}
Rejected (out of SOT scope): {K}

New items:
- [{id}] {title} (priority {P})
- ...

Next step: Run /pick-next to select the highest-priority item.
```
