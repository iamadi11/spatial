# Spatial Dashboard — Source of Truth (SOT)

> This document governs the dashboard app that visualises output from the `spatial` engine.
> It is IMMUTABLE. Never modify it during development — change requests require human review.

---

## 1. Product Definition

We are building:

> A development-time web dashboard that makes the `spatial` performance engine's rules, analysis results, and issue reports human-readable and explorable through a browser UI.

The dashboard is a **consumer** of the engine — it never contains detection logic itself. All detection runs through `../src/` (the spatial engine).

---

## 2. Non-Negotiable Constraints

### 2.1 Engine Is the Authority
- Detection logic lives ONLY in `../src/` (the spatial engine)
- The dashboard NEVER reimplements rules, thresholds, or detection
- If the engine changes, the dashboard adapts — not the other way around

### 2.2 Read-Only Consumption
- The dashboard reads engine output (`PerformanceResult`) and renders it
- It NEVER writes back to the engine or mutates analysis results
- It NEVER auto-fixes issues or suggests code changes

### 2.3 Dev-Time Only
- The dashboard is a development tool — not a production runtime feature
- No telemetry, no remote data collection, no user tracking

### 2.4 Framework
- React + TypeScript (Vite)
- Tailwind CSS for styling
- No backend — runs entirely in the browser
- Engine imported directly from `../src/` via relative import or workspace link

---

## 3. Pages / Sections

### 3.1 Rule Catalog Page
Displays all available rules with:
- Rule name
- What it detects (description)
- Default threshold (if applicable)
- Severity (`warning` | `error`)
- SOT section reference

### 3.2 Analysis Playground Page
Allows the user to:
- Input a `ComponentNode` tree (JSON editor)
- Input `PerformanceMetrics` values (number inputs)
- Select which rules to run (checkboxes)
- Run the engine and see the `PerformanceResult`
- See issues displayed as cards with severity badges

### 3.3 Result Detail View
For a given `PerformanceResult`:
- Status badge (PASS / FAIL / UNKNOWN)
- Metrics summary table
- Issue list with: rule name, severity, message, affected node ID

---

## 4. Data Flow

```
User Input (JSON + metrics)
        ↓
  spatial engine (../src/)
  - analyze(root, metrics, registry)
        ↓
  PerformanceResult
        ↓
  Dashboard renders result
```

No server. No API. Engine runs client-side in the browser.

---

## 5. Input/Output Contracts

Consumed directly from the engine — never duplicated here:

```ts
// From ../src/types.ts
type ComponentNode = { id, type, props?, children?, styles? }
type PerformanceMetrics = { renderCount, layoutShifts, fpsDrop, memoryUsage }
type PerformanceResult = { status, metrics, issues[], reason? }
type PerformanceIssue = { rule, severity, message, nodeId }
```

---

## 6. Quality Gates

Every feature must pass:

1. **PM Gate** — feature has a clear problem, scope, and non-goals defined
2. **Component Gate** — component is isolated, typed, no prop drilling beyond 2 levels
3. **Dev Gate** — no business logic in components; engine calls happen only in `src/lib/`
4. **Visual Gate** — renders correctly at 1280px wide; no layout overflow; accessible labels

---

## 7. Expansion Policy

**Allowed:**
- New views/pages that display engine output
- UI improvements to existing pages
- Additional display formats for `PerformanceResult`

**Not allowed:**
- Adding detection rules to the dashboard (belongs in `../src/`)
- Any backend, API calls, or data persistence
- Auto-fix or code suggestion features
- User authentication or accounts

---

## 8. Tech Stack (Fixed)

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Engine | `spatial` (relative import from `../src/`) |
| Testing | Vitest + React Testing Library |
| No backend | — |

---

## 9. Definition of Done

A feature is complete when:
- Component renders without errors
- Engine calls isolated to `src/lib/`
- Props are fully typed (no `any`)
- All 4 quality gates pass
