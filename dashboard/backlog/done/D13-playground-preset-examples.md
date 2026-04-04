---
id: "D13"
title: "Playground preset examples (one-click load passing/failing example trees)"
type: feature
priority: 3
status: active
created: 2026-04-04
sot-section: "Section 16.6"
depends-on: "D04"
---

## PM Plan

**Problem**: The `/analyze` playground opens with an empty JSON textarea and a blank metrics form. New developers exploring the tool don't know what valid `ComponentNode` JSON looks like, what a realistic `PerformanceMetrics` input contains, or how to produce a failing vs. passing result. The tool is fully functional but hard to discover.

**Goal**: Add two preset buttons ("Passing example" and "Failing example") that populate both the component tree input and the metrics input with realistic example data, letting developers immediately see the engine in action without typing any JSON.

**Scope**:
- Two hardcoded preset objects (passing tree + metrics, failing tree + metrics) defined as constants in `AnalysisPlaygroundPage.tsx`
- Two buttons rendered above or below the inputs: "Load passing example" and "Load failing example"
- Clicking either button populates both the `nodeTree` and `metrics` state (overwriting any existing input)
- The presets are chosen to produce illustrative results: the failing preset triggers at least 2 different rules
- Buttons have `aria-label` attributes

**Non-goals**:
- No persistence of preset choice (session or localStorage)
- No custom preset creation UI
- No changes to `NodeTreeInput` or `MetricsInput` components — state is lifted in `AnalysisPlaygroundPage`
- No changes to the engine

**Done when**: Both preset buttons render, clicking each populates the inputs with valid JSON, and tests verify the preset data is well-formed and produces the expected result type (pass/fail).

## QA Test Plan

**Happy path 1**: "Load passing example" button renders with aria-label
**Happy path 2**: "Load failing example" button renders with aria-label
**Edge case 1**: clicking "Load passing example" populates textarea with valid JSON
**Edge case 2**: clicking "Load failing example" populates textarea with valid JSON
**Failure case**: running after loading failing example produces status "fail"
**Unknown case**: running after loading passing example produces status "pass"

## Implementation Plan

- Added `PASSING_PRESET_TREE/METRICS` and `FAILING_PRESET_TREE/METRICS` constants to `AnalysisPlaygroundPage.tsx`
- Added `loadPassingExample()` and `loadFailingExample()` handlers (set json, metrics, clear result/error)
- Added two preset buttons above the grid with `aria-label` attributes
- Failing preset triggers `render-count` (50) and `boolean-prop-overload` (6 booleans)

## Validation Report

Date: 2026-04-04

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when present |
| Component Gate | PASS | State lifted in page, no component changes |
| Dev Gate | PASS | No engine calls in components, no `any`, strict TS |
| Visual Gate | PASS | Buttons have aria-labels, no layout issues |

Overall: PASS
