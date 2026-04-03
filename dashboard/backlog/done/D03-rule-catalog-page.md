---
id: D03
title: "Rule catalog page (list all rules with metadata)"
type: feature
priority: 2
status: done
depends-on: D02
---

## PM Plan

**Problem**: Users have no way to discover what rules the engine provides — what each one detects, what threshold it uses, and how severe its issues are. They have to read source files.

**Goal**: Build a `/rules` page that renders a card for every rule returned by `getRuleCatalog()`. Each card shows: rule name, description, default threshold (if any), and severity badge.

**Scope**: `src/pages/RuleCatalogPage.tsx` + `src/components/RuleCard.tsx`. Data comes exclusively from `src/lib/engine.ts → getRuleCatalog()`.

**Non-goals**: No editing of thresholds. No filtering/search (can be a future item). No detection logic.

**Component structure**:
```
RuleCatalogPage
  └── RuleCard (×N — one per rule)
        ├── Rule name (heading)
        ├── Description (paragraph)
        ├── Threshold badge (if applicable)
        └── Severity badge (warning=yellow, error=red)
```

**Done when**: All 10 rules render as cards with correct metadata.

## QA Test Plan

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | `<RuleCard rule={warningRule} />` | Renders rule name |
| 2 | Happy | `<RuleCard rule={warningRule} />` | Renders description text |
| 3 | Edge | warning severity | Renders "warning" badge |
| 4 | Edge | error severity | Renders "error" badge |
| 5 | Failure | threshold > 0 | Renders threshold value |
| 6 | Unknown | threshold = 0 | Renders without crash |
| 7 | Happy | `<RuleCatalogPage />` | Renders known rule names |
| 8 | Happy | `<RuleCatalogPage />` | Has an h1 heading |
| 9 | Edge | full page render | All 10 rule names visible |

Test file: `tests/unit/rule-catalog.test.tsx` — 9 tests, all passing.

## Implementation Plan

- `src/components/RuleCard.tsx`: displays name, description, severity badge (yellow/red), threshold (only if > 0). ARIA label on article element.
- `src/pages/RuleCatalogPage.tsx`: calls `getRuleCatalog()` from `src/lib/engine`, renders grid of `RuleCard` per rule with h1 heading.

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| Component Gate | PASS | Isolated components, typed props (RuleMetadata), no prop drilling |
| Dev Gate | PASS | Engine calls only in src/lib/, no any, strict TS |
| Visual Gate | PASS | Grid layout, accessible ARIA labels, severity badges |

Overall: PASS
