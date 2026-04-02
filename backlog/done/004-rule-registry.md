---
id: "004"
title: "Rule registry (register and execute detection rules)"
type: "infra"
priority: 2
status: "done"
created: "2026-04-02"
sot-section: "Section 7"
depends-on: ["002"]
---

# Rule registry (register and execute detection rules)

> SOT Reference: Section 7 — "Every rule must follow: Rule Name, Purpose, Inputs, Condition, Output"; Section 4 Step 4 — "Anomaly detection."

## PM Plan

### Problem Definition
**Feature**: Rule registry — register named detection rules and execute them against a ComponentNode
**Goal**: Decouple rule definitions from the engine core; rules register themselves, engine executes them
**Why needed**: Item 005 (engine) needs a way to run all rules against each node. The registry is the boundary between "what rules exist" and "how they run"

### Scope
- `src/rule-registry.ts` — exports `createRegistry()`, `Rule` type, `RuleResult` type
- `Rule`: `{ name: string, detect: (node: ComponentNode, metrics: PerformanceMetrics) => RuleResult }`
- `RuleResult`: `{ triggered: boolean, issue?: PerformanceIssue }`
- `createRegistry()`: returns object with `register(rule)` and `runAll(node, metrics)` methods

### Non-goals
- No built-in rules (those are items 007-010)
- No async rule execution
- No rule priority ordering

### Expected Behavior

**Input**: register a rule, then call `runAll` with a node + metrics
**Expected Output**: array of `PerformanceIssue` for all triggered rules, empty array if none triggered

### SOT Traceability
- Implements: Section 7 — "Every rule must follow: Rule Name, Purpose, Inputs, Condition, Output"
- Implements: Section 4 Step 4 — "Anomaly detection"
- Constrained by: Section 2.2 — pure, deterministic execution

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | Triggered rule returns its issue | rule with `renderCount > 5`, metrics with `renderCount: 10` | issues array with 1 issue |
| H2 | Non-triggered rule returns empty array | same rule, metrics with `renderCount: 1` | empty issues array |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | Empty registry | no rules registered | empty issues array |
| E2 | Multiple rules, only one triggers | one always-fires + one never-fires | array with 1 issue |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | Rule returns `triggered: true` but no `issue` | rule with no issue field | empty issues array (gracefully ignored) |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | Rule receives invalid metrics, returns `triggered: false` | `renderCount: -1` | empty issues array (no crash) |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| createRegistry | `() => Registry` | Factory: returns `{ register, runAll }` instance |
| register | `(rule: Rule) => void` | Adds rule to internal list |
| runAll | `(node: ComponentNode, metrics: PerformanceMetrics) => PerformanceIssue[]` | Executes all rules, collects triggered issues |

### Module Structure
- `src/rule-registry.ts` — exports `createRegistry`, `Rule`, `RuleResult`, `Registry` types

### Data Flow
`Rule[]` (registered) + `ComponentNode` + `PerformanceMetrics` → `runAll` → `PerformanceIssue[]`

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, scope limited, SOT traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure factory pattern |
| Test Coverage | PASS | 24/24 tests pass, 0 skipped |

Overall: PASS
