---
id: "031"
title: "Memo candidate detection rule (flag high-render nodes with expensive children)"
type: rule
priority: 3
status: active
created: 2026-04-04
sot-section: "Section 4.2.2, 6.3, 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: `render-count` flags when a tree re-renders too often, and `child-count` flags when a node has too many children — but neither rule identifies the compound case: a node that re-renders frequently **and** has a non-trivial number of children. This combination is the primary signal for a `React.memo` candidate — a component worth wrapping to prevent it from re-rendering and cascading renders down to all its children. The existing rules fire independently but don't connect the two signals into actionable guidance.

**Goal**: Add a `memo-candidate` rule that fires a `warning` when `metrics.renderCount` exceeds a render threshold **and** the node has more direct children than a children threshold, indicating the component is a strong `React.memo` candidate.

**Scope**:
- Pure function rule in `src/rules/memo-candidate.ts`
- Reads `metrics.renderCount` (global tree metric) AND `node.children?.length`
- Fires when BOTH: `renderCount > renderCountThreshold` AND `children.length > childrenThreshold`
- Default thresholds: `renderCountThreshold = 3`, `childrenThreshold = 3`
- Returns `warning` severity issue with message naming both counts
- Unit tests in `tests/unit/rules/memo-candidate.test.ts`

**Non-goals**:
- Does not inspect children's props or subtrees (top-level children count only)
- Does not suggest `useMemo` for expensive values — only `React.memo` for component memoization
- Does not replace `render-count` or `child-count` rules
- Does not fire when only one condition is true (both required)
- Does not use `metrics.layoutShifts`, `fpsDrop`, or `memoryUsage`

**Done when**: Rule file created, both threshold conditions required, all tests pass (happy/edge/failure/unknown), pure function with no DOM.

## QA Test Plan

**Happy path 1**: both renderCount and children below threshold — not triggered (renderCount=2, 2 children, thresholds 3/3)
**Happy path 2**: both thresholds exceeded — triggered with warning naming both counts (renderCount=5, 4 children)
**Edge case 1**: renderCount exceeds threshold but children at/below — not triggered (renderCount=5, 3 children, threshold 3)
**Edge case 2**: children exceed threshold but renderCount at/below — not triggered (renderCount=3, 5 children)
**Edge case 3**: no children at all (leaf node) — not triggered even with high renderCount
**Failure case**: default thresholds used, both conditions met — triggers correctly
**Unknown/deterministic**: same input always produces same output regardless of call order

## Implementation Plan

- `src/rules/memo-candidate.ts`: pure `Rule` factory with two configurable thresholds
- Reads `metrics.renderCount` and `node.children?.length ?? 0`
- Both conditions required simultaneously (AND logic)
- Returns `warning` when both exceed thresholds; `{ triggered: false }` otherwise
- O(1) per node — no traversal needed

## Validation Report

Date: 2026-04-04

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when present |
| QA Validation | PASS | 2 happy, 4 edge, 1 failure, 1 unknown — 8 tests |
| Dev Validation | PASS | Pure function, no DOM, no randomness, no `any`, O(1) |
| Test Coverage | PASS | 8/8 pass, full suite 252/252 |

Overall: PASS
