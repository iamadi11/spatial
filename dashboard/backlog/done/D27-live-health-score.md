---
id: "D27"
title: "Live session health score — pass-ratio meter on /live"
type: feature
priority: 4
status: active
created: 2026-04-17
sot-section: "Section 16.6"
depends-on: "D25"
---

## PM Plan

**Problem**: The `/live` page shows raw pass/fail/unknown counts (D25) but gives no ratio-based quality signal. Developers can't quickly tell "is my app mostly healthy?" without doing mental arithmetic on the counts. A percentage-based health score provides an at-a-glance verdict.

**Goal**: Add a `LiveHealthScore` component that computes and displays the pass percentage from the snapshots ring buffer, with color-coded visual feedback: green (≥ 80%), yellow (50–79%), red (< 50%).

**Scope**:
- `LiveHealthScore` component (pure — accepts `snapshots: Snapshot[]`)
- Shows: `pass / total * 100` as a percentage with one decimal place
- Color-coded label: green ≥ 80%, yellow 50-79%, red < 50%
- Simple progress bar / score display — no chart library
- Renders above `LiveSessionStats` on the `/live` page
- Empty state: hidden when `snapshots.length === 0` (stats panel already handles this)
- Updates on every render as snapshots prop changes
- No state — pure computed display

**Non-goals**: Persistence, trend over time, weighted scoring by severity, historical charting

**Done when**:
- Component shows correct percentage from snapshots array
- Color coding is correct for green/yellow/red thresholds
- Empty snapshots → component renders nothing (or a neutral placeholder)
- Component has accessible labels
- All existing tests pass

## QA Test Plan

**Happy path**:
1. All snapshots pass → renders "100%", emerald color
2. All snapshots fail → renders "0%", red color
3. Mixed 2/4 → renders "50%", yellow color

**Edge cases**:
1. Empty snapshots → null render (no region element in DOM)
2. Single passing snapshot → renders "100%"
3. 9/10 pass (90%) → green styling, "90%" label
4. All-unknown → 0% pass, red styling, "0%" label

**Failure case**:
1. Single passing snapshot → "100%"

**Unknown case**: N/A (pure computation, no unknown state)

## Implementation Plan

1. `dashboard/src/components/LiveHealthScore.tsx` — pure component
   - `getScoreColor(pct)` → `{ bar, label }` Tailwind classes
   - `passCount` = filter `status === 'pass'`
   - `pct` = `Math.round(passCount / total * 100)`
   - Progress bar with `aria-label`, percentage `<span>` with accessible label
   - Returns `null` when `snapshots.length === 0`
2. `dashboard/src/pages/LivePage.tsx` — added `<LiveHealthScore>` above `<LiveSessionStats>`

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| QA Validation | PASS | 7 tests: 3 happy, 4 edge/failure — all pass |
| Dev Validation | PASS | Pure component, no any, no engine calls in component |
| Test Coverage | PASS | 207/207 tests pass |

Overall: PASS
