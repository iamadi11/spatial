---
id: "D08"
title: "Issue severity filter on Analysis Playground page"
type: feature
priority: 3
status: ready
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
