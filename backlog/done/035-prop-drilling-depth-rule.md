---
id: "035"
title: "Prop drilling depth detection rule (flag deep prop propagation)"
type: rule
priority: 3
status: active
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

## QA Test Plan

**Happy path**:
1. Returns null when same prop at exactly 3 consecutive levels (= threshold, not exceeded)
2. Returns null when nodes have no props

**Edge cases**:
1. Returns issue when prop drills through 4 consecutive levels (> threshold 3)
2. Returns null when prop appears non-consecutively (gap resets chain)
3. Different props at each level — no single prop drills — returns null

**Failure cases**:
1. Issue nodeId points to node where drilling was first detected

**Unknown/deterministic**:
1. Returns null for empty root (no props, no children)
2. Custom threshold respected — depth 3 fires at threshold 2

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when present |
| QA Validation | PASS | 8 tests: happy/edge/failure/unknown |
| Dev Gate | PASS | Pure function, no DOM, no randomness, O(n) DFS |
| Test Coverage | PASS | 34 engine test files, 283 tests all passing; tsc --noEmit clean |

Overall: PASS
