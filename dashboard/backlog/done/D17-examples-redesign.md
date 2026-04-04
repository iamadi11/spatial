---
id: "D17"
title: "Examples page — bad vs good React patterns with live engine analysis"
type: feature
priority: 2
status: done
created: 2026-04-04
sot-section: "Section 16.3, 16.6"
depends-on: "D03, D04, D07, D16"
---

## PM Plan

**Problem**: The dashboard had two disconnected pages — a manual JSON playground (/analyze) and a live bridge page (/live) that required SpatialProvider installed in a real app. Neither page taught users what bad patterns look like or how to fix them. The playground required users to craft ComponentNode JSON manually — too much friction. The live page showed nothing until SpatialProvider was wired up.

**Goal**: Replace both pages with a single /examples page that shows 5 real-world React performance anti-patterns (bad code) alongside their correct counterparts (good code), with live engine analysis running on each. Users immediately understand what the engine detects and how to fix it — no setup required.

**Scope**:
- /examples page with left section navigation (5 sections)
- Each section: title + description + two-column bad vs good layout
- Each column: real React code snippet + live demo component + engine analysis card
- 5 sections: Excessive Re-renders, Wrapper Hell, Prop Explosion, Unvirtualized List, Deep Nesting
- Engine analysis runs directly (no bridge, no JSON input)
- Remove /analyze and /live routes and all their supporting components
- Update sidebar nav: remove Analyze + Live, add Examples
- RuleCard "Try in Playground" link updated to /examples

**Non-goals**:
- No bridge/window.__SPATIAL__ dependency
- No JSON input from user
- No threshold editor
- No clipboard export in this page
- No code editor (read-only code display only)

**Done when**: /examples renders 5 sections with bad/good comparison, engine analysis visible on each, old pages removed, all tests pass.

## QA Test Plan

**Happy path 1**: ExamplesPage renders with section nav and defaults to first section (Re-renders)
**Happy path 2**: clicking a section nav button switches the active section content
**Edge case 1**: all 5 section nav buttons are present and accessible
**Edge case 2**: bad analysis card shows "fail" status; good analysis card shows "pass" status
**Failure case**: section nav buttons have correct aria-label attributes
**Unknown/deterministic**: same section always renders same analysis result (engine is pure)

## Implementation Plan

1. Created `ExampleSection.tsx` — reusable bad/good two-column layout with header, demo slot, code block, analysis card
2. Created `CodeBlock.tsx` — pre-formatted code display with label
3. Created `LiveAnalysisCard.tsx` — runs runAnalysis() synchronously, shows status + issues
4. Created 5 section components in `components/examples/sections/`
5. Created `ExamplesPage.tsx` — section nav + active section content
6. Updated `App.tsx` — removed /analyze and /live, added /examples
7. Updated `Sidebar.tsx` — removed Analyze/Live nav items, added Examples
8. Updated `RuleCard.tsx` — link updated from /analyze to /examples
9. Deleted: AnalysisPlaygroundPage.tsx, LiveAnalysisPage.tsx, NodeTreeInput.tsx, MetricsInput.tsx, ThresholdEditor.tsx, AnalysisResult.tsx, live.ts
10. Updated engine.ts — added boolean-prop-overload, single-child-chain, memo-candidate rules
11. Updated tests: navigation-shell, rule-detail-panel; deleted old test files; added examples-page tests

## Validation Report

Date: 2026-04-04

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 2 happy paths, 2 edge cases, 1 failure, 1 unknown |
| Dev Validation | PASS | Pure engine calls only in lib/, strict types, ARIA labels |
| Test Coverage | PASS | All tests pass |

Overall: PASS
