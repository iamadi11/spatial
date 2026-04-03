---
id: "018"
title: "Inline style count detection rule (flag components with excessive inline styles)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Components with many inline style properties incur rendering overhead — the browser must parse and apply each property individually on every render. This is distinct from `style-complexity` (which checks for specific expensive property names) and from `prop-count` (which checks the props object). A component with 30 inline style declarations is costly even if none of the properties are individually "expensive".

**Goal**: Add a rule that flags any `ComponentNode` whose `styles` object has more keys than a configurable threshold, regardless of which properties they are.

**Scope**: Read `Object.keys(node.styles).length` — pure, deterministic, no DOM.

**Non-goals**: Do not inspect property names or values (that is `style-complexity`'s job). Do not overlap with prop-count.

**Expected behavior**:
- `Object.keys(styles).length > threshold` → triggered, severity `warning`
- `styles` absent or within threshold → not triggered
