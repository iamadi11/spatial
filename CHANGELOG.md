# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [dash-0.16.0] - 2026-04-17

### Added
- [D20] Live issue history timeline — `/live` page added with a ring buffer (max 50 entries) of `PerformanceResult` snapshots. Polls `window.__SPATIAL__` every 500ms; deduplicates by timestamp; renders as an expandable table showing time, status badge, and issue count per row. Clicking a row expands inline issue detail. Sidebar now links to `/live`.

## [dash-0.15.0] - 2026-04-17

### Changed
- [D23] Examples page — all 5 sections now use live, interactive analysis. Each demo builds its `ComponentNode` tree and `PerformanceMetrics` from actual React state; the engine re-analyzes on every interaction and the output updates in real-time.
  - **RerenderSection**: `useRef` render counter drives `renderCount` metric — engine flags `render-count` after 6 button clicks
  - **WrapperHellSection**: slider (1–12) controls nesting depth — `single-child-chain` fires when depth > 4
  - **PropExplosionSection**: slider (0–15) controls boolean prop count — `boolean-prop-overload` fires at > 5, `prop-count` fires at > 15 total
  - **UnvirtualizedListSection**: slider (5–300) controls item count — `child-count` fires at > 20, `unvirtualized-list` fires at > 50
  - **DeepNestingSection**: slider (1–15) controls tree depth — `nesting-depth` fires when > 10
- `ExampleSection` no longer accepts static `tree`/`metrics` props — analysis is owned by each demo component

## [0.20.0] - 2026-04-09

### Added
- [034] `classname-token-sprawl` rule — flags string `props.className` when whitespace-separated token count exceeds 30 or trimmed length exceeds 400 (configurable); non-string `className` ignored; registered in dashboard adapter with `classnameTokenSprawlMaxTokens` / `classnameTokenSprawlMaxLength` overrides

## [dash-0.14.0] - 2026-04-09

### Added
- [D19] Home landing page at `/` (`HomePage`) — overview copy plus links to Rule catalog and Examples; sidebar **Home** link with `NavLink end`; engine version label set to 0.19.0

## [0.19.0] - 2026-04-09

### Added
- [033] `multi-type-sibling-fanout` rule — flags parents with ≥10 direct children and ≥6 distinct child component types (kitchen-sink renders); `createMultiTypeSiblingFanoutRule({ minDirectChildren, minDistinctTypes })`; registered in dashboard `runAnalysis` with optional `RuleOptions` overrides; tests in `tests/unit/rules/multi-type-sibling-fanout.test.ts`

## [dash-0.13.0] - 2026-04-09

### Added
- [D18] PerformanceResult JSON export: `formatPerformanceResultJson()` in `dashboard/src/lib/engine.ts`; `PerformanceResultJsonActions` (Copy analysis JSON / Download JSON) on every `LiveAnalysisCard` on `/examples`; tests in `dashboard/tests/unit/performance-result-json-export.test.tsx`

### Fixed
- `RerenderSection` demo components: remove unused destructured props so `tsc --noEmit` passes

## [dash-0.12.0] - 2026-04-04

### Added
- [D17] Examples page (`/examples`): replaces `/analyze` and `/live` with a 5-section bad-vs-good pattern explorer — Excessive Re-renders, Wrapper Hell, Prop Explosion, Unvirtualized List, Deep Nesting; each section has a left-nav, interactive demo, real code snippet, and live engine analysis card running directly in the browser
- Engine adapter now registers `boolean-prop-overload`, `single-child-chain`, `memo-candidate` rules (3 previously missing rules added to dashboard)

### Removed
- `/analyze` Analysis Playground page (JSON input UX removed)
- `/live` Live Analysis page (bridge-dependent page removed)
- `ThresholdEditor`, `NodeTreeInput`, `MetricsInput`, `AnalysisResult` components
- `live.ts` bridge reader (no longer needed)

## [dash-0.11.0] - 2026-04-04

### Added
- [D16] Rule detail panel: `RuleCard` gains a "Show details" / "Hide details" toggle button with `aria-expanded`; expanded panel shows severity explanation ("warning = investigate" / "error = critical") and a "Try in Playground →" link to `/analyze`; toggle state is local (`useState`), no new props, all content from existing `RuleMetadata`

## [0.18.0] - 2026-04-04

### Added
- [032] Single-child chain rule: `createSingleChildChainRule(threshold)` — tree-level rule that detects consecutive single-child wrapper nodes (wrapper hell); chain includes wrappers + leaf, resets at 2+-child nodes; default threshold 4 (chain of 5+ triggers); O(n), pure

## [dash-0.10.0] - 2026-04-04

### Added
- [D15] Playground threshold editor: `ThresholdEditor` collapsible panel on `/analyze` with a numeric input per `RuleOptions` key; empty inputs revert to engine default; `runAnalysis()` receives overrides as third arg; all inputs have `aria-label`

## [0.17.0] - 2026-04-04

### Added
- [031] Memo candidate rule: `createMemoCandidateRule(renderCountThreshold, childrenThreshold)` — flags nodes where BOTH `renderCount > threshold` (default 3) AND `children.length > threshold` (default 3); compound signal for React.memo candidates; pure, O(1)

## [dash-0.9.0] - 2026-04-04

### Added
- [D14] Live page last-updated indicator: tracks `lastUpdatedAt` state, shows "Last updated Xs ago" relative label updating every 1s; applies `animate-pulse` for 600ms when bridge timestamp changes; "Waiting for data…" shown before first snapshot

## [dash-0.8.0] - 2026-04-04

### Added
- [D13] Playground preset examples: "Load passing example" and "Load failing example" buttons populate both component tree and metrics inputs; failing preset triggers render-count + boolean-prop-overload (at least 2 rules); buttons have `aria-label` attributes

## [0.16.0] - 2026-04-04

### Added
- [030] Boolean prop overload rule: `createBooleanPropOverloadRule()` — flags components with more boolean props than the threshold (default 5); counts `typeof val === 'boolean'` at top level only; pure structural check, metrics unused; warns with count in message

## [dash-0.7.0] - 2026-04-04

### Changed
- [D12] Rule catalog sync: registered 5 missing engine rules (`event-handler-count`, `duplicate-component-type`, `large-data-prop`, `unvirtualized-list`, `anonymous-component`) in `runAnalysis()` and `RULE_CATALOG`; dashboard now exposes all 15 engine rules; added 4 new `RuleOptions` threshold fields

## [dash-0.6.0] - 2026-04-04

### Added
- [D11] Metrics bar display: `MetricsBarDisplay` component renders 4 horizontal bars (renderCount, layoutShifts, fpsDrop, memoryUsage); bar width proportional to per-metric max; colour-coded green/amber/red by threshold proximity; numeric value shown next to each bar; `aria-label` on region and each bar row; integrated into `ResultDetailView` replacing the plain metrics table

## [0.15.0] - 2026-04-04

### Added
- [029] Anonymous component rule: `createAnonymousComponentRule()` — flags components whose `type` is empty, equals `"Anonymous"` or `"Component"`, or is ≤ 2 characters (minified names); HTML elements (lowercase) are never flagged; pure structural check, metrics unused

## [dash-0.5.0] - 2026-04-04

### Added
- [D10] Rule catalog search and filter: text search input (case-insensitive substring) and severity filter buttons (All / warning / error) on the `/rules` page; filters combine with AND logic; filtered count label "Showing N of M rules"; all filter buttons have `aria-pressed` state

## [0.14.0] - 2026-04-04

### Added
- [028] Unvirtualized list rule: `createUnvirtualizedListRule(threshold=50)` — flags nodes whose immediate children contain more than threshold siblings of the same component type, indicating a likely unvirtualized list; O(n) via type-count map; metrics unused (structural check only)

## [dash-0.4.0] - 2026-04-03

### Added
- [D09] Report text export: `CopyReportButton` component — calls `formatReport(result)` from engine and writes to `navigator.clipboard`; shows "Copied!" confirmation for 1.5s; integrated into `ResultDetailView` status banner; accessible `aria-label`; clipboard errors silently swallowed

## [dash-0.3.0] - 2026-04-03

### Added
- [D08] Issue severity filter: `SeverityFilter` component with All/Errors/Warnings toggle; integrated into `ResultDetailView` with `useState` filter, filtered count badge "N of M issues", and `aria-pressed` active state; filter hidden when result has no issues

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
