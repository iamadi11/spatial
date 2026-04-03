---
id: "020"
title: "Rule catalog (structured metadata export for all built-in rules)"
type: infra
priority: 3
status: ready
created: 2026-04-03
sot-section: "Section 5.2, Section 7"
depends-on: "004"
---

## PM Plan

**Problem**: The engine has 8 detection rules across multiple files, but there is no programmatic way to enumerate them or learn what they detect, what their default thresholds are, or what severity they produce. Consumers of the engine have to read source files to discover this. This is an output contract gap — the engine cannot describe itself.

**Goal**: Add a `createRuleCatalog()` function that returns a structured array of `RuleMetadata` objects describing each built-in rule: its name, description, default threshold (if applicable), and severity.

**Scope**: Pure data — no computation, no DOM, no runtime. A single `src/rule-catalog.ts` file exporting a typed catalog. Fully deterministic.

**Non-goals**: Do not render HTML. Do not create a UI. Do not auto-register rules into the engine (that remains the caller's responsibility). Do not fetch external data.

**Expected behavior**:
- `createRuleCatalog()` returns an array of `RuleMetadata` entries, one per built-in rule
- Each entry has: `name`, `description`, `severity`, and optionally `defaultThreshold`
- The catalog is a pure value — same output every call
- Covers all 8 current rules: render-count, layout-shift, fps-drop, memory-usage, child-count, prop-count, style-complexity, inline-style-count
  - Plus the 2 tree-level rules: nesting-depth, total-node-count
