---
id: D05
title: "Result detail view (status badge + metrics table + issue cards)"
type: feature
priority: 3
status: done
depends-on: D04
---

## PM Plan

**Problem**: The playground shows a raw result. A structured detail view makes the output easier to read — especially when there are multiple issues across different nodes.

**Goal**: Build a `ResultDetailView` component that renders a `PerformanceResult` as:
1. **Status banner** — PASS (green) / FAIL (red) / UNKNOWN (grey) with reason if present
2. **Metrics table** — 4 rows: renderCount, layoutShifts, fpsDrop, memoryUsage with their values
3. **Issue list** — one `IssueCard` per issue, showing: severity badge, rule name, message, affected node ID

**Scope**: `src/components/ResultDetailView.tsx` + `src/components/IssueCard.tsx`.

**Non-goals**: No sorting/filtering of issues. No drill-down into node trees. No export.

**Issue card anatomy**:
```
┌─────────────────────────────────────────┐
│ ⚠ warning          render-count         │
│ Component re-renders 8 times            │
│ Node: root                              │
└─────────────────────────────────────────┘
```

**Done when**: A PASS, FAIL, and UNKNOWN result each render correctly with all fields visible.

## QA Test Plan

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | IssueCard with warning issue | Shows rule name |
| 2 | Happy | IssueCard with warning issue | Shows message text |
| 3 | Edge | IssueCard with warning issue | Shows nodeId |
| 4 | Edge | IssueCard with error issue | Shows "error" badge |
| 5 | Failure | IssueCard with warning issue | Shows "warning" badge |
| 6 | Happy | ResultDetailView PASS | Shows "pass" status |
| 7 | Happy | ResultDetailView FAIL | Shows both issue rule names |
| 8 | Edge | ResultDetailView FAIL | Shows all 4 metric labels |
| 9 | Edge | ResultDetailView FAIL | Shows metric value (8) |
| 10 | Failure | ResultDetailView PASS | Shows no issue rule names |
| 11 | Unknown | ResultDetailView UNKNOWN | Shows "unknown" + reason text |

Test file: `tests/unit/result-detail.test.tsx` — 11 tests, all passing.

## Implementation Plan

- `src/components/IssueCard.tsx`: severity badge (warning=yellow/error=red), rule name, message, nodeId
- `src/components/ResultDetailView.tsx`: status banner (green/red/grey), metrics table (4 rows), issue list via IssueCard

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| Component Gate | PASS | Isolated components, typed props, no prop drilling |
| Dev Gate | PASS | Engine calls only in src/lib/, no any, strict TS |
| Visual Gate | PASS | Status banners, metrics table, issue cards with ARIA labels |

Overall: PASS
