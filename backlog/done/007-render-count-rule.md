---
id: "007"
title: "Render count detection rule (flag excessive re-renders)"
type: "rule"
priority: 3
status: "done"
created: "2026-04-02"
sot-section: "Section 6.3, 7"
depends-on: ["005", "006"]
---

# Render count detection rule (flag excessive re-renders)

> SOT Reference: Section 6.3 — "IF renderCount > threshold → flag re-render"; Section 5.2 — metrics.renderCount; Section 7 — Rule Definition template.

## PM Plan

### Problem Definition
**Feature**: Render count detection rule — flags nodes where `renderCount` exceeds a configurable threshold
**Goal**: Detect components that re-render too many times, which degrades UI performance
**Why needed**: SOT Section 6.3 explicitly defines this rule as a required detection pattern

### Scope
- `src/rules/render-count.ts` — exports `createRenderCountRule(threshold?: number): Rule`
- Default threshold: 5 re-renders
- Returns a Rule compatible with the registry (item 004)

### Non-goals
- No automatic fixing of re-renders
- No React-specific lifecycle knowledge
- No dynamic threshold adjustment

### Expected Behavior

**Input**: node with `renderCount: 10`, threshold `5`
**Expected Output**: `{ triggered: true, issue: { rule: "render-count", severity: "warning", ... } }`

**Input**: node with `renderCount: 2`, threshold `5`
**Expected Output**: `{ triggered: false }`

### SOT Traceability
- Implements: Section 6.3 — "IF renderCount > threshold → flag re-render"
- Implements: Section 7 — Rule Definition template
- Constrained by: Section 2.2 — deterministic, no randomness

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | renderCount > threshold → triggers | `renderCount: 10`, threshold `5` | `{ triggered: true, issue: { rule: "render-count", severity: "warning" } }` |
| H2 | renderCount < threshold → no trigger | `renderCount: 3`, threshold `5` | `{ triggered: false }` |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | renderCount exactly at threshold → no trigger (strictly >) | `renderCount: 5`, threshold `5` | `{ triggered: false }` |
| E2 | Custom threshold respected | threshold `2`, `renderCount: 3` | triggered; `renderCount: 1` → not triggered |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | renderCount 0 → does not trigger | `renderCount: 0` | `{ triggered: false }` |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | Negative renderCount → treated as invalid, no trigger | `renderCount: -1` | `{ triggered: false }` |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| createRenderCountRule | `(threshold?: number) => Rule` | Factory: returns rule with configurable threshold (default 5) |

### Module Structure
- `src/rules/render-count.ts` — exports `createRenderCountRule`

### Data Flow
`threshold` → factory → `Rule { name: "render-count", detect: (node, metrics) => RuleResult }`

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, scope limited, SOT 6.3 traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure factory |
| Test Coverage | PASS | 42/42 tests pass, 0 skipped |

Overall: PASS
