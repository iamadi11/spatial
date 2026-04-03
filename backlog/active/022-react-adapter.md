---
id: "022"
title: "React fiber adapter (src/adapters/react.ts)"
type: infra
priority: 1
status: active
created: 2026-04-03
sot-section: "CLAUDE.md Integration Adapters; SOT Section 5.1"
depends-on: "004, 017"
---

## PM Plan

**Problem**: The core engine takes a `ComponentNode` tree — a plain data structure. In real projects, developers have a live React component tree (fiber), not a hand-crafted JSON object. There is no way to bridge the two without writing boilerplate. This blocks real-world adoption.

**Goal**: Add `src/adapters/react.ts` — a dev-only module that walks the React fiber tree and extracts a `ComponentNode` tree the core engine can consume.

**Scope**:
- `extractTree(fiber: unknown): ComponentNode` — reads `fiber.type`, `fiber.memoizedProps`, `fiber.child`, `fiber.sibling` to build the ComponentNode tree
- Each fiber node becomes one `ComponentNode` with: `id` (generated from fiber index path), `type` (component name or HTML tag), `props` (memoizedProps keys only — serialisable values, functions omitted), `children` (recursive via child/sibling links)
- Guard: `if (process.env.NODE_ENV === 'production') return { id: 'root', type: 'unknown' }`
- Read-only: never mutates the fiber tree

**Non-goals**: Do not patch React internals. Do not intercept renders. Do not support React Native. Do not serialize function prop values.

**Done when**: `extractTree(mockFiber)` returns a valid `ComponentNode` tree that `analyze()` accepts.

## QA Test Plan

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | Single fiber, function component, serialisable props | `{ type: 'MyButton', props: { label: 'Click me', disabled: false }, children: [] }` |
| 2 | Happy | Parent fiber with `child` pointing to a child fiber | `children` array with one extracted child node |
| 3 | Happy | Fiber where first child has `.sibling` | `children` contains both sibling nodes |
| 4 | Happy | Fiber with function prop mixed with serialisable props | function key omitted from `result.props` |
| 5 | Edge | Fiber with `type = 'section'` (HTML tag string) | `result.type === 'section'` |
| 6 | Edge | Fiber with `type = undefined` | `result.type === 'unknown'` |
| 7 | Edge | Three-level nesting | All 3 node ids are unique |
| 8 | Edge | Fiber with no `memoizedProps`, no `child` | `props: {}`, `children: []` |
| 9 | Failure | `NODE_ENV = 'production'` | Returns `{ id: 'root', type: 'unknown' }`, no real props |
| 10 | Unknown | Object with completely wrong shape | Returns a valid `ComponentNode` (id, type, children present) |

## Implementation Plan

**Functions**:
1. `resolveName(type: unknown): string` — string → use as-is; function → use `.name`; else → `'unknown'`
2. `filterProps(raw): Record<string,unknown>` — omits keys where `typeof value === 'function'`
3. `walkFiber(fiber, indexPath): ComponentNode` — walks `child`/`sibling` chain recursively; builds id from index path
4. `extractTree(fiber: unknown): ComponentNode` — production guard first; delegates to `walkFiber`

**Files touched**: `src/adapters/react.ts` (new)
