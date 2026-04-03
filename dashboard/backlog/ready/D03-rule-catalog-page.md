---
id: D03
title: "Rule catalog page (list all rules with metadata)"
type: feature
priority: 2
status: ready
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
