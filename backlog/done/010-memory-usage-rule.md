---
id: "010"
title: "Memory usage detection rule (flag memory anomalies)"
type: "rule"
priority: 3
status: "done"
created: "2026-04-02"
sot-section: "Section 5.2, 7"
depends-on: ["005", "006"]
---

# Memory usage detection rule (flag memory anomalies)

> SOT Reference: Section 5.2 — metrics.memoryUsage; Section 7 — Rule Definition template (Condition: IF memoryUsage > threshold → flag memory anomaly); Section 2.3 — never guess metrics.

## PM Plan

### Problem Definition
**Feature**: Memory usage detection rule — flags nodes where `memoryUsage` exceeds a configurable threshold (MB)
**Goal**: Detect components with abnormal memory consumption before they hit production
**Why needed**: SOT Section 5.2 defines `memoryUsage` as a core output metric; Section 2.3 mandates never guessing — this rule acts purely on provided values

### Scope
- `src/rules/memory-usage.ts` — exports `createMemoryUsageRule(threshold?: number): Rule`
- Default threshold: 100MB. Severity: "error"

### Non-goals
- No memory profiling or measurement
- No GC analysis

### Expected Behavior
**Input**: `memoryUsage: 200`, threshold `100` → triggered with `severity: "error"`
**Input**: `memoryUsage: 50` → not triggered

### SOT Traceability
- Implements: Section 5.2 — `metrics.memoryUsage`
- Constrained by: Section 2.3 — never guess metrics

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | memoryUsage > threshold → triggers error | `memoryUsage: 200`, threshold `100` | `{ triggered: true, issue: { severity: "error" } }` |
| H2 | memoryUsage < threshold → no trigger | `memoryUsage: 50` | `{ triggered: false }` |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | memoryUsage exactly at threshold → no trigger | `memoryUsage: 100`, threshold `100` | `{ triggered: false }` |
| E2 | Custom threshold | threshold `50`, `memoryUsage: 51` vs `49` | triggered / not triggered |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | memoryUsage 0 → no trigger | `memoryUsage: 0` | `{ triggered: false }` |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | Negative memoryUsage → invalid, no trigger | `memoryUsage: -10` | `{ triggered: false }` |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| createMemoryUsageRule | `(threshold?: number) => Rule` | Factory: returns memory-usage rule (default 100MB, severity "error") |

### Module Structure
- `src/rules/memory-usage.ts` — exports `createMemoryUsageRule`

### Data Flow
`threshold` → factory → `Rule { name: "memory-usage", detect: (node, metrics) => RuleResult }`

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, SOT 5.2 / 2.3 traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure factory |
| Test Coverage | PASS | 60/60 tests pass, 0 skipped |

Overall: PASS
