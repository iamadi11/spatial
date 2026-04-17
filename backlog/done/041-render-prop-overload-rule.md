---
id: "041"
title: "Render prop overload detection rule (flag components with too many non-event function props)"
type: rule
priority: 4
status: active
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

## QA Test Plan

**Happy path**:
1. 4 non-event function props → fires (warning, nodeId correct)
2. 5 non-event function props → fires, message contains type name

**Edge cases**:
1. Exactly 3 (= threshold) → does NOT fire
2. All `on*` props (event handlers) → does NOT fire
3. 4 non-event + 3 event = fires (event props excluded)
4. Non-function props don't count
5. No props → does NOT fire
6. Empty props object → does NOT fire

**Failure cases**:
1. 0 non-event functions → does NOT fire
2. 1 non-event function → does NOT fire

**Unknown case**:
1. null prop values → typeof null !== 'function', so not counted

## Implementation Plan

1. `src/rules/render-prop-overload.ts` — node-level rule
   - `RENDER_PROP_THRESHOLD = 3`
   - Iterate `Object.entries(props)`, count entries where `typeof value === 'function' && !key.startsWith('on')`
   - Fire with warning severity when count > threshold
   - O(1) per node (single props pass)
2. `dashboard/src/lib/engine.ts` — registered as node-level rule; also registered `createIndexAsKeyRule` (040, previously missing from adapter)
3. `dashboard/tests/unit/engine-adapter.test.ts` — count updated 25 → 27

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| QA Validation | PASS | 11 tests across happy/edge/failure/unknown — all pass |
| Dev Gate | PASS | Pure function, O(1) per node, no DOM, no any |
| Test Coverage | PASS | 337 engine tests + 207 dashboard tests — all pass |

Overall: PASS
