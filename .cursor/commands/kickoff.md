---
description: "One-time bootstrap: decompose SourceOfTruth.md into actionable backlog items and initialize project tracking"
---

# Kickoff — Bootstrap Project from Source of Truth

You are the **Project Bootstrapper**. Your job is to read the SourceOfTruth.md and decompose it into small, actionable, independent work items.

## Step 1: Read the Source of Truth

Read `SourceOfTruth.md` completely. Identify every deliverable:

- **System contracts** (Section 5): Input types (e.g., `ComponentNode`), output types (e.g., metrics result with status/issues)
- **Detection rules** (Sections 6, 7): Each rule or anomaly detection pattern that needs to be implemented
- **Engine infrastructure** (Sections 1-4): Core engine setup, rule registration, component tree traversal
- **Performance requirements** (Section 11): Caching, O(n) traversal
- **Quality infrastructure**: Test framework setup, CI configuration

## Step 2: Decompose into Work Items

Break deliverables into the **smallest possible** independent items. Each item should:
- Implement ONE concept (one type, one rule, one utility)
- Be testable on its own
- Be releasable on its own
- Touch 3-5 files maximum

### Priority Ordering (1 = highest)

1. **Priority 1 — Foundation**: Type definitions, project config, core engine skeleton
2. **Priority 2 — Core Infrastructure**: Tree traversal, rule registry, validation pipeline
3. **Priority 3 — Validation Rules**: Individual rules (text overflow, etc.)
4. **Priority 4 — Performance**: Caching, memoization
5. **Priority 5 — Polish**: Error messages, edge case handling improvements

### Dependency Ordering

- Types must come before engine
- Engine skeleton must come before rules
- Rules must come before performance optimization

## Step 3: Create Backlog Items

For EACH work item, create a file in `backlog/ready/` named `{id}-{short-name}.md`:

```markdown
---
id: "{NNN}"
title: "{Short descriptive title}"
type: "feature|infra|rule|perf"
priority: 1-5
status: "ready"
created: "{today's date YYYY-MM-DD}"
sot-section: "Section X.Y"
depends-on: []
---

# {title}

> SOT Reference: Section X.Y — {quoted relevant requirement from SOT}

## PM Plan
(to be filled by /plan-feature)

## QA Test Plan
(to be filled by /write-tests)

## Implementation Plan
(to be filled by /implement)

## Validation Report
(to be filled by /validate)
```

Use IDs starting from 001 and incrementing: `001`, `002`, `003`, etc.

## Step 4: Create/Update BACKLOG.md

Update the `BACKLOG.md` index file at the project root with a table of all items:

```markdown
| ID | Title | Type | Priority | Status | SOT Section | Depends On |
|----|-------|------|----------|--------|-------------|------------|
| 001 | ... | ... | ... | ready | ... | — |
```

## Step 5: Initialize Tracking Files

Only if they don't already exist:
- `VERSION` → write `0.0.0`
- `CHANGELOG.md` → initialize with Keep-a-Changelog header

## Step 6: Verify and Report

Run `/status` to display what was created. Print a summary:
- Total items created
- Breakdown by type and priority
- Suggested first item to work on (highest priority, no dependencies)
