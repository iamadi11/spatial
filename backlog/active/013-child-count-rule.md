---
id: "013"
title: "Child count detection rule (flag oversized component children)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Components with an excessive number of direct children cause layout thrashing and slow reconciliation. SOT 4.2.2 explicitly lists "Large component trees" and "Long lists without virtualization" as required edge cases the engine must detect.

**Goal**: Add a rule that flags any `ComponentNode` whose `children` array exceeds a configurable threshold.

**Scope**: Read `node.children.length` — pure, deterministic, no DOM.

**Non-goals**: Do not recurse into subtrees (that is the traversal layer's job). Do not flag based on content type.

**Expected behavior**:
- `children.length > threshold` → triggered, severity `warning`
- `children.length <= threshold` or no children → not triggered

## QA Test Plan

Test file: `tests/unit/rules/child-count.test.ts`

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | 5 children, threshold 10 | not triggered |
| 2 | Happy | 10 children, threshold 10 (exactly at) | not triggered |
| 3 | Happy | 11 children, threshold 10 | triggered, warning, message contains "11" |
| 4 | Edge | node with no `children` property | not triggered |
| 5 | Edge | node with empty `children: []` | not triggered |
| 6 | Edge | 1000 children, threshold 10 | triggered, message contains "1000" |
| 7 | Edge | threshold 0, 1 child | triggered |
| 8 | Failure | default threshold, 0 children | not triggered |
| 9 | Unknown | varying metrics, same node | result identical (metrics do not affect rule) |
