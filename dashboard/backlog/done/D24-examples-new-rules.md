---
id: "D24"
title: "Interactive examples for prop-drilling, missing-key, and fragment rules"
type: feature
priority: 2
status: active
created: 2026-04-17
sot-section: "Section 16.6"
depends-on: "D23"
---

## QA Test Plan

**Happy path 1**: PropDrillingSection renders title "Prop Drilling" with Bad Pattern / Good Pattern panels.
**Happy path 2**: Slider at depth=5 (default) → bad panel shows `fail`; slider set to 2 → bad panel shows `pass`.
**Happy path 3**: MissingKeySection bad panel (no key props) shows `fail`; good panel (with key props) shows `pass`.
**Happy path 4**: FragmentSection bad panel (Fragment with 1 child) shows `fail`; good panel (direct child) shows `pass`.
**Edge case 1**: ExamplesPage renders 3 new nav buttons with correct aria-labels.
**Edge case 2**: Clicking each nav button activates the corresponding section heading.
**Failure case**: Components only import from `lib/engine`, never from `@engine` directly.
**Unknown case**: All demos use safe metrics (renderCount=1, all others=0) so only the target rule fires.

## Implementation Plan

Files created/modified:
- `dashboard/src/lib/engine.ts` — added imports + registry entries for `missing-key-prop`, `fragment-single-child` (node-level); `prop-drilling-depth` as tree-level rule; 3 new `RULE_CATALOG` entries; `propDrillingDepthThreshold` option
- `dashboard/src/components/examples/sections/PropDrillingSection.tsx` — slider (1–6, default 5) controls chain depth; bad tree drills `userId` through N levels; good tree is flat
- `dashboard/src/components/examples/sections/MissingKeySection.tsx` — bad tree: 4 `ListItem` children without key props; good tree: same with key props
- `dashboard/src/components/examples/sections/FragmentSection.tsx` — bad tree: `Fragment` with 1 `ProfileCard` child; good tree: `ProfileCard` directly
- `dashboard/src/pages/ExamplesPage.tsx` — `SectionId` extended to 8 entries; 3 new `SECTIONS` entries with emoji, label, and component
- Regression fixes: `RerenderSection.tsx` and `UnvirtualizedListSection.tsx` demo trees given `key` props on same-type children (were silently broken before `missing-key-prop` was registered)
- `dashboard/tests/unit/engine-adapter.test.ts` — updated rule count assertion 20 → 23

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 15 tests: 5 PropDrilling + 3 MissingKey + 3 Fragment + 4 ExamplesPage integration |
| Dev Validation | PASS | No `any`, no DOM APIs, engine calls only via `lib/engine.ts`, strict TS |
| Test Coverage | PASS | 182 dashboard tests pass, 299 engine tests pass |

Overall: PASS

## PM Plan

**Problem**: The /examples page has 5 sections covering patterns behind rules 007–034. Rules 035 (`prop-drilling-depth`), 036 (`missing-key-prop`), and 037 (`fragment-single-child`) were added to the engine but have no corresponding interactive examples on the dashboard. Developers who are confused about these rules have no visual demonstration.

**Goal**: Add 3 new interactive example sections — one per rule — following the established bad/good pattern with live engine analysis.

**Scope**:
- `PropDrillingSection.tsx` — bad: slider (1–6) controls drilling depth; `prop-drilling-depth` fires when depth > 3. Good: flat props via context-style component structure.
- `MissingKeySection.tsx` — bad: toggle showing same-type children without keys; `missing-key-prop` fires. Good: same children with keys present.
- `FragmentSection.tsx` — bad: single-child Fragment wrapper; `fragment-single-child` fires. Good: Fragment removed, child rendered directly.
- Each section follows the `ExampleSection` + `LiveAnalysisCard` pattern established in D23
- Wire all 3 into `ExamplesPage.tsx` as new nav buttons

**Non-goals**: Testing engine rules in these components (the engine tests already cover that), persistence of demo state

**Done when**:
- 3 new section components exist with bad/good demos and live engine analysis
- Each bad demo crosses its respective rule threshold and shows `fail`
- Each good demo stays at `pass`
- ExamplesPage nav shows 3 new buttons with accessible aria-labels
- All existing tests still pass
