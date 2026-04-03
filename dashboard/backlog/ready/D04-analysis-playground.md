---
id: D04
title: "Analysis playground page (JSON input → run engine → show result)"
type: feature
priority: 2
status: ready
depends-on: D02
---

## PM Plan

**Problem**: There's no way to run the engine interactively. Developers have to write TypeScript to test it. A playground lowers the barrier to understanding what the engine detects and why.

**Goal**: Build an `/analyze` page with:
1. A JSON textarea for `ComponentNode` tree input
2. Number inputs for the 4 `PerformanceMetrics` fields
3. Checkboxes to select which rules to run
4. A "Run Analysis" button
5. The `PerformanceResult` displayed below on submission

**Scope**: `src/pages/AnalysisPlaygroundPage.tsx` + sub-components:
- `src/components/NodeTreeInput.tsx` — JSON textarea with parse error display
- `src/components/MetricsInput.tsx` — 4 number fields
- `src/components/RuleSelector.tsx` — checkbox list from `getRuleCatalog()`
- `src/components/AnalysisResult.tsx` — renders `PerformanceResult`

Engine called via `runAnalysis()` from `src/lib/engine.ts` only.

**Non-goals**: No auto-run on typing. No file upload. No saving results.

**Default state**: Pre-populated with a simple example tree and metrics so the page is useful immediately on load.

**Done when**: User can paste a JSON tree, set metrics, click Run, and see issues rendered.
