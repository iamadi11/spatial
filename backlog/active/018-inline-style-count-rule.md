---
id: "018"
title: "Inline style count detection rule (flag components with excessive inline styles)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Components with many inline style properties incur rendering overhead — the browser must parse and apply each property individually on every render. This is distinct from `style-complexity` (which checks for specific expensive property names) and from `prop-count` (which checks the props object). A component with 30 inline style declarations is costly even if none of the properties are individually "expensive".

**Goal**: Add a rule that flags any `ComponentNode` whose `styles` object has more keys than a configurable threshold, regardless of which properties they are.

**Scope**: Read `Object.keys(node.styles).length` — pure, deterministic, no DOM.

**Non-goals**: Do not inspect property names or values (that is `style-complexity`'s job). Do not overlap with prop-count.

**Expected behavior**:
- `Object.keys(styles).length > threshold` → triggered, severity `warning`
- `styles` absent or within threshold → not triggered

## Implementation Plan

**File**: `src/rules/inline-style-count.ts`

**Function**: `createInlineStyleCountRule(threshold?: number): Rule`
- Reads `Object.keys(node.styles ?? {}).length`
- Returns triggered + issue when `count > threshold`
- Default threshold: 15
- Does not use metrics (deterministic from node structure alone)

## QA Test Plan

Test file: `tests/unit/rules/inline-style-count.test.ts`

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | 5 styles, threshold 10 | not triggered |
| 2 | Happy | 10 styles, threshold 10 (at boundary) | not triggered |
| 3 | Happy | 11 styles, threshold 10 | triggered, warning, message contains "11" and "10" |
| 4 | Edge | no `styles` property | not triggered |
| 5 | Edge | empty `styles: {}` | not triggered |
| 6 | Edge | 200 styles, threshold 10 | triggered, message contains "200" |
| 7 | Edge | threshold 0, 1 style | triggered |
| 8 | Failure | default threshold, 0 styles | not triggered |
| 9 | Unknown | varying metrics, same node | result identical |

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, expected behavior defined |
| QA Validation | PASS | 2 happy, 4 edge, 1 failure, 1 unknown test cases |
| Dev Validation | PASS | Pure function, no DOM, no randomness, no `any`, O(1) per node |
| Test Coverage | PASS | 9/9 tests pass, 135/135 total suite passes |

Overall: PASS
