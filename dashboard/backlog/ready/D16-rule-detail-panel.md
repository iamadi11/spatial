---
id: "D16"
title: "Rule detail panel (expandable details + Try in Playground link on /rules)"
type: feature
priority: 4
status: ready
created: 2026-04-04
sot-section: "Section 16.6"
depends-on: "D03, D04, D15"
---

## PM Plan

**Problem**: The `/rules` page shows a grid of `RuleCard` components with name, description, severity badge, and threshold. A developer who wants to understand exactly what a rule detects — or immediately test it with a real component tree — must leave the rules page and manually construct JSON in the playground. There is no connection between the rule catalog and the playground.

**Goal**: Add an expandable detail section to each `RuleCard` that shows additional rule context and a "Try in Playground" link that navigates to `/analyze` with the URL pre-populated (or simply navigates, since the playground already has preset examples).

**Scope**:
- Each `RuleCard` gains a toggle button ("Show details" / "Hide details")
- Expanded state reveals: full description (already present, but possibly truncated in card), default threshold value, severity explanation ("warning = investigate, error = critical")
- A "Try in Playground →" `<Link>` navigates to `/analyze` (no pre-population needed — presets cover the exploration use-case)
- Toggle state is local to each card (`useState`) — no global state
- Button and link have `aria-label` / `aria-expanded` attributes
- `RuleCard` receives no new props — all new content derives from existing `RuleMetadata`

**Non-goals**:
- No URL pre-population with rule-specific trees (presets in D13 cover exploration)
- No code samples or documentation embeds
- No external links
- No changes to `getRuleCatalog()` or the engine

**Done when**: Each `RuleCard` has a toggle button, expanded state shows threshold + severity explanation + playground link, tests verify toggle behaviour and accessibility attributes.
