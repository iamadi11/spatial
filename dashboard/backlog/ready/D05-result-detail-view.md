---
id: D05
title: "Result detail view (status badge + metrics table + issue cards)"
type: feature
priority: 3
status: ready
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
