---
id: "D19"
title: "Home landing page at / (Spatial overview + links to Rules and Examples)"
type: feature
priority: 4
status: ready
created: 2026-04-09
sot-section: "Section 16.3, 16.6"
depends-on: "D01, D06"
---

## PM Plan

**Problem**: `/` immediately redirects to `/rules`, so new users never see a concise product overview or a clear choice between **Rule catalog** and **Examples**. Discoverability of `/examples` relies on the sidebar alone.

**Goal**: Replace the bare redirect with a small **home** view at `/` that explains Spatial in one short paragraph and offers two primary actions (navigate to `/rules` and `/examples`), using existing layout (`AppShell` / `Sidebar`) and Tailwind patterns.

**Scope**:
- New page component (e.g. `dashboard/src/pages/HomePage.tsx`) with heading, short description, and two links or buttons with `aria-label`s
- Update `App.tsx` routes: `/` renders `HomePage` instead of `<Navigate to="/rules" />`; optional redirect from old behavior documented in non-goals if we keep `/` as real page only
- Add a **Home** or **Overview** item to the sidebar (`Sidebar.tsx`) linking to `/`, with `aria-current` when active
- Tests in `dashboard/tests/` for presence of links and accessible names

**Non-goals**:
- No engine imports beyond what other pages use (none required for static landing — no `runAnalysis` on home unless explicitly desired; default is static copy only)
- No backend, analytics, or new data sources
- No redesign of `/rules` or `/examples`

**Done when**: Visiting `/` shows the landing content; sidebar includes entry to home; navigation to Rules and Examples works; dashboard tests pass and `tsc` passes.
