---
id: "D12"
title: "Rule catalog sync — register 5 missing engine rules in dashboard lib"
type: feature
priority: 2
status: active
created: 2026-04-04
sot-section: "Section 16.6, 16.2"
depends-on: "D02"
---

## PM Plan

**Problem**: `dashboard/src/lib/engine.ts` was last updated at D02 (10 rules). Since then, 5 engine rules have been added (025–029) but were never registered in the dashboard's `runAnalysis()` or added to `RULE_CATALOG`. As a result:
- The `/rules` page shows 10 of 15 rules — 33% invisible
- The `/analyze` playground silently skips `event-handler-count`, `duplicate-component-type`, `large-data-prop`, `unvirtualized-list`, and `anonymous-component`
- Engineers analysing trees in the playground get incomplete results

This is a correctness gap, not a feature request.

**Goal**: Register all 5 missing rules in `runAnalysis()` and add their metadata to `RULE_CATALOG` so the dashboard reflects the full current engine capability.

**Scope**:
- Add imports for the 5 missing rule factories to `dashboard/src/lib/engine.ts`
- Register each rule in `runAnalysis()` via `registry.register(...)`
- Add a `RuleMetadata` entry for each rule in `RULE_CATALOG` (name, description, severity, defaultThreshold)
- Add corresponding `RuleOptions` fields for any configurable thresholds
- Update the existing rule-catalog test (currently hardcodes 10 rules) to expect 15

**Non-goals**:
- No changes to the engine itself (`src/`)
- No new pages or components
- No changes to `ResultDetailView` or `IssueCard`

**Done when**: `getRuleCatalog()` returns 15 rules, `runAnalysis()` fires all 15 rules, the `/rules` page displays all 15, and all existing tests pass.

## QA Test Plan

**Happy path 1**: `getRuleCatalog()` returns exactly 15 rules — input: none, expected: array of length 15
**Happy path 2**: All 5 new rule names appear in catalog — input: none, expected: names include `event-handler-count`, `duplicate-component-type`, `large-data-prop`, `unvirtualized-list`, `anonymous-component`
**Edge case 1**: `runAnalysis()` detects event handler count violation — input: node with 10 event handlers, expected: issue with rule `event-handler-count`
**Edge case 2**: `runAnalysis()` detects anonymous component — input: node with `type: ''`, expected: issue with rule `anonymous-component`
**Failure case**: `runAnalysis()` detects large data prop — input: node with prop value of 50,000 char string, expected: issue with rule `large-data-prop`
**Unknown case**: catalog metadata is deterministic — input: two calls to `getRuleCatalog()`, expected: same names both times

## Implementation Plan

1. Added imports for 5 rule factories: `createEventHandlerCountRule`, `createDuplicateComponentTypeRule`, `createLargeDataPropRule`, `createUnvirtualizedListRule`, `createAnonymousComponentRule`
2. Added 4 new `RuleOptions` fields for configurable thresholds
3. Added 5 `RuleMetadata` entries to `RULE_CATALOG`
4. Registered 4 node-level rules (`event-handler-count`, `large-data-prop`, `unvirtualized-list`, `anonymous-component`) in the registry
5. Added `duplicate-component-type` as a tree-level rule (like `nesting-depth`)
6. Updated test from 10 → 15 rules, added 3 new `runAnalysis` test cases

## Validation Report

Date: 2026-04-04

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| Component Gate | PASS | No new components; only `src/lib/engine.ts` modified |
| Dev Gate | PASS | Engine calls only in `src/lib/`, no `any`, strict TypeScript |
| Visual Gate | PASS | No UI changes; rules page auto-renders from `getRuleCatalog()` |

Overall: PASS
