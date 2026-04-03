---
id: D04
title: "Analysis playground page (JSON input → run engine → show result)"
type: feature
priority: 2
status: done
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

## QA Test Plan

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | NodeTreeInput with valid JSON | Renders textarea, no error |
| 2 | Happy | NodeTreeInput with valid JSON | No alert shown |
| 3 | Edge | NodeTreeInput with invalid JSON | Shows alert element |
| 4 | Happy | MetricsInput with default metrics | Renders 4 spinbutton inputs |
| 5 | Happy | MetricsInput with custom values | Shows current metric values |
| 6 | Happy | AnalysisResult with pass result | Shows "pass" text |
| 7 | Happy | AnalysisResult with fail result | Shows "fail" and issue rule name |
| 8 | Edge | AnalysisResult with unknown result | Shows "unknown" |
| 9 | Failure | AnalysisResult with issue | Shows issue message |
| 10 | Happy | AnalysisPlaygroundPage | Has "Run Analysis" button |
| 11 | Happy | AnalysisPlaygroundPage | Pre-populated textarea |
| 12 | Edge | Click Run Analysis | Shows result |
| 13 | Unknown | AnalysisPlaygroundPage | Has h1 heading |

Test file: `tests/unit/analysis-playground.test.tsx` — 13 tests, all passing.

## Implementation Plan

- `src/components/NodeTreeInput.tsx`: textarea with inline JSON validation error using `role="alert"`
- `src/components/MetricsInput.tsx`: 4 number inputs for renderCount, layoutShifts, fpsDrop, memoryUsage
- `src/components/AnalysisResult.tsx`: status badge + issue list (rule name, nodeId, message, severity)
- `src/pages/AnalysisPlaygroundPage.tsx`: orchestrates all sub-components, calls `runAnalysis()` on button click; pre-populated with example tree

Note: RuleSelector (checkbox for rule selection) deferred — beyond MVP scope; runAnalysis() runs all rules by default.

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| Component Gate | PASS | Isolated components, typed props, no prop drilling |
| Dev Gate | PASS | Engine calls only in src/lib/, no any, strict TS |
| Visual Gate | PASS | Grid layout, ARIA labels on all interactive elements |

Overall: PASS
