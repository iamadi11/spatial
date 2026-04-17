---
id: "041"
title: "Render prop overload detection rule (flag components with too many non-event function props)"
type: rule
priority: 4
status: ready
created: 2026-04-17
sot-section: "Section 12, 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Components that accept many render-prop or callback-style function props (e.g., `renderHeader`, `getLabel`, `formatRow`, `onTransform`) are doing too many things. Each function prop creates a new reference on every parent render, forcing child re-renders even with memoization. This is distinct from event handlers (`on*` props, covered by `event-handler-count`) — render props are more about component responsibility creep. The engine has no rule for this pattern.

**Goal**: Add a `render-prop-overload` rule that flags component nodes with too many non-event-handler function props — props whose values are functions but whose keys do NOT start with `on`.

**Scope**:
- Node-level rule: count props where `typeof value === 'function'` AND key does not start with `'on'`
- Fire when count exceeds threshold (default: 3)
- Props starting with `'on'` are excluded (those belong to `event-handler-count`)
- O(1) per node (one pass over props object)

**Non-goals**: Detecting whether these functions are memoized at runtime, analyzing function body complexity, flagging event handlers (already covered by `event-handler-count`)

**Done when**:
- Rule fires when a node has > threshold non-event function props
- `renderHeader`, `getLabel`, `formatRow`, `transformData` each count
- `onClick`, `onChange`, `onFocus` do NOT count (they start with `on`)
- Rule returns `triggered: false` when count ≤ threshold
- Tests cover happy/edge/failure/unknown
