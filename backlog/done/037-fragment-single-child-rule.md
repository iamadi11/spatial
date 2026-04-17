---
id: "037"
title: "Fragment single-child detection rule (flag unnecessary wrappers)"
type: rule
priority: 4
status: active
created: 2026-04-17
sot-section: "Section 12, 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: React Fragments (`<>...</>`) are useful for grouping multiple children without adding DOM nodes. But when a Fragment has only a single child, it adds zero structural benefit and just pollutes the component tree with an extra node. The engine has no rule for this.

**Goal**: Add a `fragment-single-child` rule that flags nodes with type `Fragment` or `React.Fragment` that have exactly one child.

**Scope**:
- Node-level rule: check if node.type is 'Fragment' or 'React.Fragment'
- If it has exactly 1 child → fire warning
- If it has 0 or 2+ children → return not triggered
- Pure function, O(1) per node, no DOM

**Non-goals**: Detecting key-bearing Fragments, wrapping list items, context-aware Fragment usage

**Done when**:
- Rule flags Fragment nodes with exactly 1 child
- Rule returns not triggered for Fragment with 0 children (empty fragment)
- Rule returns not triggered for Fragment with 2+ children (valid use)
- Rule returns not triggered for non-Fragment node types
- Tests cover happy/edge/failure/unknown

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when present |
| QA Validation | PASS | 8 tests: 2 happy, 4 edge, 1 failure, 1 determinism |
| Dev Gate | PASS | Pure O(1) per node; no DOM; no randomness; strict TS |
| Test Coverage | PASS | 36 engine files, 299 tests all passing; tsc --noEmit clean |

Overall: PASS
