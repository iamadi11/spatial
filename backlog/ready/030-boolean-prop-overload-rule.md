---
id: "030"
title: "Boolean prop overload detection rule (flag do-it-all components)"
type: rule
priority: 3
status: ready
created: 2026-04-04
sot-section: "Section 4.2.2, 7, 12"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Components with many boolean props (`isActive`, `isDisabled`, `isLoading`, `isReadOnly`, `isExpanded`, `isSelected`, …) are "do-it-all" components that accumulate toggle flags over time. Each boolean prop is a new re-render trigger — when any parent state changes, the component receives a new props object and re-renders even if most flags are unchanged. This pattern is a recognised React performance anti-pattern (SOT Section 4.2.2 props analysis) that no existing rule covers. `prop-count` flags total prop count but does not distinguish boolean flags from data props.

**Goal**: Add a `boolean-prop-overload` rule that counts the number of props whose value is `typeof === 'boolean'` and flags nodes where that count exceeds a threshold (default 5).

**Scope**:
- Pure function rule in `src/rules/boolean-prop-overload.ts`
- Counts props where `typeof val === 'boolean'` for each key in `node.props`
- If boolean-prop count > threshold → triggers a `warning`
- Metrics unused (structural props check only)
- Unit tests in `tests/unit/rules/boolean-prop-overload.test.ts`

**Non-goals**:
- Does not inspect nested prop objects for booleans (top-level only)
- Does not suggest a specific refactor (e.g. use variant/enum)
- Does not modify `prop-count` or any existing rule
- Does not count non-boolean props

**Done when**: Rule file created, all tests pass (happy path, edge, failure, unknown/determinism), pure function with no DOM.
