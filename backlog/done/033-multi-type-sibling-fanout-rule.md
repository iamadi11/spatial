---
id: "033"
title: "Multi-type sibling fan-out detection rule (flag kitchen-sink parent renders)"
type: rule
priority: 4
status: done
created: 2026-04-09
sot-section: "Section 4.2.2, 7, 12"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Several rules cover large same-type sibling groups (`unvirtualized-list`) or prop/child counts, but a parent that renders *many direct children of different component types* often indicates a “kitchen sink” component that mixes unrelated UI in one render path. That increases reconciliation work and hurts locality of changes. Teams lack a deterministic structural signal for this pattern.

**Goal**: Add a pure tree rule that flags a `ComponentNode` when it has many direct children *and* those children use more than a threshold number of distinct `type` strings (fan-out diversity), within O(n) total work.

**Scope**:
- New rule module `src/rules/multi-type-sibling-fanout.ts` with factory `createMultiTypeSiblingFanoutRule(options)` (thresholds for min children count and min distinct types, plus severities)
- Single O(n) post-order or preorder pass: per node, inspect only immediate children to count distinct types (use a small deterministic structure — e.g. sorted unique types or a single pass with a map keyed by type string; per-node work proportional to that node’s child count; sum across tree is O(n))
- Register in engine/rule wiring consistent with existing rules (see `engine.ts` / existing rule registration pattern)
- Unit tests in `tests/unit/rules/multi-type-sibling-fanout.test.ts` covering happy, edge, failure, unknown paths
- Rule catalog metadata if the project exports rule lists for the dashboard

**Non-goals**:
- No props inspection beyond what exists on `ComponentNode`
- No DOM or metrics beyond `PerformanceMetrics` contract where other rules ignore metrics
- Does not replace `child-count` or `unvirtualized-list`; complements them
- No auto-fix or suggestions

**Done when**: Rule is registered, tests pass, `npx vitest --run` is green, bundle budgets unchanged or justified, and behavior is documented in the backlog item QA/implementation sections as usual.

## QA Test Plan

- **Happy path**: Few children → no trigger; many children but few distinct types → no trigger; ≥10 children and ≥6 distinct types → trigger with `nodeId` on parent
- **Edge cases**: No `children`; empty `children` array; 10 children with only 4 distinct types → no trigger
- **Failure case**: Relaxed thresholds (4/4) trigger on 4 distinct children
- **Unknown / metrics**: Rule ignores metrics; same structural result for any `PerformanceMetrics` values

## Implementation Plan

- `src/rules/multi-type-sibling-fanout.ts` — `createMultiTypeSiblingFanoutRule` with defaults min 10 children, 6 distinct types
- `dashboard/src/lib/engine.ts` — register rule; `RuleOptions` overrides; `RULE_CATALOG` entry
- `tests/unit/rules/multi-type-sibling-fanout.test.ts`
- `dashboard/tests/unit/engine-adapter.test.ts` — catalog length 19, name `multi-type-sibling-fanout`

## Validation Report

Date: 2026-04-09

| Gate | Status | Notes |
|------|--------|--------|
| PM Validation | PASS | Scope and non-goals met |
| QA Validation | PASS | Tests cover happy, edge, failure, metrics-ignored |
| Dev Validation | PASS | Pure rule, no DOM, O(n) over tree via registry |
| Test Coverage | PASS | Root + dashboard vitest green |

Overall: PASS
