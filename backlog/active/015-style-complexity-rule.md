---
id: "015"
title: "Style complexity detection rule (flag components with expensive CSS properties)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.3, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Certain CSS properties (e.g. `box-shadow`, `filter`, `backdrop-filter`, `transform`, `clip-path`) are GPU-compositing expensive and can trigger layout or paint cycles. SOT 4.2.3 lists "dynamic CSS" as a failure/risk case. The engine must flag components whose `styles` contain known expensive properties.

**Goal**: Add a rule that checks `node.styles` for a fixed set of expensive CSS property keys and flags the component when any are present.

**Scope**: Key-match against a static allowlist of expensive properties — pure, deterministic, no DOM.

**Non-goals**: Do not evaluate CSS values (e.g. `transform: none` is fine — value analysis is out of scope). Do not fetch external stylesheets.

**Expected behavior**:
- `styles` contains one or more expensive properties → triggered, severity `warning`, lists which properties
- `styles` absent or contains no expensive properties → not triggered
