# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.13.0] - 2026-04-03

### Added
- [027] Large data prop rule: `createLargeDataPropRule(thresholdBytes=10_000)` — flags nodes whose non-function props serialise to more than threshold bytes; circular references handled safely; function props excluded

## [0.12.0] - 2026-04-03

### Added
- [026] Duplicate component type rule: `createDuplicateComponentTypeRule(threshold=30)` — tree-level rule that flags Pascal-cased component types appearing more than threshold times; HTML tags ignored; O(n) single-pass traversal

## [0.11.0] - 2026-04-03

### Added
- [025] Event handler count rule: `createEventHandlerCountRule(threshold=5)` — flags components with more function-valued props than threshold

## [0.10.0] - 2026-04-03

### Added
- [024] SpatialProvider: `createSpatialHandler()` + `useSpatial()` in `src/adapters/index.ts` — wires fiber adapter, metrics adapter, and engine together; posts `PerformanceResult` to `globalThis.__SPATIAL__` after every render; dev-only, zero prod overhead

## [0.9.2] - 2026-04-03

### Added
- [023] Metrics adapter: `collectMetrics(renderCount)` — collects PerformanceMetrics from PerformanceObserver (layout-shift), rAF FPS sampling, and performance.memory; dev-only guard; resets via `resetMetrics()`

## [0.9.1] - 2026-04-03

### Added
- [022] React fiber adapter: `extractTree(fiber)` — walks a React fiber tree and returns a `ComponentNode` tree the core engine can consume; dev-only guard, read-only access, function props omitted

## [0.9.0] - 2026-04-03

### Added
- [021] Report summary formatter: `formatReport(result)` — renders a complete `PerformanceResult` as a human-readable multi-line text block

## [0.8.2] - 2026-04-03

### Added
- [020] Rule catalog: `createRuleCatalog()` — returns structured metadata (name, description, severity, defaultThreshold) for all 10 built-in rules

## [0.8.1] - 2026-04-03

### Changed
- [019] `style-complexity` rule: expanded expensive property detection to include `animation`, `transition`, and `willChange` (improved measurement accuracy per SOT Section 12)

## [0.8.0] - 2026-04-03

### Added
- [018] Inline style count detection rule: `createInlineStyleCountRule(threshold?)` — flags components with excessive inline style declarations per SOT Section 4.2.2

## [0.7.0] - 2026-04-03

### Added
- [017] Total node count detection rule: `countNodes(root)` + `createTotalNodeCountRule(threshold?)` — flags oversized component trees per SOT Section 4.2.2

## [0.6.0] - 2026-04-03

### Added
- [016] Nesting depth detection rule: `computeMaxDepth(root)` + `createNestingDepthRule(threshold?)` — flags deeply nested component trees per SOT Section 4.2.2; tree-level checker preserves O(n) traversal

## [0.5.0] - 2026-04-03

### Added
- [015] Style complexity detection rule: `createStyleComplexityRule()` — flags components with expensive CSS properties (boxShadow, filter, backdropFilter, transform, clipPath) per SOT Section 4.2.3

## [0.4.0] - 2026-04-03

### Added
- [014] Prop count detection rule: `createPropCountRule(threshold?)` — flags prop-heavy components per SOT Section 4.2.2

## [0.3.0] - 2026-04-03

### Added
- [013] Child count detection rule: `createChildCountRule(threshold?)` — flags components with excessive direct children per SOT Section 4.2.2

## [0.2.0] - 2026-04-02

### Added
- [012] Issue formatter: `formatIssue()` and `formatIssues()` — deterministic structured text output for `PerformanceIssue[]` per SOT Section 5.2 and 9

## [0.1.4] - 2026-04-02

### Added
- [011] Metrics caching layer: `createMetricsCache()` factory and `buildCacheKey()` helper — prevents redundant rule evaluation per SOT Section 11

## [0.1.3] - 2026-04-02

### Added
- [010] Memory usage detection rule: `createMemoryUsageRule(threshold?)` — flags memory anomalies (default 100MB threshold)

## [0.1.2] - 2026-04-02

### Added
- [009] FPS drop detection rule: `createFpsDropRule(threshold?)` — flags frame rate degradation, never assumes baseline FPS per SOT 6.1

## [0.1.1] - 2026-04-02

### Added
- [008] Layout shift detection rule: `createLayoutShiftRule(threshold?)` — flags layout instability per SOT Section 6.3

## [0.1.0] - 2026-04-02

### Added
- [007] Render count detection rule: `createRenderCountRule(threshold?)` — flags excessive re-renders per SOT Section 6.3

## [0.0.6] - 2026-04-02

### Added
- [006] Unknown handler: `unknownResult(reason)` — centralised SOT Section 9 compliant UNKNOWN result builder

## [0.0.5] - 2026-04-02

### Added
- [005] Engine core: `analyze(root, metrics, registry)` — walks component tree, runs all rules, returns deterministic PerformanceResult

## [0.0.4] - 2026-04-02

### Added
- [004] Rule registry: `createRegistry()` factory with `register` and `runAll` — SOT Section 7 compliant rule execution pipeline

## [0.0.3] - 2026-04-02

### Added
- [003] Component tree traversal: `walkTree` and `collectNodes` — O(n) depth-first traversal of ComponentNode trees

## [0.0.2] - 2026-04-02

### Added
- [002] Core type definitions: `ComponentNode`, `PerformanceMetrics`, `PerformanceIssue`, `PerformanceResult` types matching SOT Section 5 contracts

## [0.0.1] - 2026-04-02

### Added
- [001] Project configuration (tsconfig + vitest): TypeScript strict mode config and vitest test framework setup
