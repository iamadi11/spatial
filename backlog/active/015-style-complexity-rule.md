---
id: "015"
title: "Style complexity detection rule (flag components with expensive CSS properties)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.3, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Certain CSS properties (e.g. `box-shadow`, `filter`, `backdrop-filter`, `transform`, `clip-path`) are GPU-compositing expensive and can trigger layout or paint cycles. SOT 4.2.3 lists "dynamic CSS" as a failure/risk case. The engine must flag components whose `styles` contain known expensive properties.

**Goal**: Add a rule that checks `node.styles` for a fixed set of expensive CSS property keys and flags the component when any are present.

**Scope**: Key-match against a static allowlist of expensive properties — pure, deterministic, no DOM.

**Non-goals**: Do not evaluate CSS values (e.g. `transform: none` is fine — value analysis is out of scope). Do not fetch external stylesheets.

**Expected behavior**:
- `styles` contains one or more expensive properties → triggered, severity `warning`, lists which properties
- `styles` absent or contains no expensive properties → not triggered

## Implementation Plan

**File**: `src/rules/style-complexity.ts`

**Expensive properties set** (static, deterministic):
`boxShadow`, `filter`, `backdropFilter`, `transform`, `clipPath`

**Function**: `createStyleComplexityRule(): Rule`
- Reads `Object.keys(node.styles ?? {})`
- Intersects with the expensive set
- Returns triggered + issue listing the found expensive keys when intersection is non-empty
- Does not use metrics

## QA Test Plan

Test file: `tests/unit/rules/style-complexity.test.ts`

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | safe props (color, fontSize, margin) | not triggered |
| 2 | Happy | `boxShadow` present | triggered, warning, message contains "boxShadow" |
| 3 | Happy | `filter` + `backdropFilter` + safe | triggered, both listed in message |
| 4 | Edge | no `styles` property | not triggered |
| 5 | Edge | empty `styles: {}` | not triggered |
| 6 | Edge | `transform` property | triggered |
| 7 | Edge | `clipPath` property | triggered |
| 8 | Failure | styles with no matching expensive keys | not triggered |
| 9 | Unknown | varying metrics, same node | result identical |

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, expected behavior defined |
| QA Validation | PASS | 2 happy, 4 edge, 1 failure, 1 unknown test cases |
| Dev Validation | PASS | Pure function, no DOM, no randomness, no `any`, O(n) on style keys |
| Test Coverage | PASS | 9/9 tests pass, 101/101 total suite passes |

Overall: PASS
