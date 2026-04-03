---
id: "019"
title: "Expand style-complexity expensive property set (improved measurement accuracy)"
type: perf
priority: 4
status: done
created: 2026-04-03
sot-section: "Section 12 (improved measurement accuracy), Section 4.2.3"
depends-on: "015"
---

## PM Plan

**Problem**: The current `style-complexity` rule detects 5 expensive CSS properties (`boxShadow`, `filter`, `backdropFilter`, `transform`, `clipPath`). Three additional well-documented GPU paint and compositing triggers are missing: `animation`, `transition`, and `willChange`. Omitting them reduces detection accuracy — components using these properties will pass undetected despite carrying the same performance risk.

**Goal**: Expand the `EXPENSIVE_PROPERTIES` set in `src/rules/style-complexity.ts` to include `animation`, `transition`, and `willChange`. This is purely an accuracy improvement to an existing rule — no new interface, no new file.

**Scope**: Edit the static `Set` in `style-complexity.ts`. Add 3 test cases. SOT 12 explicitly allows "improved measurement accuracy of existing rules".

**Non-goals**: Do not evaluate property values. Do not add runtime detection. Do not change the rule's interface or output format.

**Expected behavior** (unchanged interface, expanded detection):
- `styles` contains `animation`, `transition`, or `willChange` → triggered, same as existing expensive properties
- Existing behavior for all 5 current properties is preserved

## Implementation Plan

**File**: `src/rules/style-complexity.ts` (edit only — no new files)

**Change**: Add `'animation'`, `'transition'`, `'willChange'` to the `EXPENSIVE_PROPERTIES` Set.

No interface changes. No new exports.

## QA Test Plan

Tests added to: `tests/unit/rules/style-complexity.test.ts`

| # | Type | Input | Expected |
|---|------|-------|----------|
| 10 | New prop | `animation` in styles | triggered, message contains "animation" |
| 11 | New prop | `transition` in styles | triggered, message contains "transition" |
| 12 | New prop | `willChange` in styles | triggered, message contains "willChange" |

(Existing 9 tests remain unchanged and continue to pass)

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, expected behavior defined |
| QA Validation | PASS | 3 new tests for the 3 new properties; all 12 style-complexity tests pass |
| Dev Validation | PASS | Pure static set expansion only — no DOM, no randomness, no `any` |
| Test Coverage | PASS | 12/12 style-complexity tests pass, 138/138 total suite passes |

Overall: PASS
