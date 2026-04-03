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

# 1. Product Definition (Immutable)

We are building:

> A deterministic, development-time UI performance detection engine that identifies potential performance bottlenecks before code ships — and integrates into real React projects with minimal changes to existing code.

**Two-layer architecture:**

```
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Integration Adapters  (src/adapters/)         │
│  - Converts real React trees → ComponentNode            │
│  - Collects real browser metrics → PerformanceMetrics   │
│  - May use browser APIs (React Profiler, PerformanceAPI)│
├─────────────────────────────────────────────────────────┤
│  Layer 1: Core Engine  (src/)                           │
│  - Pure functions, no DOM, deterministic                │
│  - analyze(root, metrics, registry) → PerformanceResult │
│  - Rules, traversal, registry — unchanged               │
└─────────────────────────────────────────────────────────┘
```

The core engine never changes. Adapters bridge the real world to it.

---

# 2. Non-Negotiable Constraints

## 2.1 No Scope Expansion

AI must NOT:

* modify runtime behavior in production
* auto-fix code without human review
* add new frameworks beyond React (unless explicitly instructed)

---

## 2.2 Deterministic Core Engine

* Core engine (`src/`) produces **repeatable results** given the same input
* No randomness in detection
* No production browser assumptions
* No DOM or browser API in `src/` (core only)

---

## 2.3 Integration Layer Rules (src/adapters/)

The integration layer **is allowed to**:

* Use `React.Profiler` API to collect render timings
* Use `PerformanceObserver` to collect layout shifts and FPS
* Use `performance.memory` for memory usage
* Read the React fiber tree to extract component structure

The integration layer **must NOT**:

* Modify or patch React internals
* Run in production (guard with `process.env.NODE_ENV !== 'production'`)
* Add measurable runtime overhead to production builds
* Collect any data that leaves the user's machine

---

## 2.4 Minimal-Change Integration Principle

A developer must be able to integrate spatial with **≤ 3 lines of new code**:

```tsx
// main.tsx — only change needed
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

* Core (`src/`): pure functions, no DOM, deterministic, TypeScript strict
* Adapters (`src/adapters/`): may use browser APIs; must be dev-only; must be tree-shakeable

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

## 5.3 Integration Adapter Contract (src/adapters/)

```ts
// React adapter — converts a React root to ComponentNode
type ReactAdapter = {
  extractTree(rootFiber: unknown): ComponentNode
}

// Metrics collector — collects real browser metrics
type MetricsCollector = {
  start(): void
  stop(): PerformanceMetrics
  reset(): void
}

// Developer-facing React API
type SpatialProviderProps = {
  children: ReactNode
  onResult?: (result: PerformanceResult) => void
  rules?: RuleOptions
}
```

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

* provided component tree (or extracted from real app)
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
❌ Patch or monkey-patch React internals
❌ Ship adapter code in production bundles (must be dev-only)

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

* Core: pure functions, no DOM, deterministic
* Adapters: dev-only guard present, tree-shakeable, no React internals patched

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
* New framework adapters (Vue, Svelte) following the same adapter contract
* Improved measurement accuracy of existing rules
* CLI tool to run analysis on component files statically

**Not allowed:**

* Uncontrolled feature expansion
* Runtime behavior changes in production
* Sending data off the user's machine
* Auto-fixing or rewriting user code

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

> This system is like a static analyzer with a thin real-world bridge:

* Core: strict, deterministic, validated before output
* Adapters: lightweight, dev-only, minimal surface area

NOT:

* a heuristic guesser
* a runtime profiler that ships to production
* a framework that requires wrapping every component

---

# 16. File Structure

```
src/
  engine.ts          ← core analyze() function (pure)
  types.ts           ← shared types
  rule-registry.ts   ← registry factory (pure)
  traversal.ts       ← O(n) tree walker (pure)
  rules/             ← individual rule implementations (pure)
  adapters/          ← real-world integration layer (browser APIs allowed)
    react.ts         ← React Profiler + fiber tree extractor
    metrics.ts       ← PerformanceObserver-based metrics collector
    index.ts         ← SpatialProvider, useSpatial hook
tests/unit/          ← vitest unit tests
tests/integration/   ← integration tests (jsdom or real browser)
```
