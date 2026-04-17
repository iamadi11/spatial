---
id: "D21"
title: "Issue grouping by rule on /live (collapse flat list into rule groups)"
type: feature
priority: 3
status: active
created: 2026-04-17
sot-section: "Section 16.6"
depends-on: "D07"
---

## PM Plan

**Problem**: The /live page shows a flat list of issues. When 30+ issues fire across many rules, the list is overwhelming and hard to scan.

**Goal**: Group issues by rule name with collapsible sections, showing count per group.

**Scope**:
- Group flat `PerformanceIssue[]` by `rule` field
- Render each group as a collapsible section header: rule name + count badge
- Groups expanded by default; click header to collapse
- No change to engine or lib layer

**Non-goals**: Sorting, filtering, persistent state

**Done when**:
- Issues grouped by rule name with header + count
- Each group toggles open/closed on click
- All existing tests pass

## QA Test Plan

**Happy path**:
1. Empty issues renders "no issues" message
2. Groups by rule showing count badge per group
3. Issues visible by default (expanded)

**Edge cases**:
1. Clicking expanded header collapses it (hides issues)
2. Clicking collapsed header re-expands it
3. Collapsing one group doesn't affect others

**Failure cases**:
1. Error-severity issues render within their group correctly

**Accessible**: Group buttons have aria-expanded

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all present |
| QA Validation | PASS | 8 tests covering happy/edge/failure/accessible |
| Dev Validation | PASS | No DOM APIs; no `any`; strict TS; pure groupByRule helper |
| Test Coverage | PASS | 16 test files, 160 tests all passing; tsc --noEmit clean |

Overall: PASS
