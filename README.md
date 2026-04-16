# Spatial — Real-time performance pattern detector

A **pure JavaScript/TypeScript library** that detects performance anti-patterns in your running app as you develop. Zero framework dependency at the core. React is the first adapter — Vue, Svelte, and Angular can follow the same contract.

Add 3 lines to your React app. Open the dashboard. See performance problems appear in real-time.

| | |
|--|--|
| **Engine version** | See `VERSION` |
| **Engine tests** | Vitest (`npm test` at repo root) |
| **Dashboard** | React 19 + Vite (`npm run dev` in `dashboard/`) |
| **Language** | TypeScript strict — zero framework imports in core |

---

## Why not React Profiler?

React Profiler and Spatial solve different problems:

| | React Profiler | Spatial |
|--|--|--|
| **Output** | Raw timing numbers (ms per render) | Detected anti-patterns with severity |
| **Insight** | "Button rendered in 12ms" | "Button has 47 boolean props — split this component" |
| **Cross-component analysis** | No | Yes (nesting depth, single-child chains, fanout) |
| **Signals used** | Render timing only | Render count + layout shifts + FPS + memory + tree structure |
| **Rules engine** | No | Yes — extensible, deterministic, independently testable |
| **Works without DevTools** | No | Yes — any browser |
| **Framework-agnostic core** | React-only, always | Yes — same JS core, different adapter per framework |
| **Setup** | Install React DevTools | 3 lines of code |

React Profiler tells you **what happened**. Spatial tells you **what's wrong and why**. Use both — they are complementary.

---

## How it works

```tsx
// main.tsx — only change needed in your app
import { SpatialProvider } from './src/adapters'

root.render(
  <SpatialProvider>   {/* ← add this */}
    <App />
  </SpatialProvider>
)
```

Then open the Spatial dashboard (`cd dashboard && npm run dev`) in a separate browser tab. As you use your app, detected problems show up live — excessive re-renders, layout shifts, oversized trees, memory spikes, and more.

No Babel plugins. No webpack config. No instrumentation of existing components. Zero overhead in production builds.

---

## What it detects

Spatial runs 18 performance rules on every render cycle:

| Category | Rules |
|----------|-------|
| **Re-renders** | render-count, memo-candidate |
| **Layout** | layout-shift, nesting-depth, single-child-chain |
| **Memory** | memory-usage, large-data-prop |
| **Tree structure** | child-count, total-node-count, duplicate-component-type, unvirtualized-list, multi-type-sibling-fanout |
| **Component quality** | prop-count, anonymous-component, boolean-prop-overload, event-handler-count |
| **Styling** | inline-style-count, style-complexity, classname-token-sprawl |
| **Frames** | fps-drop |

Each rule produces a `warning` or `error` with the affected component ID and a human-readable message.

---

## Dashboard

Open it alongside your app while developing.

| Page | Purpose |
|------|---------|
| `/` | Setup guide + quick links |
| `/live` | **Live view** — issues update every 500ms as your app runs |
| `/rules` | All 18+ rules with descriptions, severities, thresholds |
| `/examples` | Interactive bad vs good demos — sliders/buttons drive real engine analysis; issues appear/clear as you cross thresholds |
| `/analyze` | Manual playground — paste a component tree JSON to test rules |

### Running the dashboard

```bash
cd dashboard
npm install
npm run dev   # opens at http://localhost:5173
```

---

## Architecture

Three layers, cleanly separated:

```
┌──────────────────────────────────────────────────────────┐
│  Dashboard  (React 19 + Vite — consumer only)            │
│  Reads window.__SPATIAL__ → renders PerformanceResult    │
│  Contains ZERO detection logic                           │
├──────────────────────────────────────────────────────────┤
│  Framework Adapter  (src/adapters/ — dev-only)           │
│  react.ts: React Profiler + fiber → ComponentNode        │
│  metrics.ts: PerformanceObserver → PerformanceMetrics    │
│  Future: vue.ts, svelte.ts follow the same contract      │
├──────────────────────────────────────────────────────────┤
│  Core Engine  (src/ — pure JavaScript, zero deps)        │
│  analyze(root, metrics, registry) → PerformanceResult    │
│  Same input = same output. Testable with no browser.     │
└──────────────────────────────────────────────────────────┘
```

**Core engine** (`src/` — pure JS, no framework imports):

```
ComponentNode (tree)
       │
  collectNodes()          ← O(n) traversal
       │
  registry.runAll(node, metrics)   ← all rules, per node
       │
  PerformanceIssue[]
       │
  analyze() → PerformanceResult { status, metrics, issues }
```

**React adapter** (`src/adapters/` — dev-only, React APIs allowed):

```
React Profiler onRender
       │
  extractTree(fiber)      ← ComponentNode from live fiber tree
  collectMetrics()        ← PerformanceObserver + performance.memory
       │
  analyze(tree, metrics, registry)
       │
  window.__SPATIAL__ = { result, timestamp }
       │
  dashboard polls every 500ms → live view updates
```

**Performance budget:**
- Core engine bundle: ≤ 5 KB gzipped
- Full integration bundle: ≤ 20 KB gzipped
- Adapter heap overhead: ≤ 5 MB
- Per-render analysis time: ≤ 2 ms

---

## Repository layout

```
src/                    ← pure JS engine (no DOM, no framework imports)
  engine.ts             ← analyze(root, metrics, registry) → PerformanceResult
  types.ts              ← ComponentNode, PerformanceMetrics, PerformanceResult
  rule-registry.ts      ← createRegistry(), register, runAll
  traversal.ts          ← O(n) depth-first tree walker
  rules/                ← one factory per detection rule
  adapters/             ← framework-specific bridge (browser APIs, dev-only)
    react.ts            ← React Profiler + fiber → ComponentNode
    metrics.ts          ← PerformanceObserver → PerformanceMetrics
    index.ts            ← SpatialProvider, useSpatial, window.__SPATIAL__ bridge

dashboard/              ← dev-time visualisation app (React 19 consumer)
  src/
    lib/engine.ts       ← only file that imports from src/
    components/         ← display-only React components
    pages/              ← page-level views
```

---

## Testing rules manually

For unit-testing rules or exploring the engine in isolation (no browser, no React):

```ts
import { analyze } from './src/engine'
import { createRegistry } from './src/rule-registry'
import { createRenderCountRule } from './src/rules/render-count'

const registry = createRegistry()
registry.register(createRenderCountRule()) // threshold: 5 renders

const result = analyze(
  { id: 'root', type: 'View', children: [{ id: 'btn', type: 'Button' }] },
  { renderCount: 8, layoutShifts: 1, fpsDrop: 0, memoryUsage: 40 },
  registry,
)

console.log(result.status) // "fail"
console.log(result.issues[0].message)
// "Render count 8 exceeds threshold of 5 (node: root)"
```

Invalid or negative metrics return `status: 'unknown'` — the engine never guesses.

---

## Development

**Engine (repo root)**

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
npm run dev
```

### Deploying the dashboard to Vercel

`vercel.json` at the repo root deploys the dashboard. Build runs `npm ci` + `npm run build` in `dashboard/`. Output is `dashboard/dist`. Client-side routing rewrites unknown paths to `index.html`.

---

## Constraints

- **Core engine** — no `document`, `window`, `navigator`; no framework imports; no `Math.random()`; pure functions; O(n) traversal; invalid input → `unknown`
- **Adapters** — browser APIs only in `src/adapters/`; `NODE_ENV !== 'production'` guard required; no patching framework internals

Full governance: `SourceOfTruth.md`.
