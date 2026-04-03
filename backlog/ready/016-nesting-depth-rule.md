---
id: "016"
title: "Nesting depth detection rule (flag deeply nested component trees)"
type: rule
priority: 4
status: ready
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: Deeply nested component trees increase reconciliation time proportionally. SOT 4.2.2 explicitly lists "Nested layouts" and "deeply nested components" as required edge cases. The engine must flag trees that exceed a maximum nesting depth threshold.

**Goal**: Add a rule that computes the depth of a node relative to the root and flags nodes that exceed a configurable depth threshold.

**Scope**: Depth is passed as a node-level metric — the engine provides it during traversal. Pure computation, no DOM.

**Non-goals**: Do not restructure the component tree. Do not compute depth from within the rule by re-traversing (that would violate O(n) traversal constraint).

**Implementation note**: This rule requires the engine to pass `depth` alongside metrics, or the traversal layer to annotate nodes with depth. This is a small, bounded engine change — one additional field threaded through the traversal.

**Expected behavior**:
- Node depth > threshold → triggered, severity `warning`
- Node depth within threshold → not triggered
