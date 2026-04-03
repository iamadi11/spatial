---
id: "014"
title: "Prop count detection rule (flag prop-heavy components)"
type: rule
priority: 3
status: done
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Components with an excessive number of props are a known re-render risk — every parent re-render propagates all props down. SOT 4.2.2 requires edge cases like large component trees to be detected. Prop count is a direct, deterministic proxy for this risk.

**Goal**: Add a rule that flags any `ComponentNode` whose `props` object has more keys than a configurable threshold.

**Scope**: Read `Object.keys(node.props).length` — pure, deterministic, no DOM.

**Non-goals**: Do not inspect prop values. Do not infer whether props change at runtime.

**Expected behavior**:
- `Object.keys(props).length > threshold` → triggered, severity `warning`
- `props` absent or within threshold → not triggered

## Implementation Plan

**File**: `src/rules/prop-count.ts`

**Function**: `createPropCountRule(threshold?: number): Rule`
- Reads `Object.keys(node.props ?? {}).length`
- Returns triggered + issue when `count > threshold`
- Default threshold: 15
- Does not use metrics

## QA Test Plan

Test file: `tests/unit/rules/prop-count.test.ts`

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | 5 props, threshold 10 | not triggered |
| 2 | Happy | 10 props, threshold 10 (at boundary) | not triggered |
| 3 | Happy | 11 props, threshold 10 | triggered, warning, message contains "11" |
| 4 | Edge | no `props` property | not triggered |
| 5 | Edge | empty `props: {}` | not triggered |
| 6 | Edge | 500 props, threshold 10 | triggered, message contains "500" |
| 7 | Edge | threshold 0, 1 prop | triggered |
| 8 | Failure | default threshold, 0 props | not triggered |
| 9 | Unknown | varying metrics, same node | result identical |

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, expected behavior defined |
| QA Validation | PASS | 2 happy, 4 edge, 1 failure, 1 unknown test cases |
| Dev Validation | PASS | Pure function, no DOM, no randomness, no `any`, O(1) per node |
| Test Coverage | PASS | 9/9 tests pass, 92/92 total suite passes |

Overall: PASS
