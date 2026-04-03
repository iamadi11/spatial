---
id: "025"
title: "Event handler count detection rule (flag components with excessive event bindings)"
type: rule
priority: 3
status: ready
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
