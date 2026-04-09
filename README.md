# Spatial — UI performance detection engine

Deterministic, development-time analysis of component trees against configurable performance rules. Same inputs always yield the same `PerformanceResult` — no DOM access in the core engine.

| | |
|--|--|
| **Engine version** | See `VERSION` |
| **Engine tests** | Vitest (`npm test` at repo root) |
| **Dashboard** | React 18 + Vite app in `dashboard/` (`spatial-dashboard`; `npm run dev` in `dashboard/`) |
| **Language** | TypeScript strict (`tsconfig.json`) |

---

## Repository layout

- **Root** — pure engine (`src/`), shared `npm test` / `npm run typecheck`
- **`dashboard/`** — visualization, examples, and rule catalog UI; run `npm install` and `npm run dev` inside that folder

### Deploying to Vercel

The dashboard is a static Vite build. This repo includes `vercel.json` at the **repository root** so you can import the Git repo and deploy without extra configuration:

- **Install / build** — `npm ci` + `npm run build` run in `dashboard/` (the build resolves `@engine` to `../src`).
- **Output** — `dashboard/dist`.
- **Client routing** — rewrites send unknown paths to `index.html` for React Router (`/`, `/rules`, `/examples`).

**Alternative:** In the Vercel project, set **Root Directory** to `dashboard` and use `dashboard/vercel.json` (rewrites only). The default Vite build output is `dist` inside that directory.

---

## What it does

Analyzes a component tree with a rule registry and returns a structured result.

```ts
import { analyze } from './src/engine'
import { createRegistry } from './src/rule-registry'
import { createRenderCountRule } from './src/rules/render-count'
import { createFpsDropRule } from './src/rules/fps-drop'
import { formatIssues } from './src/issue-formatter'

const registry = createRegistry()
registry.register(createRenderCountRule()) // default: > 5 renders
registry.register(createFpsDropRule()) // default: > 10 fps drop

const result = analyze(
  { id: 'root', type: 'View', children: [{ id: 'btn', type: 'Button' }] },
  { renderCount: 8, layoutShifts: 1, fpsDrop: 0, memoryUsage: 40 },
  registry,
)

console.log(result.status) // "fail"
console.log(formatIssues(result.issues))
// "[warning] render-count: Render count 8 exceeds threshold of 5 (node: root)"
```

---

## Architecture

**Core** (`src/` — no browser APIs, pure functions):

```
src/
├── types.ts            — ComponentNode, PerformanceMetrics, PerformanceIssue, PerformanceResult
├── engine.ts           — analyze(root, metrics, registry) → PerformanceResult
├── traversal.ts        — collectNodes (O(n) depth-first)
├── rule-registry.ts    — createRegistry(), register, runAll
├── unknown.ts          — unknownResult(reason)
├── metrics-cache.ts    — per-run memoization helpers
├── issue-formatter.ts  — formatIssue, formatIssues
├── report-summary.ts   — formatReport(result) — full text report
├── rule-catalog.ts     — createRuleCatalog() — rule metadata for docs/UI
└── rules/              — one factory per rule (createXxxRule)
```

**Adapters** (`src/adapters/` — browser/React allowed, **dev-only**; guarded with `process.env.NODE_ENV !== 'production'`):

- `react.ts` — fiber → `ComponentNode` extraction (`extractTree`)
- `metrics.ts` — metric collection (`collectMetrics`)
- `index.ts` — `createSpatialHandler()`, `useSpatial()`, default registry wiring and `globalThis.__SPATIAL__`

### Data flow

```
ComponentNode (tree)
       │
  collectNodes()
       │
  registry.runAll(node, metrics)   ← per node, all registered rules
       │
  PerformanceIssue[]
       │
  analyze() → PerformanceResult { status, metrics, issues, reason? }
       │
  formatIssues() / formatReport()
```

---

## API reference

### `analyze(root, metrics, registry)`

Walks the tree, runs every registered rule on each node, aggregates issues.

| Param | Type | Description |
|-------|------|-------------|
| `root` | `ComponentNode` | Root of the component tree |
| `metrics` | `PerformanceMetrics` | `renderCount`, `layoutShifts`, `fpsDrop`, `memoryUsage` (MB) |
| `registry` | `Registry` | Rules registered via `createRegistry()` |

Returns `PerformanceResult`:

```ts
{
  status: 'pass' | 'fail' | 'unknown'
  metrics: PerformanceMetrics
  issues: PerformanceIssue[]
  reason?: string // when status is 'unknown'
}
```

Invalid metrics (e.g. negative values) yield `status: 'unknown'` per product rules — the engine does not guess.

### Detection rules

Factories live in `src/rules/`. Thresholds use strict `>` unless noted. Rules that only inspect structure may ignore metrics.

| Rule | Factory | Default | Severity |
|------|---------|---------|----------|
| render-count | `createRenderCountRule(n?)` | 5 | warning |
| layout-shift | `createLayoutShiftRule(n?)` | 3 | warning |
| fps-drop | `createFpsDropRule(n?)` | 10 | error |
| memory-usage | `createMemoryUsageRule(n?)` | 100 MB | error |
| child-count | `createChildCountRule(n?)` | 20 | warning |
| prop-count | `createPropCountRule(n?)` | 15 | warning |
| inline-style-count | `createInlineStyleCountRule(n?)` | 15 | warning |
| nesting-depth | `createNestingDepthRule(n?)` | 10 | warning |
| total-node-count | `createTotalNodeCountRule(n?)` | 200 | warning |
| style-complexity | `createStyleComplexityRule()` | fixed CSS property set | warning |
| memo-candidate | `createMemoCandidateRule(render?, children?)` | 3 renders, 3 children | warning |
| anonymous-component | `createAnonymousComponentRule()` | — | warning |
| boolean-prop-overload | `createBooleanPropOverloadRule(n?)` | 5 | warning |
| event-handler-count | `createEventHandlerCountRule(n?)` | 5 | warning |
| duplicate-component-type | `createDuplicateComponentTypeRule(n?)` | 30 | warning |
| unvirtualized-list | `createUnvirtualizedListRule(n?)` | 50 | warning |
| single-child-chain | `createSingleChildChainRule(n?)` | 4 | warning |
| large-data-prop | `createLargeDataPropRule(bytes?)` | 10_000 bytes | warning |

`createRuleCatalog()` in `rule-catalog.ts` returns descriptive metadata for a curated subset (used by tooling and the dashboard); new rule files may exist before catalog entries are extended.

### `createRegistry()`

```ts
const registry = createRegistry()
registry.register(rule)
registry.runAll(node, metrics) // → PerformanceIssue[]
```

### `createMetricsCache()` / `buildCacheKey()`

Per-run cache to avoid re-evaluating the same `(node, metrics)` pair.

### `formatIssues` / `formatIssue` / `formatReport`

```ts
formatIssue(issue)
formatIssues([]) // "No issues found."
formatIssues(issues) // newline-separated
formatReport(result) // status, metrics, reason, issues block
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
  memoryUsage: number // MB
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

**Engine (repository root)**

```bash
npm install
npm test               # vitest
npm run test:watch
npm run typecheck      # tsc --noEmit
```

**Dashboard**

```bash
cd dashboard
npm install
npm test -- --run
npm run dev            # Vite dev server
```

### Autonomous workflow (see `CLAUDE.md`)

```bash
/kickoff   # one-time: decompose SourceOfTruth.md into backlog items
/dev       # full loop: pick → plan → test → implement → validate → release
```

---

## Constraints (SourceOfTruth)

- **Core engine** — no `document`, `window`, or `navigator`; no `Math.random()`; pure functions; O(n) tree work; invalid input → `unknown`, not guessed values
- **Adapters** — browser APIs only under `src/adapters/`, dev-only guards, no patching React internals (public Profiler APIs only)

`SourceOfTruth.md` is the immutable product contract for this repo.
