# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
