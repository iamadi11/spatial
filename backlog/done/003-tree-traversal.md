---
id: "003"
title: "Component tree traversal (O(n) walk)"
type: "infra"
priority: 2
status: "done"
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

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | collectNodes returns all nodes depth-first | 5-node tree (root→child-1→gc-1,gc-2→child-2) | array of 5 nodes in DFS order |
| H2 | walkTree calls visitor for every node exactly once | same 5-node tree | visited IDs = ['root','child-1','grandchild-1','grandchild-2','child-2'] |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | single node with no children | `{ id: "alone", type: "Text" }` | array of 1 node |
| E2 | deeply nested 4-level tree | l1→l2→l3→l4 | 4 nodes in order |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | empty children array | `{ id: "solo", children: [] }` | array of 1 node (no crash) |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | visitor that produces unknown result when pattern not found | 5-node tree, pattern never matches | `{ status: "unknown", reason: "..." }` shape is valid |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| walkTree | `(node: ComponentNode, visitor: (node: ComponentNode) => void) => void` | DFS traversal, calls visitor once per node |
| collectNodes | `(node: ComponentNode) => ComponentNode[]` | Returns flat DFS-ordered array of all nodes |

### Module Structure
- `src/traversal.ts` — exports `walkTree`, `collectNodes`

### Data Flow
`ComponentNode` (tree) → `walkTree` → visitor called per node
`ComponentNode` (tree) → `collectNodes` → `ComponentNode[]` (flat array)

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, scope limited, SOT traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure functions, O(n) |
| Test Coverage | PASS | 18/18 tests pass, 0 skipped |

Overall: PASS
