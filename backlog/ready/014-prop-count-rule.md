---
id: "014"
title: "Prop count detection rule (flag prop-heavy components)"
type: rule
priority: 3
status: ready
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Components with an excessive number of props are a known re-render risk — every parent re-render propagates all props down. SOT 4.2.2 requires edge cases like large component trees to be detected. Prop count is a direct, deterministic proxy for this risk.

**Goal**: Add a rule that flags any `ComponentNode` whose `props` object has more keys than a configurable threshold.

**Scope**: Read `Object.keys(node.props).length` — pure, deterministic, no DOM.

**Non-goals**: Do not inspect prop values. Do not infer whether props change at runtime.

**Expected behavior**:
- `Object.keys(props).length > threshold` → triggered, severity `warning`
- `props` absent or within threshold → not triggered
