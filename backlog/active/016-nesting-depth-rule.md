---
id: "016"
title: "Nesting depth detection rule (flag deeply nested component trees)"
type: rule
priority: 4
status: active
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Deeply nested component trees increase reconciliation time proportionally. SOT 4.2.2 explicitly lists "Nested layouts" and "deeply nested components" as required edge cases. The engine must flag trees that exceed a maximum nesting depth threshold.

**Goal**: Add a rule that computes the depth of a node relative to the root and flags nodes that exceed a configurable depth threshold.

**Scope**: Depth is passed as a node-level metric — the engine provides it during traversal. Pure computation, no DOM.

**Non-goals**: Do not restructure the component tree. Do not compute depth from within the rule by re-traversing (that would violate O(n) traversal constraint).

**Implementation note**: This rule requires the engine to pass `depth` alongside metrics, or the traversal layer to annotate nodes with depth. This is a small, bounded engine change — one additional field threaded through the traversal.

**Expected behavior**:
- `computeMaxDepth(root) > threshold` → `check(root)` returns a `PerformanceIssue`
- Within threshold → `check(root)` returns `null`

**Architecture decision**: The existing per-node `Rule` interface cannot know each node's depth without re-traversal (O(n²)). Instead, this module exposes:
1. `computeMaxDepth(root): number` — O(n) pure utility
2. `createNestingDepthRule(threshold?): { name, check(root) }` — tree-level checker (not a per-node Rule)

This preserves O(n) complexity, requires zero changes to existing types/engine, and is fully SOT-compliant.

## Implementation Plan

**File**: `src/rules/nesting-depth.ts`

**Functions**:
- `computeMaxDepth(root: ComponentNode): number` — recursive max-depth via DFS, O(n)
- `createNestingDepthRule(threshold?: number)` — returns `{ name: string, check: (root) => PerformanceIssue | null }`

Default threshold: 10

## QA Test Plan

Test file: `tests/unit/rules/nesting-depth.test.ts`

**computeMaxDepth:**

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | single root node | 1 |
| 2 | Happy | linear chain of 5 | 5 |
| 3 | Happy | branching tree (depths 3 and 2) | 3 |
| 4 | Edge | root with empty children array | 1 |
| 5 | Edge | flat wide tree (50 children, 0 nesting) | 2 |

**createNestingDepthRule:**

| # | Type | Input | Expected |
|---|------|-------|----------|
| 6 | Happy | depth 3, threshold 5 | null (not triggered) |
| 7 | Happy | depth 5, threshold 5 (at boundary) | null |
| 8 | Happy | depth 6, threshold 5 | issue with rule="nesting-depth", severity="warning" |
| 9 | Edge | single root node | null |
| 10 | Edge | depth 20, threshold 5 | issue with "20" and "5" in message |
| 11 | Edge | threshold 1, tree with 1 child | triggered |
| 12 | Failure | default threshold, single root | null |
| 13 | Unknown | same tree called twice | identical results |

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, architecture decision documented |
| QA Validation | PASS | 3 happy, 5 edge, 1 failure, 1 unknown cases (13 total) |
| Dev Validation | PASS | Pure functions, no DOM, no randomness, no `any`, O(n) DFS |
| Test Coverage | PASS | 13/13 tests pass, 114/114 total suite passes |

Overall: PASS
