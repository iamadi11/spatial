---
id: "009"
title: "FPS drop detection rule (flag frame rate degradation)"
type: "rule"
priority: 3
status: "active"
created: "2026-04-02"
sot-section: "Section 5.2, 7"
depends-on: ["005", "006"]
---

# FPS drop detection rule (flag frame rate degradation)

> SOT Reference: Section 5.2 — metrics.fpsDrop; Section 7 — Rule Definition template (Condition: IF fpsDrop > threshold → flag fps degradation); Section 6.1 — never assume baseline FPS.

## PM Plan

### Problem Definition
**Feature**: FPS drop detection rule — flags nodes where `fpsDrop` exceeds a threshold
**Goal**: Detect components causing significant frame rate degradation
**Why needed**: SOT Section 5.2 defines `fpsDrop` as a core metric; Section 6.1 states never assume baseline FPS — this rule operates on the provided value only

### Scope
- `src/rules/fps-drop.ts` — exports `createFpsDropRule(threshold?: number): Rule`
- Default threshold: 10 frames dropped. Severity: "error" (more severe than re-renders)

### Non-goals
- No actual FPS measurement (metrics are provided as input)
- No baseline FPS assumption

### Expected Behavior
**Input**: `fpsDrop: 20`, threshold `10` → triggered with `severity: "error"`
**Input**: `fpsDrop: 5`, threshold `10` → not triggered

### SOT Traceability
- Implements: Section 5.2 — `metrics.fpsDrop`
- Constrained by: Section 6.1 — never assume baseline FPS

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | fpsDrop > threshold → triggers error | `fpsDrop: 20`, threshold `10` | `{ triggered: true, issue: { severity: "error" } }` |
| H2 | fpsDrop < threshold → no trigger | `fpsDrop: 5` | `{ triggered: false }` |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | fpsDrop exactly at threshold → no trigger | `fpsDrop: 10`, threshold `10` | `{ triggered: false }` |
| E2 | Custom threshold | threshold `5`, `fpsDrop: 6` vs `4` | triggered / not triggered |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | fpsDrop 0 → no trigger | `fpsDrop: 0` | `{ triggered: false }` |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | Negative fpsDrop → invalid, no trigger | `fpsDrop: -5` | `{ triggered: false }` |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| createFpsDropRule | `(threshold?: number) => Rule` | Factory: returns fps-drop rule (default threshold 10, severity "error") |

### Module Structure
- `src/rules/fps-drop.ts` — exports `createFpsDropRule`

### Data Flow
`threshold` → factory → `Rule { name: "fps-drop", detect: (node, metrics) => RuleResult }`

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, SOT 5.2 / 6.1 traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure factory |
| Test Coverage | PASS | 54/54 tests pass, 0 skipped |

Overall: PASS
