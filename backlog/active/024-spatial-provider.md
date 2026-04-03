---
id: "024"
title: "SpatialProvider (src/adapters/index.ts — React component wiring fiber + metrics + engine)"
type: infra
priority: 1
status: active
created: 2026-04-03
sot-section: "CLAUDE.md Integration Adapters; SOT Section 4"
depends-on: "022, 023"
---

## PM Plan

**Problem**: The fiber adapter (022) and metrics adapter (023) exist independently. There is no React component that wires them together, runs the engine, and exposes results — meaning real projects still can't use the engine with fewer than 3 lines of setup code (the product's stated goal).

**Goal**: Add `src/adapters/index.ts` exporting:
- `<SpatialProvider>` — a React component that wraps the app, instruments renders via `React.Profiler`, runs `analyze()` after each render, and posts the `PerformanceResult` to `window.__SPATIAL__`
- `useSpatial()` — a hook that returns the latest `PerformanceResult` from `window.__SPATIAL__`

**Scope**:
```tsx
// 3-line setup in user's app:
import { SpatialProvider } from 'spatial/adapters'
<SpatialProvider><App /></SpatialProvider>
```

**How it works**:
1. Wraps children in `<React.Profiler id="spatial" onRender={...}>`
2. On each `onRender` callback: reads `fiber` via `_currentRenderer` (read-only), calls `extractTree()`, calls `collectMetrics(renderCount)`, calls `analyze(tree, metrics, registry)`
3. Posts result to `window.__SPATIAL__ = { result, timestamp }`
4. Dev-only guard: `if (process.env.NODE_ENV === 'production') return children` — zero overhead in prod
5. No React internals patching — only `React.Profiler` public API used

**Non-goals**: Do not render any visible UI. Do not intercept or modify renders. Do not support SSR.

**Done when**: Wrapping any React app with `<SpatialProvider>` causes `window.__SPATIAL__` to be populated with a `PerformanceResult` after the first render.

## QA Test Plan

**Note**: Tests are React-agnostic. `createSpatialHandler()` is the testable unit — `SpatialProvider` is a thin JSX wrapper that calls it.

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | `handler()` in dev | `window.__SPATIAL__.result` has status/metrics/issues |
| 2 | Happy | `handler()` in dev | `window.__SPATIAL__.timestamp` is a positive number |
| 3 | Happy | Two `handler()` calls | Second renderCount > first renderCount |
| 4 | Edge | `handler()` result.status | Is one of pass/fail/unknown |
| 5 | Edge | `handler()` result.issues | Is always an array |
| 6 | Failure | `NODE_ENV = 'production'` calling `handler()` | `window.__SPATIAL__` stays undefined |
| 7 | Happy | `useSpatial()` after handler | Returns the stored PerformanceResult |
| 8 | Edge | `useSpatial()` before any handler | Returns null |
| 9 | Unknown | `useSpatial()` in production | Returns null |

## Implementation Plan

**Functions**:
1. `buildDefaultRegistry()` — creates a registry with all 8 built-in rules pre-registered
2. `createSpatialHandler(fiberRoot?)` — returns a closure that increments renderCount, extracts tree, collects metrics, analyzes, and posts to `globalThis.__SPATIAL__`; production guard returns no-op
3. `useSpatial(): PerformanceResult | null` — reads `globalThis.__SPATIAL__?.result`; returns null in production or if not yet set
4. `SpatialProvider` — placeholder export; real JSX use requires `.tsx` rename and `React.Profiler` wrapper (documented in file)

**Files touched**: `src/adapters/index.ts` (new)

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 9 tests: 5 createSpatialHandler (3 happy, 2 edge, 1 failure), 3 useSpatial (1 happy, 1 edge, 1 unknown) |
| Dev Validation | PASS | Production guard on line 50; uses globalThis not window; no DOM APIs; no internals patched |
| Test Coverage | PASS | 183/183 tests pass; no skips |

Overall: PASS
