# Spatial Dashboard — Source of Truth (SOT)

> This document governs the dashboard app that visualises `spatial` engine output.
> It is IMMUTABLE. Never modify it during development — change requests require human review.

---

## 1. Product Definition

We are building:

> A development-time web dashboard that makes the `spatial` performance engine's rules, analysis results, and issue reports human-readable and explorable — for both manual JSON experiments and live analysis of real React projects.

The dashboard is a **consumer** of the engine — it never contains detection logic. All detection runs through `../src/` (the spatial engine) and `../src/adapters/` (the integration layer).

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
- Engine imported via `src/lib/engine.ts` adapter (never directly in components)

---

## 3. Pages / Sections

### 3.1 Rule Catalog Page (`/rules`)
Displays all available rules with:
- Rule name
- What it detects (description)
- Default threshold (if applicable)
- Severity (`warning` | `error`)

### 3.2 Analysis Playground Page (`/analyze`)
Allows the developer to:
- Input a `ComponentNode` tree (JSON editor)
- Input `PerformanceMetrics` values (number inputs)
- Run the engine and see the `PerformanceResult`
- See issues displayed as cards with severity badges
- Pre-populated with a working example so it's useful immediately

### 3.3 Result Detail View (component)
For a given `PerformanceResult`:
- Status banner (PASS / FAIL / UNKNOWN)
- Metrics summary table
- Issue list with: rule name, severity, message, affected node ID

### 3.4 Live Analysis Page (`/live`) ← real-world integration
Connects to a running React app instrumented with `SpatialProvider`:
- Displays the latest `PerformanceResult` streamed from the live app
- Shows which component triggered each issue (real node IDs from the fiber tree)
- Auto-refreshes when the engine produces a new result
- Shows how to add `<SpatialProvider>` to the target app (setup instructions)
- **Data stays local** — no network calls, communication via `window.__SPATIAL__` bridge

---

## 4. Data Flow

```
Manual path (Playground):
  User inputs JSON + metrics
        ↓
  src/lib/engine.ts → runAnalysis()
        ↓
  PerformanceResult → dashboard renders

Live path (Live Analysis):
  Real React app with <SpatialProvider>
        ↓
  spatial adapter extracts ComponentNode tree + collects metrics
        ↓
  analyze() runs inside the adapter
        ↓
  result posted to window.__SPATIAL__ bridge
        ↓
  dashboard polls bridge → renders latest result
```

No server. No API. All communication is local (same browser tab or devtools).

---

## 5. Input/Output Contracts

Consumed directly from the engine — never duplicated here:

```ts
// From ../src/types.ts
type ComponentNode    = { id, type, props?, children?, styles? }
type PerformanceMetrics = { renderCount, layoutShifts, fpsDrop, memoryUsage }
type PerformanceResult  = { status, metrics, issues[], reason? }
type PerformanceIssue   = { rule, severity, message, nodeId }
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
- Live analysis page consuming the `window.__SPATIAL__` bridge

**Not allowed:**
- Adding detection rules to the dashboard (belongs in `../src/`)
- Any backend, API calls, or data persistence
- Auto-fix or code suggestion features
- User authentication or accounts
- Communicating with external servers

---

## 8. Tech Stack (Fixed)

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Engine | `spatial` (relative import via `src/lib/`) |
| Testing | Vitest + React Testing Library |
| No backend | — |

---

## 9. Definition of Done

A feature is complete when:
- Component renders without errors
- Engine calls isolated to `src/lib/`
- Props are fully typed (no `any`)
- All 4 quality gates pass
