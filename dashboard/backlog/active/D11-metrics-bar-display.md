---
id: "D11"
title: "Metrics bar display (visual metric bars for PerformanceResult)"
type: feature
priority: 4
status: active
created: 2026-04-04
sot-section: "Section 16.6"
depends-on: "D05"
---

## PM Plan

**Problem**: The `ResultDetailView` shows the four `PerformanceMetrics` values (`renderCount`, `layoutShifts`, `fpsDrop`, `memoryUsage`) as a plain table of numbers. Engineers must mentally compare numbers to understand which metric is most problematic. A visual representation makes the severity of each metric immediately obvious at a glance.

**Goal**: Add a `MetricsBarDisplay` component that renders each metric as a labeled horizontal bar, with bar width proportional to a per-metric maximum, and a colour that shifts from green → amber → red based on threshold proximity.

**Scope**:
- New component `dashboard/src/components/MetricsBarDisplay.tsx`
  - Props: `metrics: PerformanceMetrics` (strict typed, no `any`)
  - Renders 4 bars: renderCount, layoutShifts, fpsDrop, memoryUsage
  - Each bar: label, numeric value, coloured fill (Tailwind)
  - Colour logic: below 50% of max = green, 50–80% = amber, above 80% = red
  - Per-metric max values are constants defined in the component (not from engine)
- `ResultDetailView` replaces or augments the existing metrics table with `MetricsBarDisplay`
- Unit tests in `dashboard/tests/MetricsBarDisplay.test.tsx`

**Non-goals**:
- No animation
- No chart library (pure Tailwind CSS bars only)
- No changes to engine or `src/lib/engine.ts`
- Does not replace the numeric value — shows both bar and number

**Done when**: Component renders correctly for pass/fail/zero metrics, colour thresholds work, integrated into ResultDetailView, tests pass.
