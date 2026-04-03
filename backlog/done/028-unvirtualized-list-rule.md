---
id: "028"
title: "Unvirtualized list detection rule (flag large same-type sibling groups)"
type: rule
priority: 3
status: done
created: 2026-04-04
sot-section: "Section 4.2.2, 7, 12"
depends-on: "005, 006"
---

## PM Plan

**Problem**: SOT Section 4.2.2 explicitly calls out "long lists without virtualization" as an edge case to detect, but no rule covers it. The existing `child-count` rule flags total children but not the pattern of many same-type siblings (the hallmark of an unvirtualized list like 100× `ListItem`). The existing `duplicate-component-type` rule counts across the whole tree, not per-parent. Developers rendering large arrays without `react-window` or `react-virtual` cause significant layout and paint cost.

**Goal**: Add a `unvirtualized-list` rule that detects a node whose immediate children contain N or more siblings of the same component type, indicating a likely unvirtualized list.

**Scope**:
- Pure function rule in `src/rules/unvirtualized-list.ts`
- Takes `ComponentNode` + `PerformanceMetrics` (metrics unused, but required by Rule contract)
- Checks `node.children` for the largest group of same-type siblings
- If the largest group ≥ threshold (default 50), triggers a warning
- Unit tests in `tests/unit/rules/unvirtualized-list.test.ts`

**Non-goals**:
- Does not detect nested list patterns (only immediate children)
- Does not suggest a specific virtualization library
- Does not check for `key` prop presence (different concern)
- Does not modify any existing rule

**Done when**: Rule file created, registered in engine (or documented for registration), all tests pass, no DOM/browser APIs used.

## QA Test Plan

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | 20×ListItemA + 20×ListItemB, threshold 50 | not triggered |
| 2 | Happy | 50×Row, threshold 50 | not triggered (exclusive) |
| 3 | Happy | 51×Row, threshold 50 | triggered, warning, message contains "51" and "Row" |
| 4 | Happy | 60×Row + 5×Divider, threshold 50 | triggered, message contains "60" and "Row" |
| 5 | Edge | no children property | not triggered |
| 6 | Edge | empty children array | not triggered |
| 7 | Edge | 500×Item, threshold 50 | triggered, message contains "500" |
| 8 | Edge | 100 children all unique types | not triggered |
| 9 | Failure | default threshold, 51×Row | triggered |
| 10 | Failure | default threshold, 49×Row | not triggered |
| 11 | Unknown | non-zero metrics, 30×Row | result unaffected by metrics |
| 12 | Determinism | same input called twice | identical output both times |

## Implementation Plan

1. `createUnvirtualizedListRule(threshold)` — factory returning a `Rule`
2. Guard: return `{ triggered: false }` if no children or empty children
3. Count occurrences of each child `type` using a `Map<string, number>` — O(n)
4. Find the dominant type (max count) in a second O(n) pass over the map
5. If `maxCount > threshold` → return triggered issue with rule name, severity "warning", nodeId, message with count + type + threshold

## Validation Report

Date: 2026-04-04

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 12 tests: 4 happy, 4 edge, 2 failure, 2 determinism/unknown |
| Dev Validation | PASS | Pure function, no DOM, no randomness, O(n), no `any` |
| Test Coverage | PASS | 27 test files, 223 tests all pass |

Overall: PASS
