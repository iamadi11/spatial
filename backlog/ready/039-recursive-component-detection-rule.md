---
id: "039"
title: "Recursive component detection rule (flag component type appearing in own ancestor chain)"
type: rule
priority: 4
status: ready
created: 2026-04-17
sot-section: "Section 12, 7"
depends-on: "003, 005, 006"
---

## PM Plan

**Problem**: When a component renders itself (directly or transitively through the tree), recursive rendering can stack up deeply and cause performance issues or infinite loops. While React has a built-in max depth limit, intermediate recursive renders still add reconciliation cost. The engine has no rule for this pattern.

**Goal**: Add a `recursive-component` rule that flags nodes whose `type` already appears in their ancestor chain — meaning the component is rendering within an instance of itself.

**Scope**:
- Tree-level rule: DFS traversal with a running `Set<string>` of ancestor types
- At each node: check if `node.type` already exists in the ancestor set
- If yes → fire warning (the node ID + type)
- Skip generic HTML-like types (lowercase, e.g. `div`, `span`, `p`) — these are DOM elements, not recursive components
- Only flag for PascalCase component types (starts with uppercase letter)
- Return the first recursive node found

**Non-goals**: Tracking recursion depth or call count, detecting mutual recursion through multiple component types, runtime stack analysis

**Done when**:
- Rule fires when a PascalCase component type appears in its own ancestor chain
- Rule returns null for trees with no recursive types
- Rule ignores lowercase (DOM element) types
- Tests cover happy/edge/failure/unknown
