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
