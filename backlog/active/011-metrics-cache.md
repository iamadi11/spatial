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

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | set and get a cached result | `buildCacheKey('n1', metrics)`, `cache.set(key, result)`, `cache.get(key)` | returns the stored result |
| H2 | has() returns true after set | `cache.set(key, result)`, `cache.has(key)` | `true` |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | different nodeIds with same metrics → different keys | `buildCacheKey('a', m)` vs `buildCacheKey('b', m)` | keys are not equal |
| E2 | same nodeId with different metrics → different keys | `buildCacheKey('a', m1)` vs `buildCacheKey('a', m2)` | keys are not equal |
| E3 | clear() removes all entries | set 2 entries, call `clear()`, `has(key)` | `false` for both |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | get() on missing key returns undefined | empty cache, `cache.get('missing')` | `undefined` |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | cached result preserves unknown status | store `{ status: 'unknown', reason: '...' }`, retrieve | retrieved result has `status: 'unknown'` |

## Implementation Plan
(to be filled by /implement)

## Validation Report
(to be filled by /validate)
