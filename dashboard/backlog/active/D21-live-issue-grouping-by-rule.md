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
