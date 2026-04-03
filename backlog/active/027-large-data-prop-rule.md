---
id: "027"
title: "Large data prop detection rule (flag props carrying oversized serialised data)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.2, 12 (measurement accuracy)"
depends-on: "005, 006"
---

## PM Plan

**Problem**: The `prop-count` rule flags the number of props but ignores their weight. A component with 2 props can still be problematic if one prop is a 500-item array passed on every render. There is no current rule that measures the size of data being passed through props.

**Goal**: Add `src/rules/large-data-prop.ts` — a per-node rule that estimates the serialised size of non-function props and flags nodes where the total exceeds a threshold.

**Scope**:
- `createLargeDataPropRule(thresholdBytes = 10_000): Rule` — pure factory following the standard Rule interface
- Estimates prop payload size using `JSON.stringify` on non-function values; wraps in try/catch for circular references (returns 0 on failure)
- Flags with severity `'warning'`, message `'Props serialise to ~N bytes (threshold: T bytes)'`
- Issue nodeId = node.id

**Non-goals**: Do not measure function prop sizes. Do not recurse into React elements inside props. Do not suggest compression or splitting strategies.

**Done when**: `createLargeDataPropRule()` flags nodes whose non-function props serialize to more than the threshold bytes, handles circular references safely, and all tests pass.

## QA Test Plan

| # | Type | Input | Expected |
|---|------|-------|----------|
| H1 | Happy | props with 11KB string, threshold=10000 | triggers with warning |
| H2 | Happy | tiny props (label, count) | does not trigger |
| E1 | Edge | props exactly at threshold bytes | does not trigger (> not >=) |
| E2 | Edge | custom threshold=500, 600-byte payload | triggers |
| E3 | Edge | function props mixed with tiny data prop | functions excluded; does not trigger |
| E4 | Edge | triggered issue | message contains byte size info |
| F1 | Failure | no props at all | does not trigger |
| F2 | Failure | empty props object | does not trigger |
| U1 | Unknown | circular reference in props | no throw; triggered:false |
| U2 | Unknown | rule.name | 'large-data-prop' |
