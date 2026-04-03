---
id: "017"
title: "Total node count detection rule (flag oversized component trees)"
type: rule
priority: 3
status: done
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: SOT 4.2.2 explicitly calls out "Very large component trees" as a required edge case. The existing rules catch two dimensions — `child-count` flags wide trees (too many direct children) and `nesting-depth` flags deep trees — but neither catches total tree size. A tree that is moderately wide and moderately deep can still be very large overall, yet evade both existing rules.

**Goal**: Add a rule that computes the total number of nodes in the component tree and flags it when the count exceeds a configurable threshold.

**Scope**: O(n) traversal to count all nodes — pure, deterministic, no DOM. Tree-level checker (same pattern as `nesting-depth`).

**Non-goals**: Do not distinguish node types. Do not combine with depth or width metrics.

**Expected behavior**:
- `totalNodes > threshold` → returns a `PerformanceIssue` (severity `warning`)
- `totalNodes <= threshold` → returns `null`

## Implementation Plan

**File**: `src/rules/total-node-count.ts`

**Functions**:
- `countNodes(root: ComponentNode): number` — O(n) DFS count of all nodes
- `createTotalNodeCountRule(threshold?: number)` — returns `{ name, check(root) => PerformanceIssue | null }`

Default threshold: 200

## QA Test Plan

Test file: `tests/unit/rules/total-node-count.test.ts`

**countNodes:**

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | single root node | 1 |
| 2 | Happy | root + 5 children (6 total) | 6 |
| 3 | Happy | nested tree (5 nodes) | 5 |
| 4 | Edge | root with empty children array | 1 |

**createTotalNodeCountRule:**

| # | Type | Input | Expected |
|---|------|-------|----------|
| 5 | Happy | 50 nodes, threshold 100 | null |
| 6 | Happy | 100 nodes, threshold 100 (at boundary) | null |
| 7 | Happy | 101 nodes, threshold 100 | issue, rule="total-node-count", severity="warning" |
| 8 | Edge | single root node | null |
| 9 | Edge | threshold 0, single node | triggered |
| 10 | Edge | 500 nodes, threshold 100 | triggered, message contains "500" |
| 11 | Failure | default threshold, single root | null |
| 12 | Unknown | same tree called twice | identical results |

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, expected behavior defined |
| QA Validation | PASS | 3 happy, 4 edge, 1 failure, 1 unknown test cases (12 total) |
| Dev Validation | PASS | Pure functions, no DOM, no randomness, no `any`, O(n) DFS |
| Test Coverage | PASS | 12/12 tests pass, 126/126 total suite passes |

Overall: PASS
