---
id: "020"
title: "Rule catalog (structured metadata export for all built-in rules)"
type: infra
priority: 3
status: done
created: 2026-04-03
sot-section: "Section 5.2, Section 7"
depends-on: "004"
---

## PM Plan

**Problem**: The engine has 8 detection rules across multiple files, but there is no programmatic way to enumerate them or learn what they detect, what their default thresholds are, or what severity they produce. Consumers of the engine have to read source files to discover this. This is an output contract gap — the engine cannot describe itself.

**Goal**: Add a `createRuleCatalog()` function that returns a structured array of `RuleMetadata` objects describing each built-in rule: its name, description, default threshold (if applicable), and severity.

**Scope**: Pure data — no computation, no DOM, no runtime. A single `src/rule-catalog.ts` file exporting a typed catalog. Fully deterministic.

**Non-goals**: Do not render HTML. Do not create a UI. Do not auto-register rules into the engine (that remains the caller's responsibility). Do not fetch external data.

**Expected behavior**:
- `createRuleCatalog()` returns an array of `RuleMetadata` entries, one per built-in rule
- Each entry has: `name`, `description`, `severity`, and optionally `defaultThreshold`
- The catalog is a pure value — same output every call
- Covers all 8 current rules: render-count, layout-shift, fps-drop, memory-usage, child-count, prop-count, style-complexity, inline-style-count
  - Plus the 2 tree-level rules: nesting-depth, total-node-count

## Implementation Plan

**File**: `src/rule-catalog.ts`

**Types**:
```ts
type RuleMetadata = {
  name: string
  description: string
  severity: 'warning' | 'error'
  defaultThreshold?: number   // absent for style-complexity (uses property set)
}
```

**Function**: `createRuleCatalog(): RuleMetadata[]`
- Returns a static array of 10 entries — one per rule
- Pure value, no computation

## QA Test Plan

Test file: `tests/unit/rule-catalog.test.ts`

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | call | returns non-empty array |
| 2 | Happy | call | length === 10 |
| 3 | Happy | each entry | name + description + severity all present |
| 4 | Happy | names | all 10 rule names present |
| 5 | Edge | threshold rules (9) | defaultThreshold is a positive number |
| 6 | Edge | style-complexity | defaultThreshold is undefined |
| 7 | Edge | all names | no duplicates |
| 8 | Failure | two calls | output is identical (deterministic) |
| 9 | Unknown | entry shapes | plain objects, no functions |

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, expected behavior defined |
| QA Validation | PASS | 4 happy, 3 edge, 1 failure, 1 unknown test cases |
| Dev Validation | PASS | Pure function, no DOM, no randomness, no `any`, O(1) |
| Test Coverage | PASS | 9/9 tests pass, 147/147 total suite passes |

Overall: PASS
