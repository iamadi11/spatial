---
id: "036"
title: "Missing key prop detection rule (flag unkeyed list siblings)"
type: rule
priority: 3
status: active
created: 2026-04-17
sot-section: "Section 12, 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: React requires a unique `key` prop on sibling elements in a list. Without it, React cannot optimize reconciliation and may produce incorrect renders. The engine has no rule for this.

**Goal**: Add a `missing-key-prop` rule that flags parent nodes whose children lack `key` props, when there are 2+ same-type siblings.

**Scope**:
- Node-level rule: inspect each node's children
- Fire if 2+ children share the same `type` AND none of them have a `key` prop (checked via `props.key`)
- One issue per parent node that has unkeyed same-type children
- Returns severity: 'warning'
- Pure function, O(n), no DOM

**Non-goals**: Detecting invalid/duplicate keys, fragment key props, dynamic list detection

**Done when**:
- Rule flags parent with 2+ same-type children that all lack `key` props
- Rule returns null when children have different types (no list pattern)
- Rule returns null when same-type children have `key` props
- Tests cover happy/edge/failure/unknown

## Validation Report

Date: 2026-04-17

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when present |
| QA Validation | PASS | 8 tests: 2 happy, 4 edge, 1 failure, 1 determinism |
| Dev Gate | PASS | Pure function, no DOM, no randomness, O(n) |
| Test Coverage | PASS | 35 engine files, 291 tests all passing; tsc --noEmit clean |

Overall: PASS
