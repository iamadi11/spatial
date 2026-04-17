---
id: "035"
title: "Prop drilling depth detection rule (flag deep prop propagation)"
type: rule
priority: 3
status: ready
created: 2026-04-17
sot-section: "Section 12, 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: When the same prop name appears at multiple consecutive levels of the component tree, it signals deep prop drilling — a pattern that tightly couples components and makes refactoring painful. The engine has no rule for this.

**Goal**: Add a `prop-drilling-depth` rule that flags when the same prop key appears on a node AND its ancestor within a configurable depth window.

**Scope**:
- Tree-level rule that walks the tree and tracks prop keys at each depth level
- Fires when any single prop key propagates through more than N consecutive ancestor-descendant levels (default: 3)
- Returns one issue per drilled prop (with the prop name in the message)
- Pure function, no DOM, deterministic

**Non-goals**: Runtime prop value comparison, detecting Redux/Context prop patterns, cross-sibling analysis

**Done when**:
- Rule detects prop drilling when same key appears at 4+ consecutive levels
- Rule returns null when no key exceeds the threshold
- Unit tests cover happy path, edge cases, failure, unknown
