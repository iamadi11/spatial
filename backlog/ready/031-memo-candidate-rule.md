---
id: "031"
title: "Memo candidate detection rule (flag high-render nodes with expensive children)"
type: rule
priority: 3
status: ready
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
