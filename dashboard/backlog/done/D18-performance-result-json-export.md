---
id: "D18"
title: "PerformanceResult JSON copy and download (structured export)"
type: feature
priority: 3
status: done
created: 2026-04-09
sot-section: "Section 16.3, 16.6"
depends-on: "D02, D17"
---

## PM Plan

**Problem**: D09 added human-readable report copy (`formatReport`). Developers often need the raw `PerformanceResult` object for diffs, bug reports, or tooling — without retyping JSON from the UI.

**Goal**: On the examples flow where analysis results are shown (e.g. alongside `LiveAnalysisCard` / `ResultDetailView` patterns), add actions to **copy** and **download** the current `PerformanceResult` as pretty-printed JSON, using data obtained only via `dashboard/src/lib/engine.ts` (no new detection logic).

**Scope**:
- Reusable UI control(s) with accessible labels (e.g. “Copy analysis JSON”, “Download analysis JSON”) placed where `PerformanceResult` is already available (examples sections or shared result footer — follow existing layout/components)
- Copy: `navigator.clipboard.writeText` in a user gesture (dashboard may use browser APIs; not in engine core)
- Download: client-side `Blob` + temporary `<a download>` or equivalent, filename like `spatial-result.json`
- Strict TypeScript, no `any`; engine imports only from `dashboard/src/lib/engine.ts` for any helper that wraps `runAnalysis` if needed
- Tests in `dashboard/tests/` for the new component(s) (render, button presence, mock clipboard where appropriate)

**Non-goals**:
- No backend, persistence, or telemetry
- No new routes unless strictly necessary (prefer extending existing examples/result UI)
- No changes to engine rules or `PerformanceResult` shape

**Done when**: Users can copy and download the structured JSON for a run’s `PerformanceResult` from the dashboard; tests pass; visual/accessibility gates satisfied for new controls.

## QA Test Plan

- **Happy path 1**: `formatPerformanceResultJson` round-trips through `JSON.parse` to the same object
- **Happy path 2**: Component renders group “Analysis JSON export” with “Copy analysis JSON” and “Download JSON” buttons (accessible names)
- **Happy path 3**: Copy click writes pretty-printed JSON to clipboard and shows “JSON copied!”
- **Edge case 1**: Download creates a `Blob`, `URL.createObjectURL`, triggers `<a download="spatial-result.json">` click, revokes URL
- **Failure case**: `clipboard.writeText` rejection does not throw
- **Unknown case**: `unknown` status with `reason` serializes in copied JSON

## Implementation Plan

- Added `formatPerformanceResultJson()` in `dashboard/src/lib/engine.ts`
- Added `PerformanceResultJsonActions` in `dashboard/src/components/PerformanceResultJsonActions.tsx` (copy + download)
- Wired into `LiveAnalysisCard` so every examples analysis card exposes JSON actions
- Tests: `dashboard/tests/unit/performance-result-json-export.test.tsx`
- Fixed unused-prop TypeScript errors in `RerenderSection.tsx` (required for `tsc --noEmit`)

## Validation Report

Date: 2026-04-09

| Gate | Status | Notes |
|------|--------|--------|
| PM Validation | PASS | Problem, scope, non-goals, done-when present |
| Component Gate | PASS | Typed props, `aria-label` on controls, group label |
| Dev Gate | PASS | Engine types/helpers from `lib/engine.ts` only; no `any` |
| Visual Gate | PASS | Buttons match existing muted chip styling |

Overall: PASS
