---
id: "026"
title: "Duplicate component type detection rule (flag component types repeated excessively)"
type: rule
priority: 3
status: active
created: 2026-04-03
sot-section: "Section 4.2.2, 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: When the same component type appears many times in a tree (e.g., 100 `<ListItem>` nodes), it strongly suggests the list should be virtualised. The engine currently detects total node count but cannot identify that a single type is responsible for the bulk of the tree — missing a more actionable signal.

**Goal**: Add `src/rules/duplicate-component-type.ts` — a tree-level rule that counts occurrences of each component type across the entire tree and flags any type that appears more than a threshold number of times.

**Scope**:
- `createDuplicateComponentTypeRule(threshold = 30): Rule` — tree-level check using `check(root)` pattern (same as nesting-depth and total-node-count rules)
- Counts occurrences of each `.type` string in a single O(n) pass
- Flags the first node of the most-repeated type that exceeds threshold
- Severity `'warning'`, message `'Component type "X" appears N times (threshold: T) — consider virtualisation'`

**Non-goals**: Do not attempt to detect React.memo usage. Do not flag HTML tag types (only component names — first char uppercase). Do not suggest specific virtualisation libraries.

**Done when**: `createDuplicateComponentTypeRule()` detects trees where one component type appears more than 30 times, returns a single warning issue, and all tests pass.

## QA Test Plan

| # | Type | Input | Expected |
|---|------|-------|----------|
| H1 | Happy | 31 ListItem children, threshold=30 | warning with "ListItem" and "31" in message |
| H2 | Happy | 5 ListItem children, threshold=30 | null |
| E1 | Edge | exactly 10 nodes, threshold=10 | null (> not >=) |
| E2 | Edge | custom threshold=5, 6 Row nodes | triggers |
| E3 | Edge | 100 `div` nodes (lowercase) | null — HTML tags ignored |
| E4 | Edge | 6 Row + 3 Card, threshold=5 | flags Row only |
| F1 | Failure | root with no children | null |
| F2 | Failure | all unique types | null |
| U1 | Unknown | rule.name | 'duplicate-component-type' |
| U2 | Unknown | 6 Row nodes across nested levels | still detected (full O(n) traversal) |
