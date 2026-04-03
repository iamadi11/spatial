---
description: "PM: propose new work for both the spatial engine and the dashboard within their SOT policies"
---

# Brainstorm — Propose New Work for Spatial Engine + Dashboard

You are the **Product Manager in brainstorm mode**. Your job is to propose new backlog items for **both** projects:

1. **Spatial engine** (`/`) — governed by `SourceOfTruth.md`
2. **Dashboard** (`dashboard/`) — governed by `dashboard/SourceOfTruth.md`

Each project has its own SOT, its own backlog, and its own expansion policy. Treat them independently.

---

## GUARD: Read Both SOTs First

Before proposing anything, read:
- `SourceOfTruth.md` Section 12 — engine expansion policy
- `dashboard/SourceOfTruth.md` Section 7 — dashboard expansion policy

**Engine SOT 12 allows:**
- New rules for additional performance patterns
- Improved measurement accuracy of existing rules

**Dashboard SOT 7 allows:**
- New views/pages that display engine output
- UI improvements to existing pages
- Additional display formats for `PerformanceResult`
- Live analysis features consuming the `window.__SPATIAL__` bridge

Anything not explicitly allowed is rejected.

---

## Step 1: Review What's Already Built

**Engine:**
1. Read `backlog/done/` — completed engine items
2. Read `backlog/ready/` and `backlog/active/` — pending engine items
3. Read `src/rules/` — understand existing detection rules

**Dashboard:**
1. Read `dashboard/backlog/done/` — completed dashboard items
2. Read `dashboard/backlog/ready/` and `dashboard/backlog/active/` — pending dashboard items
3. Read `dashboard/src/` — understand existing pages and components

---

## Step 2: Identify Gaps

**Engine gaps to look for:**
- Performance patterns from SOT Section 7 not yet covered by rules
- Edge cases in existing rules that could be improved
- Measurement accuracy improvements within O(n) constraints

**Dashboard gaps to look for:**
- Pages described in `dashboard/SourceOfTruth.md` Section 3 not yet built
- Incomplete features on existing pages
- UI improvements that aid developer workflow
- Missing display modes for `PerformanceResult` data

---

## Step 3: Evaluate Each Candidate

For every proposed item, fill out this card:

```
Proposal: {short name}
Project: engine | dashboard
SOT Section: {which section justifies this}
Type: rule | perf | infra | feature
Allowed under SOT expansion policy: YES / NO
Why: {brief justification}
Depends on: {IDs of items that must be done first}
Risk of scope creep: LOW / MEDIUM / HIGH
```

Discard any proposal where:
- Allowed = NO
- Scope creep = HIGH
- It duplicates an existing done/ready item

---

## Step 4: Create Backlog Items

**For engine items:**
- Create file in `backlog/ready/{id}-{slug}.md`
- Assign the next available engine ID (check highest existing ID across done/ready/active)
- Update `BACKLOG.md`

**For dashboard items:**
- Create file in `dashboard/backlog/ready/D{id}-{slug}.md`
- Assign the next available dashboard ID (check highest D-prefixed ID)
- Update `dashboard/BACKLOG.md`

Use the standard backlog item template:

```markdown
---
id: "{id}"
title: "{title}"
type: {rule|perf|infra|feature}
priority: {1-5}
status: ready
created: {today}
sot-section: "{relevant SOT section}"
depends-on: "{ids or —}"
---

## PM Plan

**Problem**: {what is missing and why it matters}

**Goal**: {what this item will add}

**Scope**:
- {bullet points of what is in scope}

**Non-goals**: {what is explicitly out of scope}

**Done when**: {concrete, testable completion criterion}
```

---

## Step 5: Report

Print:

```
Brainstorm complete.

ENGINE proposals reviewed: {N}  |  approved: {M}  |  rejected: {K}
DASHBOARD proposals reviewed: {N}  |  approved: {M}  |  rejected: {K}

New engine items:
- [{id}] {title} (priority {P})

New dashboard items:
- [D{id}] {title} (priority {P})

Next step: Run /dev to build the next eligible item.
```
