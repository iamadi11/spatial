---
id: "011"
title: "Metrics caching layer (cache per render, avoid recomputation)"
type: "perf"
priority: 4
status: "active"
created: "2026-04-02"
sot-section: "Section 11"
depends-on: ["005"]
---

# Metrics caching layer (cache per render, avoid recomputation)

> SOT Reference: Section 11 — "Metrics cached per render"; "No repeated measurement of same DOM operation"; Section 6.2 — "All computations must be based on provided component tree."

## PM Plan

### Problem Definition
**Feature**: Metrics caching layer — memoizes `PerformanceResult` by `(nodeId, metrics)` key to prevent redundant rule evaluation
**Goal**: Ensure the same (node, metrics) pair is never analyzed twice in one analysis pass
**Why needed**: SOT Section 11 requires "no repeated measurement"; when the engine walks a tree and applies all rules, identical metric inputs for the same node should not rerun the full rule set

### Scope
- `src/metrics-cache.ts` — exports `createMetricsCache()` factory and `buildCacheKey()` helper
- Cache stores `PerformanceResult` keyed by a string derived from `nodeId + serialized metrics`
- Cache supports: `has(key)`, `get(key)`, `set(key, result)`, `clear()`

### Non-goals
- No integration into `analyze()` — this item only builds the cache primitive
- No TTL, LRU eviction, or size limits — cache is per-analysis-run
- No persistence across runs

### Expected Behavior

**Input**:
```ts
const cache = createMetricsCache()
const key = buildCacheKey('btn-1', { renderCount: 6, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 })
cache.set(key, { status: 'fail', metrics: { renderCount: 6, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 }, issues: [] })
```

**Expected Output**:
```ts
cache.has(key)  // → true
cache.get(key)  // → { status: 'fail', ... }
```

### SOT Traceability
- Implements: Section 11 — "Metrics cached per render"; "No repeated measurement of same DOM operation"
- Constrained by: Section 2.2 — pure functions, deterministic
- Constrained by: Section 6.2 — all computations based on provided data only

## QA Test Plan
(to be filled by /write-tests)

## Implementation Plan
(to be filled by /implement)

## Validation Report
(to be filled by /validate)
