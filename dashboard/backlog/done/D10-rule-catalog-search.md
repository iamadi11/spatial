---
id: "D10"
title: "Rule catalog search and filter (filter rules by name or severity)"
type: feature
priority: 3
status: done
created: 2026-04-04
sot-section: "Section 16.6"
depends-on: "D03"
---

## PM Plan

**Problem**: The `/rules` page lists all rules as a flat list. As the engine grows (currently 13 rules, more coming), engineers must scroll to find a specific rule or all rules of a given severity. There is no way to quickly locate a rule by name or filter to just `error`-severity rules.

**Goal**: Add a search input and severity filter to the Rule Catalog page so engineers can quickly find the rules they care about.

**Scope**:
- Search input (text) filters rules by `name` (case-insensitive substring match)
- Severity filter buttons (`all` | `warning` | `error`) filter by rule severity
- Filters are combined (search AND severity)
- Filtered count shown: "Showing N of 13 rules"
- All state is local to `RuleCatalogPage` (no URL params, no persistence)
- Component changes confined to `dashboard/src/pages/RuleCatalogPage.tsx`

**Non-goals**:
- No URL encoding of filter state
- No server-side filtering
- No sorting (alphabetical or otherwise)
- No changes to `src/lib/engine.ts` or the engine

**Done when**: Search and severity filter work correctly, filtered count displayed, all existing RuleCatalogPage tests still pass, new tests cover filter logic.
