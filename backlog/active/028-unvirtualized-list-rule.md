---
id: "028"
title: "Unvirtualized list detection rule (flag large same-type sibling groups)"
type: rule
priority: 3
status: active
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
