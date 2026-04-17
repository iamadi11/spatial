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
