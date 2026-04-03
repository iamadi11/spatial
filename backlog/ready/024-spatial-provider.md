---
id: "024"
title: "SpatialProvider (src/adapters/index.ts — React component wiring fiber + metrics + engine)"
type: infra
priority: 1
status: ready
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
