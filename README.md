# Client-Side UI Performance Optimizer

A deterministic, development-time UI performance detection engine that identifies potential performance bottlenecks before code ships.

**Version**: 0.2.0 | **Tests**: 74 passing | **Language**: TypeScript (strict)

---

## What it does

Analyzes a component tree against a set of configurable performance rules and returns a structured result — deterministically, with no DOM access and no guessing.

```ts
import { analyze } from './src/engine'
import { createRegistry } from './src/rule-registry'
import { createRenderCountRule } from './src/rules/render-count'
import { createFpsDropRule } from './src/rules/fps-drop'
import { formatIssues } from './src/issue-formatter'

const registry = createRegistry()
registry.register(createRenderCountRule())   // flag > 5 renders
registry.register(createFpsDropRule())       // flag > 10 fps drop

const result = analyze(
  { id: 'root', type: 'View', children: [{ id: 'btn', type: 'Button' }] },
  { renderCount: 8, layoutShifts: 1, fpsDrop: 0, memoryUsage: 40 },
  registry,
)

console.log(result.status)          // "fail"
console.log(formatIssues(result.issues))
// "[warning] render-count: Render count 8 exceeds threshold of 5 (node: root)"
```

---

## Architecture

```
src/
├── types.ts            — ComponentNode, PerformanceMetrics, PerformanceIssue, PerformanceResult
├── engine.ts           — analyze(root, metrics, registry) → PerformanceResult
├── traversal.ts        — walkTree, collectNodes (O(n) depth-first)
├── rule-registry.ts    — createRegistry() — register + runAll
├── unknown.ts          — unknownResult(reason) — SOT-compliant UNKNOWN builder
├── metrics-cache.ts    — createMetricsCache(), buildCacheKey() — per-run memoization
├── issue-formatter.ts  — formatIssue(), formatIssues() — structured text output
└── rules/
    ├── render-count.ts — createRenderCountRule(threshold?) — default: 5
    ├── layout-shift.ts — createLayoutShiftRule(threshold?) — default: 3
    ├── fps-drop.ts     — createFpsDropRule(threshold?)     — default: 10
    └── memory-usage.ts — createMemoryUsageRule(threshold?) — default: 100 MB
```

### Data flow

```
ComponentNode (tree)
       │
  collectNodes()          ← O(n) traversal
       │
  [node, node, ...]
       │
  registry.runAll(node, metrics)   ← per node, all rules
       │
  PerformanceIssue[]
       │
  analyze() → PerformanceResult { status, metrics, issues }
       │
  formatIssues() → string
```

---

## API Reference

### `analyze(root, metrics, registry)`

Walks the component tree, runs all registered rules against every node, and aggregates issues.

| Param | Type | Description |
|-------|------|-------------|
| `root` | `ComponentNode` | Root of the component tree |
| `metrics` | `PerformanceMetrics` | Measured values (renderCount, layoutShifts, fpsDrop, memoryUsage) |
| `registry` | `Registry` | Rule registry with rules pre-registered |

Returns `PerformanceResult`:
```ts
{
  status: 'pass' | 'fail' | 'unknown'
  metrics: PerformanceMetrics
  issues: PerformanceIssue[]
  reason?: string   // present when status is 'unknown'
}
```

Returns `status: 'unknown'` if any metric value is negative (SOT §2.3 — never guess).

---

### Detection Rules

All rules follow the factory pattern: `createXxxRule(threshold?)` → `Rule`.
Rules return `{ triggered: false }` for zero or negative metric values.
All thresholds use strictly-greater-than (`>`).

| Rule | Factory | Default threshold | Severity |
|------|---------|-------------------|----------|
| Render count | `createRenderCountRule(n?)` | 5 renders | `warning` |
| Layout shift | `createLayoutShiftRule(n?)` | 3 shifts | `warning` |
| FPS drop | `createFpsDropRule(n?)` | 10 frames | `error` |
| Memory usage | `createMemoryUsageRule(n?)` | 100 MB | `error` |

---

### `createRegistry()`

```ts
const registry = createRegistry()
registry.register(rule)                         // add a rule
registry.runAll(node, metrics)                  // → PerformanceIssue[]
```

---

### `createMetricsCache()` / `buildCacheKey()`

Per-run cache to avoid re-evaluating the same `(node, metrics)` pair.

```ts
const cache = createMetricsCache()
const key = buildCacheKey(node.id, metrics)
if (!cache.has(key)) {
  cache.set(key, analyze(node, metrics, registry))
}
const result = cache.get(key)
cache.clear()   // reset between analysis runs
```

---

### `formatIssues(issues)` / `formatIssue(issue)`

```ts
formatIssue(issue)   // "[warning] render-count: Too many renders (node: btn)"
formatIssues([])     // "No issues found."
formatIssues(issues) // newline-joined formatted issues
```

---

## Types

```ts
type ComponentNode = {
  id: string
  type: string
  props?: Record<string, unknown>
  children?: ComponentNode[]
  styles?: Record<string, string>
}

type PerformanceMetrics = {
  renderCount: number
  layoutShifts: number
  fpsDrop: number
  memoryUsage: number   // in MB
}

type PerformanceIssue = {
  rule: string
  severity: 'warning' | 'error'
  message: string
  nodeId: string
}

type PerformanceResult = {
  status: 'pass' | 'fail' | 'unknown'
  metrics: PerformanceMetrics
  issues: PerformanceIssue[]
  reason?: string
}
```

---

## Development

```bash
npm install
npm test               # run all tests (vitest)
npm run test:watch     # watch mode
npm run typecheck      # tsc --noEmit
```

### Autonomous development loop

```bash
/kickoff   # one-time: decompose SourceOfTruth.md into backlog items
/dev       # full autonomous loop: pick → plan → test → implement → validate → release
```

See `CLAUDE.md` for the full command reference.

---

## Constraints (SOT)

- **No DOM** — no `document`, `window`, or `navigator`
- **No randomness** — fully deterministic; same input always produces same output
- **Pure functions** — no side effects, no mutations, no global state
- **O(n) traversal** — no nested loops over the same node set
- **Unknown over guessing** — if metrics are invalid, returns `status: 'unknown'`

Governance: `SourceOfTruth.md` is immutable and takes precedence over all other instructions.
