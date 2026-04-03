---
id: "021"
title: "Report summary formatter (human-readable text output for PerformanceResult)"
type: feature
priority: 4
status: ready
created: 2026-04-03
sot-section: "Section 5.2, Section 9"
depends-on: "012"
---

## PM Plan

**Problem**: Item 012 (`formatIssue` / `formatIssues`) formats individual issues into structured text. But there is no function that formats a complete `PerformanceResult` — the top-level output of the engine — into a readable summary. Users have to compose the status, metrics, and issues manually. This is the last gap in the output contract (SOT 5.2).

**Goal**: Add a `formatReport(result: PerformanceResult): string` function that renders a full engine result as a multi-line human-readable text block: status line, metrics section, and issues section (reusing `formatIssues` from item 012).

**Scope**: Pure function, string output only. No HTML, no DOM, no colors/ANSI codes (not deterministic across environments). Builds on `formatIssues` from `src/issue-formatter.ts`.

**Non-goals**: Do not render HTML. Do not add color codes. Do not write to stdout (the caller does that). Do not invent new output formats — text only.

**Expected behavior**:
```
Status: PASS
Metrics: renderCount=2 layoutShifts=0 fpsDrop=0 memoryUsage=45
Issues: none

---

Status: FAIL
Metrics: renderCount=8 layoutShifts=5 fpsDrop=0 memoryUsage=45
Issues:
  [render-count] warning: Component re-renders 8 times (threshold: 5) (node: root)
  [layout-shift] warning: Layout shifts 5 times (threshold: 3) (node: root)

---

Status: UNKNOWN
Reason: metrics contain invalid values (negative numbers not allowed)
```
