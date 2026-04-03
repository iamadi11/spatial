---
id: D02
title: "Engine adapter layer (src/lib/engine.ts)"
type: infra
priority: 1
status: ready
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
