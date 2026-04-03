---
id: D06
title: "Navigation shell (sidebar linking all pages)"
type: feature
priority: 3
status: ready
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
