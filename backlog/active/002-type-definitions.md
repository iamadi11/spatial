---
id: "002"
title: "Core type definitions (ComponentNode + PerformanceResult)"
type: "infra"
priority: 1
status: "active"
created: "2026-04-02"
sot-section: "Section 5"
depends-on: ["001"]
---

# Core type definitions (ComponentNode + PerformanceResult)

> SOT Reference: Section 5.1 — "type ComponentNode = { id, type, props?, children?, styles? }"; Section 5.2 — output contract with status, metrics, issues.

## PM Plan

### Problem Definition
**Feature**: TypeScript type definitions — `ComponentNode` (input contract) and `PerformanceResult` (output contract)
**Goal**: Establish shared data shapes that all subsequent modules (traversal, rules, engine) depend on
**Why needed**: Without typed contracts, modules cannot interoperate — types are the structural foundation of the entire engine

### Scope
- `src/types.ts` — exports `ComponentNode`, `PerformanceMetrics`, `PerformanceIssue`, `PerformanceResult`
- Shapes match SOT Section 5.1 and 5.2 exactly

### Non-goals
- No runtime logic or validation functions
- No framework-specific types (React, Vue, Angular)
- No serialization utilities

### Expected Behavior

**Input** (ComponentNode):
```ts
{ id: "btn-1", type: "Button", props: { disabled: false }, children: [], styles: { color: "red" } }
```

**Expected Output** (PerformanceResult):
```ts
{ status: "pass", metrics: { renderCount: 2, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 }, issues: [] }
```

### SOT Traceability
- Implements: Section 5.1 — `ComponentNode` input contract
- Implements: Section 5.2 — output contract with `status`, `metrics`, `issues`
- Constrained by: Section 2.2 — deterministic, no browser-specific types

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | ComponentNode with all optional fields | `{ id, type, props, children, styles }` | all fields accessible with correct types |
| H2 | PerformanceResult with passing status and metrics | `{ status: "pass", metrics: {...}, issues: [] }` | status === "pass", issues empty |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | ComponentNode with only required fields | `{ id: "root", type: "View" }` | optional fields undefined, no error |
| E2 | PerformanceResult with fail status and issues array | `{ status: "fail", metrics, issues: [{rule, severity, message, nodeId}] }` | issues has 1 entry |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | status is restricted to union "pass" \| "fail" \| "unknown" | all three values | each accepted, no others compile |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | PerformanceResult with unknown status + reason field | `{ status: "unknown", reason: "..." }` | `result.reason` contains the message |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| — | type only | No runtime functions; pure type exports |

### Module Structure
- `src/types.ts` — exports `ComponentNode`, `PerformanceMetrics`, `PerformanceIssue`, `PerformanceResult`

### Data Flow
`ComponentNode` (input) → engine → `PerformanceResult` (output)

## Validation Report
(to be filled by /validate)
