---
id: "006"
title: "Unknown/fallback handler (return UNKNOWN when cannot compute)"
type: "infra"
priority: 2
status: "active"
created: "2026-04-02"
sot-section: "Section 2.3, 6.1, 9"
depends-on: ["002"]
---

# Unknown/fallback handler (return UNKNOWN when cannot compute)

> SOT Reference: Section 2.3 — "If unsure → return UNKNOWN. Never guess metrics or bottlenecks."; Section 9 — '{ "status": "unknown", "reason": "unsupported input or environment" }'; Section 6.1 — "If missing → return UNKNOWN."

## PM Plan

### Problem Definition
**Feature**: Centralised unknown/fallback result builder — a pure utility that constructs well-formed `PerformanceResult` objects with `status: "unknown"` when the engine cannot compute reliably
**Goal**: Ensure every UNKNOWN path in the codebase produces a consistent, SOT-compliant result shape
**Why needed**: SOT Section 2.3 and 9 mandate a specific shape for unknown results. Centralising this eliminates duplication and prevents subtle shape inconsistencies across rules and the engine

### Scope
- `src/unknown.ts` — exports `unknownResult(reason: string): PerformanceResult`
- Returns a zero-metrics, empty-issues PerformanceResult with `status: "unknown"` and the provided reason

### Non-goals
- No logging or side effects
- No error throwing
- Not responsible for deciding WHEN to return unknown (callers decide that)

### Expected Behavior

**Input**: `"metrics contain invalid values"`
**Expected Output**:
```ts
{ status: "unknown", metrics: { renderCount: 0, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }, issues: [], reason: "metrics contain invalid values" }
```

### SOT Traceability
- Implements: Section 2.3 — "If unsure → return UNKNOWN"
- Implements: Section 9 — `{ "status": "unknown", "reason": "..." }` contract
- Implements: Section 6.1 — "If missing → return UNKNOWN"

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | Returns unknown status with reason | `"metrics contain invalid values"` | `{ status: "unknown", reason: "metrics contain invalid values" }` |
| H2 | Returns zero metrics and empty issues | `"unsupported environment"` | all metrics 0, issues empty |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | Empty reason string works | `""` | `{ status: "unknown", reason: "" }` |
| E2 | Each call returns independent object | two calls with different reasons | mutations to one don't affect the other |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | Status is always "unknown", never pass/fail | any reason | `status !== "pass"`, `status !== "fail"` |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | Output matches SOT Section 9 shape exactly | `"unsupported input or environment"` | `{ status: "unknown", reason: "...", metrics: { all 0 }, issues: [] }` |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| unknownResult | `(reason: string) => PerformanceResult` | Returns zero-metrics PerformanceResult with status "unknown" |

### Module Structure
- `src/unknown.ts` — exports `unknownResult`

### Data Flow
`reason: string` → `unknownResult` → `PerformanceResult { status: "unknown", metrics: {all 0}, issues: [], reason }`

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, scope limited, SOT traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure function |
| Test Coverage | PASS | 36/36 tests pass, 0 skipped |

Overall: PASS
