---
id: "D26"
title: "Interactive examples for context-value-instability and recursive-component rules"
type: feature
priority: 2
status: ready
created: 2026-04-17
sot-section: "Section 16.6"
depends-on: "D24"
---

## PM Plan

**Problem**: Rules 038 (`context-value-instability`) and 039 (`recursive-component`) were added to the engine but have no corresponding interactive examples on the dashboard. Developers who encounter these issues have no visual demonstration of the bad vs good pattern.

**Goal**: Add 2 new interactive example sections — one per rule — following the established `ExampleSection` + `LiveAnalysisCard` bad/good pattern.

**Scope**:
- `ContextInstabilitySection.tsx` — bad: Provider node with an object `value` (new reference every render); `context-value-instability` fires. Good: same Provider with a string/primitive value (stable reference).
- `RecursiveComponentSection.tsx` — bad: tree where `TreeNode` appears as a descendant of another `TreeNode`; `recursive-component` fires. Good: a non-recursive tree with unique component types per level.
- Each section follows the `ExampleSection` + `LiveAnalysisCard` pattern established in D23/D24
- Wire both into `ExamplesPage.tsx` as new nav buttons with accessible aria-labels
- Register `context-value-instability` and `recursive-component` in `dashboard/src/lib/engine.ts` if not already present (check first)

**Non-goals**: Testing engine rules in these components (already tested), persistence of demo state, runtime recursion simulation

**Done when**:
- 2 new section components exist with bad/good demos and live engine analysis
- Bad demo crosses respective rule threshold and shows `fail`
- Good demo stays at `pass`
- ExamplesPage nav shows 2 new buttons with accessible aria-labels
- All existing tests still pass

## QA Test Plan

**Happy path 1**: ContextInstabilitySection renders "Context Value Instability" title, bad/good panels present.
**Happy path 2**: Bad panel (object value Provider) shows `fail`; good panel (string primitive) shows `pass`.
**Happy path 3**: RecursiveComponentSection renders "Recursive Component" title, bad/good panels present.
**Happy path 4**: Bad panel (TreeNode inside TreeNode) shows `fail`; good panel (unique types) shows `pass`.
**Edge case 1**: ExamplesPage renders nav buttons for both new sections with accessible aria-labels.
**Edge case 2**: Clicking nav buttons activates respective section heading.
**Failure case**: Sections only import from `lib/engine`, never from `@engine` directly.

## Implementation Plan

Files created/modified:
- `dashboard/src/lib/engine.ts` — added `createContextValueInstabilityRule` (node-level) + `createRecursiveComponentRule` (tree-level); 2 new RULE_CATALOG entries; count updated from 23→25
- `dashboard/src/components/examples/sections/ContextInstabilitySection.tsx` — bad: Provider with object value; good: Provider with string primitive
- `dashboard/src/components/examples/sections/RecursiveComponentSection.tsx` — bad: TreeNode inside TreeNode; good: TreeRoot→TreeBranch→TreeLeaf
- `dashboard/src/pages/ExamplesPage.tsx` — SectionId extended, 2 new SECTIONS entries
- `dashboard/tests/unit/examples-context-recursive.test.tsx` — 9 tests
- `dashboard/tests/unit/engine-adapter.test.ts` — count updated 23→25

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 9 tests covering both sections + ExamplesPage integration |
| Dev Validation | PASS | No `any`, no DOM, engine calls via lib/engine only, typed props |
| Test Coverage | PASS | 199 dashboard tests pass, 317 engine tests pass |

Overall: PASS
