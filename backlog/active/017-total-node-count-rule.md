---
id: "017"
title: "Total node count detection rule (flag oversized component trees)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.2, Section 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: SOT 4.2.2 explicitly calls out "Very large component trees" as a required edge case. The existing rules catch two dimensions — `child-count` flags wide trees (too many direct children) and `nesting-depth` flags deep trees — but neither catches total tree size. A tree that is moderately wide and moderately deep can still be very large overall, yet evade both existing rules.

**Goal**: Add a rule that computes the total number of nodes in the component tree and flags it when the count exceeds a configurable threshold.

**Scope**: O(n) traversal to count all nodes — pure, deterministic, no DOM. Tree-level checker (same pattern as `nesting-depth`).

**Non-goals**: Do not distinguish node types. Do not combine with depth or width metrics.

**Expected behavior**:
- `totalNodes > threshold` → returns a `PerformanceIssue` (severity `warning`)
- `totalNodes <= threshold` → returns `null`
