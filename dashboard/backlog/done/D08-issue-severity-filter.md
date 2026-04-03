---
id: "D08"
title: "Issue severity filter on Analysis Playground page"
type: feature
priority: 3
status: done
created: 2026-04-03
sot-section: "dashboard/SourceOfTruth.md Section 7 (UI improvements to existing pages)"
depends-on: "D05"
---

## PM Plan

**Problem**: When the engine returns many issues with mixed severities, developers have no way to focus on errors only or warnings only. All issues render as a flat list with no filtering, making triage slower on large component trees.

**Goal**: Add severity filter controls to the Analysis Playground page so developers can show all issues, errors only, or warnings only.

**Scope**:
- Filter toggle (`All` / `Errors` / `Warnings`) rendered above the issue list in `ResultDetailView` or `AnalysisPlaygroundPage`
- Filters apply to the rendered issue cards only — the underlying `PerformanceResult` is never mutated
- Filter state lives in local component state (`useState`)
- Issue count badge updates to reflect the filtered count (e.g. "2 of 5 issues")

**Non-goals**: Do not persist filter state across sessions. Do not add filtering to the Live Analysis page (D07) — that's a separate item if needed. Do not filter by rule name.

**Done when**: The playground page shows filter toggles and clicking them correctly shows/hides issues by severity with an updated count.

## QA Test Plan

**Happy path:**
- H1: SeverityFilter renders All, Errors, Warnings buttons
- H2: Clicking Errors calls onChange with 'error'
- H3: Clicking Warnings calls onChange with 'warning'
- H4: ResultDetailView — Errors filter hides warning issues
- H5: ResultDetailView — Warnings filter hides error issues
- H6: ResultDetailView — All filter shows all issues

**Edge cases:**
- E1: Active filter button has aria-pressed=true; others have aria-pressed=false
- E2: Issue counts displayed on each filter button
- E3: "N of M issues" count badge updates when filter changes

**Failure cases:**
- F1: No filter rendered when result has no issues

**Unknown cases:**
- U1: Errors button shows 0 count when result has only warnings

## Implementation Plan

1. `dashboard/src/components/SeverityFilter.tsx` — new component; renders three buttons (All/Errors/Warnings) with count badges; uses `aria-pressed` for active state
2. `dashboard/src/components/ResultDetailView.tsx` — adds `useState<'all'|'error'|'warning'>('all')` filter state; computes `filteredIssues` and `counts`; renders `SeverityFilter` + "N of M issues" heading above list; filter hidden when no issues

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| QA Validation | PASS | 6 happy, 3 edge, 1 failure, 1 unknown tests |
| Dev Validation | PASS | Isolated components, typed props, no `any`, engine calls only in `src/lib/` |
| Test Coverage | PASS | 81/81 tests passing, no skips |

Overall: PASS
