---
id: "D23"
title: "Live interactive examples — engine analyzes real demo state"
type: feature
priority: 1
status: done
status: active
created: 2026-04-17
sot-section: "Section 16.6, 16.3"
depends-on: "D17"
---

## PM Plan

**Problem**: The /examples page passes hardcoded static ComponentNode trees and PerformanceMetrics to the engine. The analysis never changes as users interact — it's theatre, not a live demonstration. This undermines the product's core claim of "real-time detection".

**Goal**: Every example demo builds its ComponentNode tree and PerformanceMetrics from actual React component state. When the user interacts (clicks a button, drags a slider), the engine re-analyzes the live data and the output updates immediately.

**Scope**:
- `ExampleSection.tsx`: remove `tree`/`metrics` from `Side` type; the `demo` ReactNode now owns its own `LiveAnalysisCard`
- All 5 section files: embed `LiveAnalysisCard` inside each demo component with live tree/metrics
- RerenderSection: useRef render counter drives renderCount metric — crosses threshold after 6+ clicks
- WrapperHellSection: slider controls nesting depth; single-child-chain fires when depth > 4
- PropExplosionSection: slider controls boolean prop count; boolean-prop-overload fires when > 5, prop-count fires when > 15
- UnvirtualizedListSection: slider controls item count; child-count fires > 20, unvirtualized-list fires > 50
- DeepNestingSection: slider controls tree depth; nesting-depth fires when > 10

**Non-goals**:
- No changes to the engine rules or core
- No changes to LiveAnalysisCard component itself
- No changes to /live, /rules, /analyze pages
- No server-side rendering or data persistence

**Done when**: Every example's LiveAnalysisCard output changes in real-time as users interact with the demo. The engine issues that appear/disappear are driven by actual component state, not hardcoded values.

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| QA Validation | PASS | 25 tests: render, threshold-crossing, slider interaction, pass/fail transitions |
| Dev Validation | PASS | Engine calls only via LiveAnalysisCard; no `any`; strict TS; no DOM in lib/ |
| Test Coverage | PASS | 140/140 dashboard tests pass; tsc --noEmit clean |

Overall: PASS
