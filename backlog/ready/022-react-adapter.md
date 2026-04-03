---
id: "022"
title: "React fiber adapter (src/adapters/react.ts)"
type: infra
priority: 1
status: ready
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
