---
id: "D12"
title: "Rule catalog sync — register 5 missing engine rules in dashboard lib"
type: feature
priority: 2
status: ready
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
