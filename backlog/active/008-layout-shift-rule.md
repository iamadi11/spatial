---
id: "008"
title: "Layout shift detection rule (flag layout instability)"
type: "rule"
priority: 3
status: "active"
created: "2026-04-02"
sot-section: "Section 6.3, 7"
depends-on: ["005", "006"]
---

# Layout shift detection rule (flag layout instability)

> SOT Reference: Section 6.3 — "IF layoutShift > threshold → flag layout instability"; Section 5.2 — metrics.layoutShifts; Section 7 — Rule Definition template.

## PM Plan

### Problem Definition
**Feature**: Layout shift detection rule — flags nodes where `layoutShifts` exceeds a threshold
**Goal**: Detect components causing visual instability (CLS-like pattern) before code ships
**Why needed**: SOT Section 6.3 explicitly requires this rule: "IF layoutShift > threshold → flag layout instability"

### Scope
- `src/rules/layout-shift.ts` — exports `createLayoutShiftRule(threshold?: number): Rule`
- Default threshold: 3 layout shifts
- Returns a Rule compatible with the registry

### Non-goals
- No CLS score calculation (that's a browser metric)
- No auto-fix suggestions

### Expected Behavior
**Input**: `layoutShifts: 5`, threshold `3` → `{ triggered: true, issue: { rule: "layout-shift" } }`
**Input**: `layoutShifts: 1`, threshold `3` → `{ triggered: false }`

### SOT Traceability
- Implements: Section 6.3 — "IF layoutShift > threshold → flag layout instability"
- Implements: Section 7 — Rule Definition template

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | layoutShifts > threshold → triggers | `layoutShifts: 5`, threshold `3` | `{ triggered: true, issue: { rule: "layout-shift" } }` |
| H2 | layoutShifts < threshold → no trigger | `layoutShifts: 1` | `{ triggered: false }` |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | layoutShifts exactly at threshold → no trigger | `layoutShifts: 3`, threshold `3` | `{ triggered: false }` |
| E2 | Custom threshold respected | threshold `1`, `layoutShifts: 2` vs `1` | triggered / not triggered |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | layoutShifts 0 → no trigger | `layoutShifts: 0` | `{ triggered: false }` |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | Negative layoutShifts → invalid, no trigger | `layoutShifts: -1` | `{ triggered: false }` |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| createLayoutShiftRule | `(threshold?: number) => Rule` | Factory: returns layout-shift rule (default threshold 3) |

### Module Structure
- `src/rules/layout-shift.ts` — exports `createLayoutShiftRule`

### Data Flow
`threshold` → factory → `Rule { name: "layout-shift", detect: (node, metrics) => RuleResult }`

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, scope limited, SOT 6.3 traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure factory |
| Test Coverage | PASS | 48/48 tests pass, 0 skipped |

Overall: PASS
