---
id: "D25"
title: "Live session stats panel — pass/fail ratio and top firing rules on /live"
type: feature
priority: 3
status: active
created: 2026-04-17
sot-section: "Section 16.6"
depends-on: "D20, D21"
---

## PM Plan

**Problem**: The /live page shows a scrollable timeline of 50 snapshots, but there is no at-a-glance summary of the current session health. Developers must scroll through rows to understand patterns. There is no answer to "which rules are causing the most problems overall?"

**Goal**: Add a compact stats panel above the timeline that aggregates data from the ring buffer: snapshot count, pass/fail/unknown breakdown, and top-3 rules by fire frequency.

**Scope**:
- `LiveSessionStats` component (pure — accepts `snapshots: Snapshot[]` as prop)
- Shows: total snapshots, pass count, fail count, unknown count
- Shows: top-3 rules by total occurrence count across all snapshots in the buffer
- Renders as a compact summary bar / card above the IssueHistoryTimeline
- Updates on every render (as snapshots prop changes)
- No state — pure computed display

**Non-goals**: Persistence across page reloads, filtering, sorting, full frequency chart

**Done when**:
- Component shows correct pass/fail/unknown counts from snapshots array
- Top-3 rules by frequency are displayed with their counts
- Empty state handled when snapshots is empty
- Component has accessible labels
- All existing tests pass

## QA Test Plan

**Happy path 1**: 3 snapshots (pass×2, fail×1) → total=3, correct badge counts shown.
**Happy path 2**: Multiple snapshots with overlapping rules → top-3 rules displayed in frequency order.
**Edge case 1**: Empty snapshots array → "No snapshots yet" empty state rendered.
**Edge case 2**: Fewer than 3 unique rules → only those rules shown (no empty slots).
**Edge case 3**: All snapshots passing → unknown count = 0.
**Edge case 4**: Component has accessible `role="region"` with `aria-label="Session stats"`.
**Failure case**: More than 3 unique rules → at most 3 `aria-label="Top rule"` elements shown.

## Implementation Plan

Files created/modified:
- `dashboard/src/components/LiveSessionStats.tsx` — pure component; `computeTopRules` helper builds `Map<string, number>`, sorts descending, slices top 3; renders snapshot count + 3 colored count badges + rule chips
- `dashboard/src/pages/LivePage.tsx` — added `<LiveSessionStats snapshots={snapshots} />` above the history timeline section
- `dashboard/tests/unit/live-session-stats.test.tsx` — 8 tests covering all QA cases above

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 8 tests covering happy/edge/failure cases |
| Dev Validation | PASS | Pure component, no state, no `any`, typed props, accessible labels |
| Test Coverage | PASS | 190 dashboard tests pass, 309 engine tests pass |

Overall: PASS
