---
id: "025"
title: "Event handler count detection rule (flag components with excessive event bindings)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.2, 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: The existing `prop-count` rule flags total prop count but cannot distinguish between data props and function props. A component with 15 function-valued props (onClick, onChange, onFocus, …) creates significant re-render pressure because every parent re-render passes new function references unless carefully memoized. This pattern is not currently detected.

**Goal**: Add `src/rules/event-handler-count.ts` — a per-node rule that counts the number of function-valued props on a component node and flags nodes that exceed a threshold.

**Scope**:
- `createEventHandlerCountRule(threshold = 5): Rule` — pure factory following the standard Rule interface
- Counts props where `typeof value === 'function'`
- Flags with severity `'warning'` and message `'Component has N event handlers (threshold: T)'`
- Issue nodeId = node.id

**Non-goals**: Do not inspect function bodies. Do not distinguish arrow functions from named functions. Do not suggest memoization strategies.

**Done when**: `createEventHandlerCountRule()` returns a rule that detects nodes with more function props than the threshold, passes the standard test suite, and is registered in the rule catalog.

## QA Test Plan

| # | Type | Input | Expected |
|---|------|-------|----------|
| H1 | Happy | 6 function props, threshold=5 | triggered=true, issue with count in message |
| H2 | Happy | 2 function props, threshold=5 | triggered=false |
| E1 | Edge | exactly 5 function props, threshold=5 | triggered=false (> not >=) |
| E2 | Edge | custom threshold=2, 3 function props | triggered=true |
| E3 | Edge | mix of function and non-function props | only functions counted |
| F1 | Failure | no props at all | triggered=false |
| F2 | Failure | empty props object | triggered=false |
| U1 | Unknown | rule.name | always 'event-handler-count' |

## Implementation Plan

**Function**: `createEventHandlerCountRule(threshold=5): Rule`
- Iterates `Object.keys(node.props)`, counts entries where `typeof val === 'function'`
- Returns `triggered: false` when count ≤ threshold
- Single O(n) pass over props

**Files touched**: `src/rules/event-handler-count.ts` (new)

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Gate | PASS | Problem, scope, non-goals, done-when present |
| QA Gate | PASS | 8 tests: 2 happy, 3 edge, 2 failure, 1 unknown |
| Dev Gate | PASS | Pure function; no DOM; no side effects; O(n) props scan |
| Test Gate | PASS | 191/191 tests pass; no skips |

Overall: PASS
