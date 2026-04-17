---
id: "D25"
title: "Live session stats panel — pass/fail ratio and top firing rules on /live"
type: feature
priority: 3
status: ready
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
