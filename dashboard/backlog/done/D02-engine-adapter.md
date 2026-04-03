---
id: D02
title: "Engine adapter layer (src/lib/engine.ts)"
type: infra
priority: 1
status: done
depends-on: D01
---

## PM Plan

**Problem**: Components must never call the spatial engine directly — that would scatter engine coupling across the UI. All engine interaction must be isolated in `src/lib/`.

**Goal**: Create `src/lib/engine.ts` with typed adapter functions that wrap the spatial engine. Components call these adapters; they never import from `../src/` themselves.

**Scope**:
- `runAnalysis(root, metrics, ruleOptions) → PerformanceResult`
- `getRuleCatalog() → RuleMetadata[]` — returns name, description, severity, defaultThreshold for all 10 rules
- Re-export engine types needed by components (`PerformanceResult`, `PerformanceIssue`, `ComponentNode`, `PerformanceMetrics`)

**Non-goals**: No UI. No React. Pure TypeScript functions only.

**Done when**: `getRuleCatalog()` returns all 10 rules and `runAnalysis()` returns a valid `PerformanceResult`.

## QA Test Plan

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | `getRuleCatalog()` called | Returns array of 10 items |
| 2 | Happy | each catalog entry | Has `name`, `description`, `severity`, `defaultThreshold` |
| 3 | Edge | catalog called twice | Same names in same order (deterministic) |
| 4 | Edge | catalog names | Contains all 10 known rule names |
| 5 | Happy | clean node + base metrics | `runAnalysis` returns `pass` |
| 6 | Happy | high renderCount | Returns `fail` with render-count issue |
| 7 | Edge | custom renderCountThreshold | Overrides default threshold |
| 8 | Edge | invalid metrics (negative) | Returns `unknown` |
| 9 | Failure | expensive CSS property | Flags style-complexity issue |
| 10 | Unknown | any valid input | Result always includes metrics |

Test file: `tests/unit/engine-adapter.test.ts` — 10 tests, all passing.

## Implementation Plan

- `src/lib/engine.ts` created with:
  - `getRuleCatalog()`: returns static `RULE_CATALOG` array of 10 `RuleMetadata` objects
  - `runAnalysis(root, metrics, options)`: registers 8 node-level rules via registry, runs 2 tree-level rules (nesting-depth, total-node-count) separately, merges issues
  - Re-exports `ComponentNode`, `PerformanceResult`, `PerformanceIssue`, `PerformanceMetrics` from `@engine/types`
- Note: `nesting-depth` and `total-node-count` use a `check(root)` interface rather than `detect(node, metrics)`, handled explicitly outside the registry

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown per category — all passing |
| Dev Validation | PASS | No DOM, no any, pure functions, strict TS, engine calls only in src/lib/ |
| Test Coverage | PASS | 10/10 tests pass, no skipped tests |

Overall: PASS
