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
