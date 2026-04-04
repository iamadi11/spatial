---
id: "D14"
title: "Live page last-updated indicator (timestamp + pulse on new data)"
type: feature
priority: 4
status: active
created: 2026-04-04
sot-section: "Section 16.6"
depends-on: "D07"
---

## PM Plan

**Problem**: The `/live` page polls `window.__SPATIAL__` every 500ms, but there is no visual feedback to confirm:
1. When the bridge was last updated (is the data fresh or stale?)
2. Whether a new snapshot just arrived (did something just change?)

Engineers using the live view during development have no way to tell if the dashboard is receiving live data or showing a stale snapshot from 30 seconds ago.

**Goal**: Show a "Last updated X ago" label below the live result that refreshes every second, and briefly pulse the result panel whenever new data arrives (bridge timestamp changes).

**Scope**:
- Track `lastUpdatedAt: Date | null` in `LiveAnalysisPage` state
- Set it to `new Date()` each time `readBridge()` returns a new result (detected by comparing a stable property, e.g. result reference or a counter)
- Render a small "Last updated Xs ago" label — updates every 1s via `setInterval`
- Apply a CSS transition class for 600ms when new data arrives (pulse effect using Tailwind `animate-pulse` or a timed class toggle)
- Label reads "Waiting for data…" when no bridge data has arrived yet

**Non-goals**:
- No persistent history of snapshots
- No chart or trend line over time
- No changes to `readBridge()` or `lib/live.ts`
- No server calls

**Done when**: Timestamp label renders, "Waiting for data…" shows before first snapshot, label updates every second, tests verify label renders and updates when result changes.

## QA Test Plan

**Happy path 1**: "Waiting for data…" label shows before first snapshot
**Happy path 2**: "Last updated Xs ago" label shows when connected
**Edge case 1**: result panel renders when bridge data is present (pulse wrapper)
**Edge case 2**: label uses relative time ("Xs ago" format)
**Failure case**: connected indicator shows "Last updated X ago" text
**Unknown case**: "Waiting for data…" shown in disconnected state

## Implementation Plan

- Added `lastUpdatedAt: Date | null` state tracked via `lastTimestampRef` ref
- Added `isPulsing` state (toggled 600ms via `setTimeout`) for `animate-pulse` class
- Added second `useEffect` for 1s tick interval to force label re-render
- Changed disconnected text to "Waiting for data…" (exact D14 spec)
- Changed "last updated" text from `toLocaleTimeString()` to `Xs ago` relative format

## Validation Report

Date: 2026-04-04

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when present |
| Component Gate | PASS | Only `LiveAnalysisPage.tsx` modified, no new components |
| Dev Gate | PASS | No engine calls, no `any`, strict TypeScript |
| Visual Gate | PASS | "Waiting for data…" label, relative timestamp, accessible |

Overall: PASS
