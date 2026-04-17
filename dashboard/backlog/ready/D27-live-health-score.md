---
id: "D27"
title: "Live session health score — pass-ratio meter on /live"
type: feature
priority: 4
status: ready
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
