---
id: "D20"
title: "Live issue history timeline (ring buffer of last N results on /live)"
type: feature
priority: 2
status: active
created: 2026-04-17
sot-section: "Section 16.6"
depends-on: "D07, D14"
---

## PM Plan

**Problem**: The /live page currently only shows the most recent analysis result. Developers cannot see how performance issues evolved over time — they miss transient spikes or regressions that cleared before they looked at the dashboard.

**Goal**: Add a ring buffer that stores the last N analysis snapshots and renders them as a scrollable timeline on /live.

**Scope**:
- Ring buffer (max 50 entries) of `{ result: PerformanceResult, timestamp: number }` stored in React state on /live
- Timeline component showing each snapshot as a row: timestamp, status badge, issue count
- Clicking a row expands/shows the full result detail inline
- New data appended on every poll (500ms); oldest entry dropped when buffer full
- Buffer lives in component state only — no localStorage, no server

**Non-goals**: Persistence across page reloads, server-side history, charts/graphs

**Done when**:
- Timeline renders at least 2 rows after 2 poll cycles in tests
- Clicking a row shows the associated issues
- Ring buffer caps at 50 entries (oldest evicted)
- All existing /live tests still pass

## QA Test Plan

**Happy path**:
1. IssueHistoryTimeline renders "No snapshots yet." when snapshots=[]
2. Renders a row per snapshot with status badge and issue count
3. LivePage shows "waiting for data" when __SPATIAL__ not set
4. LivePage shows a pass badge after one poll cycle with bridge data

**Edge cases**:
1. Clicking expand button shows issue detail inline; clicking again collapses
2. Duplicate timestamps are not added (ring buffer deduplication)
3. Two distinct timestamps accumulate two rows

**Failure cases**:
1. Unknown status renders "unknown" badge correctly

**Unknown/deterministic**:
1. Ring buffer capped — tested via IssueHistoryTimeline with 50-entry limit logic in component

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 12 tests: 2+ happy, 3 edge, 1 failure, accessible labels |
| Dev Validation | PASS | No DOM APIs in engine; window.__SPATIAL__ read in page only; no `any`; strict TS |
| Test Coverage | PASS | 15 test files, 152 tests all passing; tsc --noEmit clean |

Overall: PASS
