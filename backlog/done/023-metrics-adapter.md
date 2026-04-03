---
id: "023"
title: "Metrics adapter (src/adapters/metrics.ts — collect PerformanceMetrics from browser APIs)"
type: infra
priority: 1
status: done
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

## QA Test Plan

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | `collectMetrics(3)` with full browser mocks | Object with renderCount, layoutShifts, fpsDrop, memoryUsage fields |
| 2 | Happy | `collectMetrics(7)` and `collectMetrics(0)` | renderCount matches injected value exactly |
| 3 | Happy | `performance.memory.usedJSHeapSize = 52_428_800` | `memoryUsage === 50` (MB conversion) |
| 4 | Happy | Any valid call | layoutShifts and fpsDrop >= 0 |
| 5 | Edge | `performance.memory` missing | `memoryUsage === 0` |
| 6 | Edge | `renderCount = 0` | No error, renderCount field is 0 |
| 7 | Edge | Any call | All four fields are finite numbers (no NaN/Infinity) |
| 8 | Failure | `NODE_ENV = 'production'` | Returns `{ renderCount:0, layoutShifts:0, fpsDrop:0, memoryUsage:0 }` |
| 9 | Unknown | `PerformanceObserver` not available | Returns valid PerformanceMetrics without throwing |

## Implementation Plan

**Functions**:
1. `attachObserver()` — attaches `PerformanceObserver` for `layout-shift` once; accumulates `_layoutShiftCount`
2. `attachRaf()` — registers a `requestAnimationFrame` loop once; increments `_fpsDrop` on frames > 2× target
3. `readMemoryMB()` — reads `performance.memory?.usedJSHeapSize / 1_048_576`; returns 0 if unavailable
4. `collectMetrics(renderCount): PerformanceMetrics` — production guard, attaches observers, returns snapshot
5. `resetMetrics()` — resets module-level accumulators (test utility)

**Files touched**: `src/adapters/metrics.ts` (new)

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 9 tests: 4 happy, 3 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | Production guard on line 63; no DOM manipulation; no mutations of external objects |
| Test Coverage | PASS | 174/174 tests pass; no skips |

Overall: PASS
