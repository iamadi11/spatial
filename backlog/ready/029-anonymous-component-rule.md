---
id: "029"
title: "Anonymous component detection rule (flag unnamed component types)"
type: rule
priority: 4
status: ready
created: 2026-04-04
sot-section: "Section 4.2.2, 7, 12"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Components whose `type` field is empty, `"Anonymous"`, or matches minified patterns (e.g. `"_c0"`, `"Component"`) are nearly impossible to profile or debug. React DevTools cannot name them, engine issue messages reference them by a generic name, and engineers cannot act on the report. Detecting these at analysis time prompts engineers to add `displayName` before shipping.

**Goal**: Add an `anonymous-component` rule that flags any `ComponentNode` whose `type` string is empty, equals `"Anonymous"`, equals `"Component"`, or is ≤ 2 characters (minified names), triggering a warning with the node ID.

**Scope**:
- Pure function rule in `src/rules/anonymous-component.ts`
- Checks `node.type` only — no metrics required
- Triggers a `warning` severity issue pointing engineers to add `displayName`
- Unit tests in `tests/unit/rules/anonymous-component.test.ts`

**Non-goals**:
- Does not automatically insert `displayName` (SOT 12: no auto-fixing)
- Does not flag valid short component names like `"A"` used intentionally — threshold configurable
- Does not inspect React fiber internals
- Does not use any browser or DOM API

**Done when**: Rule file created, all tests pass (happy path, empty type, minified name, edge cases), rule is pure and deterministic.
