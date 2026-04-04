---
id: "D15"
title: "Playground threshold editor (per-rule threshold overrides on /analyze)"
type: feature
priority: 3
status: ready
created: 2026-04-04
sot-section: "Section 16.6"
depends-on: "D04, D12"
---

## PM Plan

**Problem**: The `/analyze` playground runs `runAnalysis()` with default thresholds for all 15+ rules. A developer who wants to understand *when* a rule fires (e.g., "what if I lower the render-count threshold to 2?") has no way to explore threshold sensitivity without editing source code. The `RuleOptions` type in `dashboard/src/lib/engine.ts` already supports per-threshold overrides, but the playground UI exposes no controls to set them.

**Goal**: Add a collapsible "Advanced: Rule Thresholds" panel to the `/analyze` playground that renders a numeric input for each configurable threshold in `RuleOptions`. When expanded, the user can override any threshold before clicking "Run Analysis". The `runAnalysis()` call passes the collected overrides as the third argument.

**Scope**:
- New `ThresholdEditor` component in `dashboard/src/components/ThresholdEditor.tsx`
- Renders a labeled number input for each threshold in `RuleOptions` (renderCountThreshold, layoutShiftThreshold, etc.)
- Empty inputs = use engine default (undefined in `RuleOptions`)
- Wrapped in a `<details>` / `<summary>` collapsible panel labelled "Advanced: Rule Thresholds"
- `AnalysisPlaygroundPage` passes the collected thresholds to `runAnalysis()` as the third argument
- All inputs have `aria-label` attributes
- No changes to `runAnalysis()` or `lib/engine.ts`

**Non-goals**:
- No persistence of threshold overrides (reset on page reload)
- No slider UI — plain number inputs only
- No per-rule enable/disable toggles
- No changes to the engine or `RuleOptions` type

**Done when**: `ThresholdEditor` renders, each input updates the corresponding `RuleOptions` field, `runAnalysis()` receives the overrides, and tests verify inputs are present and affect results.
