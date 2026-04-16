# Spatial — AI Governance Source of Truth (SOT)

---

# 0. Purpose

This document enforces **strict alignment between idea → implementation** for a dev-time UI performance detection engine that works in real projects with minimal setup.

AI must:

* NOT assume
* NOT expand scope
* NOT skip validation
* ALWAYS follow test-first development

---

# 1. Product Definition

We are building:

> A real-time, development-time performance pattern detector — a **pure JavaScript/TypeScript library** that surfaces performance anti-patterns in your running React app as you develop, visible on a live dashboard with ≤ 3 lines of setup code. Zero impact on production.

**Core principle**: The engine is a **framework-agnostic JavaScript library**. It has no React dependency. React is just the first adapter. The same core can later power Vue, Svelte, Angular, or any other framework by writing a new adapter.

**Primary experience:**
1. Developer adds `<SpatialProvider>` to their React app (3 lines)
2. The React adapter watches the live component tree and feeds data into the JS engine
3. The engine detects performance anti-patterns in real-time
4. Problems appear on the dashboard immediately — no manual input, no build step

**Three-layer architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Dashboard  (dashboard/)                           │
│  - React 19 + Vite + Tailwind — consumer only               │
│  - Reads window.__SPATIAL__ bridge, renders results live    │
│  - Contains ZERO detection logic                            │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Framework Adapters  (src/adapters/)               │
│  - react.ts: watches live React trees via React Profiler    │
│  - metrics.ts: collects browser metrics → PerformanceMetrics│
│  - Pushes results to window.__SPATIAL__ bridge              │
│  - Dev-only: stripped from production builds                │
│  - Future: vue.ts, svelte.ts, angular.ts follow same contract│
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Core Engine  (src/)                               │
│  - Pure JavaScript/TypeScript — zero framework dependency   │
│  - analyze(root, metrics, registry) → PerformanceResult     │
│  - Rules, traversal, registry — same input = same output    │
│  - Fully testable without a browser or framework            │
└─────────────────────────────────────────────────────────────┘
```

The core engine is deterministic and testable in isolation. The adapter layer connects it to live framework trees. The dashboard consumes results in real-time.

---

# 1.5 How Spatial Differs from React Profiler

React Profiler and Spatial solve different problems:

| | React Profiler | Spatial |
|--|--|--|
| **Output** | Raw timing numbers (ms per render) | Detected anti-patterns with severity |
| **Insight type** | "Button rendered in 12ms" | "Button has 47 boolean props — split this component" |
| **Cross-component analysis** | No | Yes (nesting depth, single-child chains, fanout) |
| **Signals used** | Render timing only | Render count + layout shifts + FPS + memory + tree structure |
| **Rules engine** | No | Yes — extensible, deterministic, independently testable |
| **Works without DevTools** | No | Yes — any browser |
| **Framework agnostic core** | React-only, always | Yes — same JS core, different adapter per framework |
| **Setup** | Install React DevTools | 3 lines of code |
| **Dashboard** | Inside DevTools only | Separate tab alongside your app |

React Profiler tells you **what happened**. Spatial tells you **what's wrong and why**.

Spatial does NOT replace React Profiler. Use both. React Profiler for deep render-timing investigation; Spatial for pattern detection and anti-pattern surfacing during active development.

---

# 2. Non-Negotiable Constraints

## 2.1 No Scope Expansion

AI must NOT:

* modify runtime behavior in production
* auto-fix code without human review
* add new framework adapters unless explicitly instructed

---

## 2.2 Deterministic Core Engine (Framework-Agnostic)

* Core engine (`src/`) is **pure JavaScript/TypeScript with zero framework imports**
* Produces **repeatable results** given the same input
* No randomness in detection
* No production browser assumptions
* No DOM or browser API in `src/` (core only)
* Must be fully unit-testable with no browser, no React, no framework

---

## 2.3 Integration Layer Rules (src/adapters/)

The integration layer **is allowed to**:

* Use `React.Profiler` API to collect render timings (React adapter only)
* Use `PerformanceObserver` to collect layout shifts and FPS
* Use `performance.memory` for memory usage
* Read the React fiber tree to extract component structure (React adapter only)

The integration layer **must NOT**:

* Modify or patch React internals or any framework internals
* Run in production (guard with `process.env.NODE_ENV !== 'production'`)
* Add measurable runtime overhead to production builds
* Collect any data that leaves the user's machine
* Import framework code into the core engine (`src/`)

---

## 2.4 Minimal-Change Integration Principle

A developer must be able to integrate spatial with **≤ 3 lines of new code**:

```tsx
// main.tsx — only change needed in a React app
import { SpatialProvider } from 'spatial/react'

root.render(
  <SpatialProvider>   {/* ← add this */}
    <App />
  </SpatialProvider>
)
```

No Babel plugins. No webpack config. No instrumentation of existing components.

---

## 2.5 Lightweight & Fast

* Core engine: ≤ 5 KB gzipped
* Full integration bundle (core + React adapter): ≤ 20 KB gzipped
* Tree-shakeable ES modules — unused rules must not be bundled
* O(n) traversal — no nested loops over the same nodes
* Zero impact on production bundle when `NODE_ENV === 'production'`

**Adapter runtime overhead (in dev):**

* Additional heap usage: ≤ 5 MB
* Per-render analysis time: ≤ 2 ms (must not cause measurable frame drops)
* No memory leaks — old results are replaced, not accumulated
* Polling interval for dashboard bridge: 500 ms (configurable, never < 100 ms)

---

## 2.6 Trust Over Intelligence

* If unsure → return `{ status: "unknown", reason: "..." }`
* Never guess metrics or bottlenecks
* Never hallucinate fixes

---

## 2.7 Test-First Development (MANDATORY)

> No implementation is allowed before test definitions.

---

# 3. AI Role Simulation (MANDATORY)

For every feature, AI must act as:

## 3.1 Product Manager (PM)

* What problem is being solved?
* Why is this needed?
* What is OUT OF SCOPE?
* What is the expected behavior?

## 3.2 Fullstack Developer

* Input format (component tree, DOM snapshot, React fiber)
* Output format (performance report)
* Data structures for metrics
* Algorithm approach (measurement + anomaly detection)

## 3.3 QA Engineer

* Edge cases (large lists, deeply nested components)
* Failure cases (unsupported components, dynamic CSS)
* Boundary inputs (empty components, zero-state UI)
* Negative scenarios (missing hooks, unsupported frameworks)

---

# 4. Development Workflow (STRICT ORDER)

## Step 1: Problem Definition

AI must output:

```txt
Feature:
Goal:
Scope:
Non-goals:
```

## Step 2: Test Case Definition (MANDATORY)

### 4.2.1 Happy Path

```json
Input: component tree with standard components and props
Expected Output: PerformanceResult with status: pass/fail
```

### 4.2.2 Edge Cases

* Very large component trees
* Nested layouts
* Long lists without virtualization

### 4.2.3 Failure Cases

* Unsupported frameworks
* Missing lifecycle hooks
* Empty component tree

### 4.2.4 Unknown Cases

```json
Expected:
{ "status": "unknown", "reason": "cannot measure reliably in this environment" }
```

## Step 3: Test Coverage Validation

AI must confirm:

```txt
✔ All scenarios covered
✔ No missing edge case
✔ No ambiguity in expected output
```

## Step 4: Implementation Plan

Define functions/modules, data flow — without writing code yet.

## Step 5: Code Implementation

Rules:

* Core (`src/`): pure functions, no DOM, no framework imports, deterministic, TypeScript strict
* Adapters (`src/adapters/`): may use browser APIs and framework APIs; must be dev-only; must be tree-shakeable

## Step 6: Validation Against Tests

```txt
✔ All test cases pass
✔ No uncovered scenario
```

---

# 5. System Contracts

## 5.1 Core Input Contract

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
  memoryUsage: number
}
```

## 5.2 Core Output Contract

```ts
type PerformanceResult = {
  status: 'pass' | 'fail' | 'unknown'
  metrics: PerformanceMetrics
  issues: PerformanceIssue[]
  reason?: string
}

type PerformanceIssue = {
  rule: string
  severity: 'warning' | 'error'
  message: string
  nodeId: string
}
```

## 5.3 Adapter Contract (src/adapters/)

Each framework adapter must implement this contract:

```ts
// Framework adapter — converts a live framework tree to ComponentNode
type FrameworkAdapter = {
  extractTree(root: unknown): ComponentNode
}

// Metrics collector — collects real browser metrics
type MetricsCollector = {
  start(): void
  stop(): PerformanceMetrics
  reset(): void
}

// React-specific developer-facing API (React adapter only)
type SpatialProviderProps = {
  children: ReactNode
  onResult?: (result: PerformanceResult) => void
  rules?: RuleOptions
}
```

The contract must be implemented independently per framework. The core engine knows nothing about frameworks.

---

# 6. Validation Philosophy

## 6.1 No Assumptions

AI must NOT assume:

* baseline FPS
* default browser CPU/GPU
* implicit memoization

If missing → return UNKNOWN

## 6.2 Explicit Inputs Only

All computations must be based on:

* provided component tree (or extracted from real app via adapter)
* measured or provided metrics

## 6.3 Deterministic Rules

```txt
IF renderCount > threshold → flag re-render
IF layoutShift > threshold → flag layout instability
```

No probabilistic logic.

---

# 7. Rule Development Template

Every rule must follow:

```txt
Rule Name:
Purpose:
Inputs:
Condition:
Output:
```

Test Cases: happy path, edge cases, failure cases.

---

# 8. Anti-Deviation Rules

AI must NEVER:

❌ Modify production runtime behavior
❌ Auto-optimize code without human review
❌ Assume browser-specific defaults
❌ Expand to non-UI performance metrics
❌ Patch or monkey-patch React internals or any framework internals
❌ Ship adapter code in production bundles (must be dev-only)
❌ Import React or any framework into the core engine (`src/`)

---

# 9. Failure Handling

If system cannot compute:

```json
{ "status": "unknown", "reason": "unsupported input or environment" }
```

---

# 10. Quality Gates (MANDATORY)

## Gate 1: PM Validation

* Problem clearly defined
* Scope limited
* Non-goals stated

## Gate 2: QA Validation

* Edge cases covered
* Failure scenarios covered

## Gate 3: Dev Validation

* Core: pure JS/TS functions, no DOM, no framework imports, deterministic
* Adapters: dev-only guard present, tree-shakeable, no framework internals patched

## Gate 4: Test Coverage

* All cases mapped to logic
* Bundle size verified (core ≤ 5 KB, full ≤ 20 KB)

---

# 11. Performance Constraints

* O(n) traversal max for component tree
* Metrics cached per render — no repeated measurement of same operation
* Core engine: ≤ 5 KB gzipped
* Full integration bundle: ≤ 20 KB gzipped
* Zero production overhead — adapter code must be excluded via `process.env.NODE_ENV` guard or build-time dead-code elimination

---

# 12. Expansion Policy

**Allowed:**

* New rules for additional performance patterns
* New framework adapters (Vue, Svelte, Angular) following the same adapter contract
* Improved measurement accuracy of existing rules
* CLI tool to run analysis on component files statically

**Not allowed:**

* Uncontrolled feature expansion
* Runtime behavior changes in production
* Sending data off the user's machine
* Auto-fixing or rewriting user code
* Adding framework imports to the core engine

---

# 13. Execution Command Template (for AI)

```txt
Follow SOT strictly.

Step 1: Define problem (PM role)
Step 2: Define test cases (QA role)
Step 3: Validate coverage
Step 4: Provide implementation plan
Step 5: Then write code

Do not skip steps.
Do not assume missing data.
Return UNKNOWN if uncertain.
```

---

# 14. Definition of Done

A feature is complete ONLY IF:

* all test cases defined first
* all test cases satisfied
* no ambiguity remains
* no SOT rule violated
* bundle size budget respected

---

# 15. Philosophy

> Real-time pattern detection with a framework-agnostic core. The adapter watches your running framework tree and feeds real measurements into a pure JavaScript rules engine that always produces the same verdict for the same input.

* **Core**: strict, deterministic, fully testable without a browser or framework — plain JavaScript
* **Adapters**: lightweight, dev-only, minimal surface area — observe only, never modify; one per framework
* **Dashboard**: live consumer of results — the developer's window into what Spatial found; built on React 19

NOT:

* a static linter that runs at build time
* a heuristic guesser
* a runtime profiler that ships to production
* a framework that requires wrapping every component
* a replacement for React Profiler (they are complementary tools)

---

# 16. Dashboard (dev-time visualisation layer)

The dashboard is a **consumer** of the engine — it never contains detection logic.

## 16.1 Dashboard Product Definition

> A development-time dashboard that shows real-time performance problems detected in your running app. Open it alongside your app; as you interact and develop, Spatial surfaces issues live — no manual input required.

## 16.2 Dashboard Non-Negotiable Constraints

- Detection logic lives ONLY in `src/` (engine). The dashboard NEVER reimplements rules, thresholds, or detection.
- The dashboard reads engine output (`PerformanceResult`) and renders it. It NEVER writes back to the engine or mutates results.
- No telemetry, no remote data collection, no user tracking.
- Framework: **React 19** + TypeScript + Vite + Tailwind. No backend — runs entirely in the browser.
- Engine accessed exclusively through `dashboard/src/lib/engine.ts` — never imported directly in components.

## 16.3 Dashboard Pages

| Route | Purpose | Priority |
|-------|---------|---------|
| `/` | Home — setup instructions + link to live view | primary |
| `/live` | **Live analysis** — polls `window.__SPATIAL__` every 500ms, shows real-time issues | **primary** |
| `/rules` | Rule catalog — all rules, descriptions, severities, thresholds | secondary |
| `/examples` | Bad vs good patterns with live engine analysis | secondary |
| `/analyze` | Manual playground — JSON tree input → engine result (for testing rules) | tertiary |

## 16.4 Dashboard Data Flow

```
PRIMARY (real-time):
  SpatialProvider (in user's app)
    → Framework Adapter + PerformanceObserver (adapter)
    → analyze() (core JS engine)
    → window.__SPATIAL__ (bridge)
    → dashboard polls every 500ms
    → PerformanceResult rendered live

SECONDARY (manual testing):
  user JSON + metrics → dashboard/src/lib/engine.ts → PerformanceResult → render
```

No server. No API. All local (same browser tab or same machine).

## 16.5 Dashboard Quality Gates

1. **PM Gate**: Problem defined, scope limited, non-goals listed
2. **Component Gate**: Isolated component, typed props, no deep prop drilling
3. **Dev Gate**: Engine calls only in `src/lib/`, no `any`, strict TypeScript
4. **Visual Gate**: Renders at 1280px, no overflow, accessible labels

## 16.6 Dashboard Expansion Policy

**Allowed:**
- Improvements to the live analysis view (better issue display, history, grouping)
- New views/pages that display engine output
- UI improvements to existing pages
- Additional display formats for `PerformanceResult`

**Not allowed:**
- Adding detection rules to the dashboard (belongs in `src/`)
- Any backend, API calls, or data persistence
- Auto-fix or code suggestion features
- User authentication or accounts
- Communicating with external servers
- Moving detection logic out of the engine into the dashboard

---

# 17. File Structure

```
src/
  engine.ts          ← core analyze() function — pure JS, no framework imports
  types.ts           ← shared types (ComponentNode, PerformanceMetrics, PerformanceResult)
  rule-registry.ts   ← registry factory (pure)
  traversal.ts       ← O(n) tree walker (pure)
  rules/             ← individual rule implementations (pure, no framework)
  adapters/          ← framework-specific integration layer (browser APIs allowed)
    react.ts         ← React Profiler + fiber tree extractor (React adapter)
    metrics.ts       ← PerformanceObserver-based metrics collector
    index.ts         ← SpatialProvider, useSpatial hook (React-specific)
tests/unit/          ← vitest unit tests (no browser, no framework required)
tests/integration/   ← integration tests (jsdom or real browser)
backlog/             ← engine work items (ready/active/done)
BACKLOG.md           ← unified work item index (engine + dashboard)
SourceOfTruth.md     ← single governance document for all layers
CLAUDE.md            ← AI development instructions for all layers

dashboard/           ← dev-time visualisation app (React 19 consumer)
  src/
    lib/             ← engine adapter + live bridge (only place engine is called)
    components/      ← React display components
    pages/           ← page-level components
  backlog/           ← dashboard work items (ready/active/done)
  tests/             ← vitest + React Testing Library
  package.json       ← dashboard dependencies (React 19, Vite, Tailwind)
  vite.config.ts     ← @engine alias → ../src/
```
