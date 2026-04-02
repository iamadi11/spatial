---
id: "003"
title: "Component tree traversal (O(n) walk)"
type: "infra"
priority: 2
status: "active"
created: "2026-04-02"
sot-section: "Section 11"
depends-on: ["002"]
---

# Component tree traversal (O(n) walk)

> SOT Reference: Section 11 — "O(n) traversal max for component tree"; Section 3.2 — "Input format (code, component tree, DOM snapshot)."

## PM Plan

### Problem Definition
**Feature**: O(n) component tree traversal — visits every node in a `ComponentNode` tree exactly once
**Goal**: Provide a reusable, pure traversal primitive that the rule engine uses to walk trees without nested loops
**Why needed**: The rule engine (item 005) needs to apply detection rules to every node; traversal must be separated from rule execution to keep both testable independently

### Scope
- `src/traversal.ts` — exports `walkTree(node, visitor)` and `collectNodes(node)`
- `walkTree`: depth-first traversal, calls visitor once per node, O(n)
- `collectNodes`: returns flat array of all nodes in traversal order

### Non-goals
- No rule execution or metric collection (that's item 005)
- No cycle detection (component trees are acyclic by definition)
- No async traversal

### Expected Behavior

**Input**:
```ts
{ id: "root", type: "View", children: [{ id: "btn", type: "Button" }] }
```

**Expected Output** (`collectNodes`):
```ts
[{ id: "root", ... }, { id: "btn", ... }]  // 2 nodes, depth-first order
```

### SOT Traceability
- Implements: Section 11 — "O(n) traversal max for component tree"
- Implements: Section 3.2 — "Input format (component tree)"
- Constrained by: Section 2.2 — pure functions, no side effects

## QA Test Plan
(to be filled by /write-tests)

## Implementation Plan
(to be filled by /implement)

## Validation Report
(to be filled by /validate)
