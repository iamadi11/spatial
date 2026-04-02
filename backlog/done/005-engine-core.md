---
id: "005"
title: "Engine core (metrics pipeline + result aggregation)"
type: "infra"
priority: 2
status: "done"
created: "2026-04-02"
sot-section: "Section 4"
depends-on: ["003", "004"]
---

# Engine core (metrics pipeline + result aggregation)

> SOT Reference: Section 4 Step 4 — "functions/modules for: Metrics collection, Render tracking, DOM mutation monitoring, Anomaly detection"; Section 5.2 — output contract.

## PM Plan

### Problem Definition
**Feature**: Engine core — walks the component tree, collects metrics per node, runs all rules, aggregates into a `PerformanceResult`
**Goal**: The central pipeline that connects tree traversal (003) + rule registry (004) + types (002) into a single callable `analyze(tree, metrics)` function
**Why needed**: Without the engine, the individual primitives have no orchestration — this is the public API that consumers call

### Scope
- `src/engine.ts` — exports `analyze(node: ComponentNode, metrics: PerformanceMetrics, registry: Registry): PerformanceResult`
- Walks the tree, runs all rules against each node via the registry, collects all issues, determines final status

### Non-goals
- No built-in rules (those are items 007-010)
- No caching (that's item 011)
- No metric measurement (metrics are provided as input — SOT Section 6.2)

### Expected Behavior

**Input**: root `ComponentNode` + `PerformanceMetrics` + populated `Registry`
**Expected Output**: `{ status: "pass"|"fail"|"unknown", metrics, issues[] }`
- `status: "pass"` if no issues
- `status: "fail"` if any issues detected
- `status: "unknown"` if metrics are missing/invalid (SOT 2.3)

### SOT Traceability
- Implements: Section 4 Step 4 — metrics collection, anomaly detection pipeline
- Implements: Section 5.2 — output contract
- Constrained by: Section 6.2 — all computations based on provided data only
- Constrained by: Section 2.3 — return UNKNOWN if cannot compute

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | No rules triggered → pass | tree + baseMetrics + rule with threshold not exceeded | `{ status: "pass", issues: [] }` |
| H2 | Rule triggered → fail | tree + metrics exceeding threshold | `{ status: "fail", issues: [{ rule: "..." }] }` |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | Empty registry → always pass | tree + metrics + empty registry | `{ status: "pass", issues: [] }` |
| E2 | Rule fires on every node in tree | 2-node tree + always-fires rule | 2 issues, `status: "fail"` |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | Single-node tree, rule fires | lone node + rule exceeding threshold | 1 issue with correct nodeId |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | Negative renderCount → invalid metrics | `renderCount: -1` | `{ status: "unknown", reason: "..." }` |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| isValidMetrics | `(metrics: PerformanceMetrics) => boolean` | Guards against invalid (negative) metric values |
| analyze | `(root: ComponentNode, metrics: PerformanceMetrics, registry: Registry) => PerformanceResult` | Main pipeline: traverse → run rules → aggregate |

### Module Structure
- `src/engine.ts` — exports `analyze`

### Data Flow
`ComponentNode` + `PerformanceMetrics` + `Registry` → `isValidMetrics` guard → `collectNodes` (traversal) → `registry.runAll` per node → aggregate `PerformanceIssue[]` → `PerformanceResult`

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, scope limited, SOT traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure functions, O(n) via collectNodes |
| Test Coverage | PASS | 30/30 tests pass, 0 skipped |

Overall: PASS
