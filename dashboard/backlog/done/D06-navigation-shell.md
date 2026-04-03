---
id: D06
title: "Navigation shell (sidebar linking all pages)"
type: feature
priority: 3
status: done
depends-on: D03, D05
---

## PM Plan

**Problem**: The two pages (Rule Catalog, Analysis Playground) have no navigation between them. The app has no shell, no consistent header, no routing.

**Goal**: Add React Router, a sidebar layout, and wire all pages together into a coherent single-page app.

**Scope**:
- Install `react-router-dom`
- `src/components/Sidebar.tsx` — nav links to `/rules` and `/analyze`
- `src/components/AppShell.tsx` — layout wrapper: sidebar left, page content right
- `src/App.tsx` — router setup with `<Routes>`

**Routes**:
| Path | Page |
|------|------|
| `/` | Redirect to `/rules` |
| `/rules` | Rule Catalog Page |
| `/analyze` | Analysis Playground Page |

**Non-goals**: No authentication. No breadcrumbs. No mobile responsive layout (desktop-first at 1280px).

**Sidebar content**:
- App name: "Spatial Dashboard"
- Link: Rules (icon: list)
- Link: Analyze (icon: play)
- Footer: engine version from `../../VERSION`

**Done when**: Both pages are reachable via sidebar links and the active link is visually highlighted.

## QA Test Plan

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | Sidebar rendered | Shows "Spatial Dashboard" |
| 2 | Happy | Sidebar rendered | Both nav links present |
| 3 | Edge | Rules link | href="/rules" |
| 4 | Edge | Analyze link | href="/analyze" |
| 5 | Failure | Sidebar footer | Shows engine version (semver) |
| 6 | Happy | AppShell with children | Sidebar + children both rendered |
| 7 | Unknown | AppShell with null children | Renders without crash |
| 8 | Happy | App at "/" | Redirects to Rule Catalog page |
| 9 | Happy | App at "/rules" | Renders Rule Catalog heading |
| 10 | Edge | App at "/analyze" | Renders Analysis Playground heading |

Test file: `tests/unit/navigation-shell.test.tsx` — 10 tests, all passing.

## Implementation Plan

- `src/components/Sidebar.tsx`: app name, NavLink for /rules and /analyze (active=indigo), engine version footer. Version hardcoded as `0.8.1`.
- `src/components/AppShell.tsx`: flex layout — Sidebar left (w-52), scrollable content right
- `src/App.tsx`: Routes — `/` → Navigate to `/rules`, `/rules` → RuleCatalogPage, `/analyze` → AnalysisPlaygroundPage, wrapped in AppShell
- `src/main.tsx`: added BrowserRouter wrapper

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| Component Gate | PASS | Sidebar and AppShell are isolated, typed props |
| Dev Gate | PASS | No any, strict TS, engine calls only in src/lib/ |
| Visual Gate | PASS | Sidebar nav links, active highlighting via NavLink, ARIA label on nav |

Overall: PASS
