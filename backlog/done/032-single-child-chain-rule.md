---
id: "032"
title: "Single-child chain detection rule (flag wrapper-hell component trees)"
type: rule
priority: 4
status: active
created: 2026-04-04
sot-section: "Section 4.2.2, 7, 11"
depends-on: "003, 005, 006"
---

## PM Plan

**Problem**: `nesting-depth` counts total tree depth, but does not distinguish between a wide tree (each level has many children) and a "wrapper-hell" tree (each level has exactly one child). Wrapper hell — deeply nested components where each only wraps the next without adding structure — is a React anti-pattern: it adds reconciliation overhead, makes DevTools harder to read, and often indicates over-abstraction. A chain of 5+ single-child wrappers is a clear refactor signal that `nesting-depth` cannot surface.

**Goal**: Add a `single-child-chain` tree-level rule that counts the maximum consecutive depth of nodes with exactly one child and flags when that count exceeds a threshold (default: 4).

**Scope**:
- Tree-level rule (same pattern as `nesting-depth`, `total-node-count`) in `src/rules/single-child-chain.ts`
- Exports `SingleChildChainRule` type and `createSingleChildChainRule(threshold)` factory
- Single O(n) traversal of the tree tracking the current consecutive single-child depth
- "Consecutive single-child depth" = a chain where each node has exactly 1 child
- The chain resets whenever a node has 0 or 2+ children
- Flags the deepest such chain found; issue `nodeId` is the root node of the longest chain
- Default threshold: 4 (5 or more consecutive single-child wrappers triggers a warning)
- Unit tests in `tests/unit/rules/single-child-chain.test.ts`

**Non-goals**:
- Does not flag nodes with zero children (leaf nodes)
- Does not modify or replace `nesting-depth` rule
- Does not inspect props of single-child nodes
- Does not suggest a specific refactor
- Metrics are unused (structural check only)

**Done when**: Rule file created, O(n) traversal confirmed, all tests pass (happy/edge/failure/unknown), pure function with no DOM.

## QA Test Plan

**Happy path 1**: flat tree (root + 3 children) — no chain detected, not triggered (threshold 4)
**Happy path 2**: chain of 5 single-child nodes — triggered with warning, nodeId is root of chain
**Edge case 1**: chain of exactly 4 — not triggered (at threshold, not exceeding)
**Edge case 2**: mixed tree — single-child chain of 3 then a node with 2 children — resets; chain of 3 < threshold of 4, not triggered
**Edge case 3**: leaf node only (no children) — not triggered
**Edge case 4**: two separate chains: one of 3, one of 5 — triggered for the longest (5), nodeId is root of that chain
**Failure case**: default threshold (4) with a chain of 5 — triggered
**Unknown/deterministic**: same tree always produces same result

## Implementation Plan

- `src/rules/single-child-chain.ts`: tree-level rule matching `NestingDepthRule` pattern
- `findMaxChain(node, currentLen, currentChainRootId)` — O(n) recursive traversal
- Chain = contiguous nodes with ≤1 child; 2+-child node breaks chain (not counted itself)
- Leaf nodes ARE counted (they terminate the chain); chain length = wrappers + leaf
- `check(root)` starts traversal from root, compares maxChain against threshold

## Validation Report

Date: 2026-04-04

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when present |
| QA Validation | PASS | 2 happy, 4 edge, 1 failure, 1 unknown — 8 tests |
| Dev Validation | PASS | Pure function, no DOM, no randomness, O(n), no `any` |
| Test Coverage | PASS | 8/8 pass, full suite 260/260 |

Overall: PASS
