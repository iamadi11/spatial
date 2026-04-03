---
id: "023"
title: "Metrics adapter (src/adapters/metrics.ts — collect PerformanceMetrics from browser APIs)"
type: infra
priority: 1
status: active
created: 2026-04-03
sot-section: "CLAUDE.md Integration Adapters; SOT Section 5.2"
depends-on: "022"
---

## PM Plan

**Problem**: The engine needs a `PerformanceMetrics` object (renderCount, layoutShifts, fpsDrop, memoryUsage). In the real world these come from browser APIs — `PerformanceObserver` for layout shifts, `requestAnimationFrame` sampling for FPS, `performance.memory` for heap usage, and a render count hook via React Profiler. There is currently no adapter that collects these.

**Goal**: Add `src/adapters/metrics.ts` that exports a `collectMetrics()` function returning a `PerformanceMetrics` snapshot from live browser data.

**Scope**:
- `collectMetrics(): PerformanceMetrics` — reads from browser performance APIs
- `layoutShifts`: count from `PerformanceObserver` (type `layout-shift`) accumulated since last call
- `memoryUsage`: `performance.memory?.usedJSHeapSize / 1_048_576` (MB), or 0 if not available
- `fpsDrop`: computed from a rolling `requestAnimationFrame` sample — frames dropped below 60fps target
- `renderCount`: injected externally (React Profiler owns this; adapter receives it as a parameter)
- Dev-only guard: `if (process.env.NODE_ENV === 'production') return zeroMetrics`
- Tree-shakeable: exported independently

**Non-goals**: Do not instrument React renders (that belongs to the SpatialProvider). Do not persist metrics across sessions. Do not average or smooth values.

**Done when**: `collectMetrics(renderCount)` returns a valid `PerformanceMetrics` object in a browser environment without errors.
