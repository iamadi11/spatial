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
(to be filled by /write-tests)

## Implementation Plan
(to be filled by /implement)

## Validation Report
(to be filled by /validate)
