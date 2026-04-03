---
id: D07
title: "Live analysis page (/live) — reads window.__SPATIAL__ bridge from instrumented React app"
type: feature
priority: 2
status: active
depends-on: D06
---

## PM Plan

**Problem**: The playground page (D04) lets developers test the engine with hand-crafted JSON. But the main use case is analysing a **real running React app** instrumented with `<SpatialProvider>`. There is no page in the dashboard that reads live results from a running app.

**Goal**: Build a `/live` page that:
1. Polls `window.__SPATIAL__` every 500ms for the latest `PerformanceResult`
2. Renders the result using `ResultDetailView` (D05)
3. Shows a "waiting for data" state when no bridge data is present
4. Shows setup instructions (code snippet for adding `<SpatialProvider>`) when disconnected
5. Shows a "last updated" timestamp alongside the result

**Scope**: `src/pages/LiveAnalysisPage.tsx` + `src/lib/live.ts` (bridge reader).

**`src/lib/live.ts`**:
```ts
export type BridgeData = { result: PerformanceResult; timestamp: number } | null
export function readBridge(): BridgeData {
  return (window as any).__SPATIAL__ ?? null
}
```

**Component structure**:
```
LiveAnalysisPage
  ├── ConnectedBanner (green) | DisconnectedBanner (grey) + setup instructions
  ├── LastUpdated timestamp
  └── ResultDetailView (from D05)
```

**Polling**: `setInterval(readBridge, 500)` in a `useEffect` — clears on unmount.

**Non-goals**: No WebSocket. No server. No persistence. No history of past results.

**Done when**: When a React app with `<SpatialProvider>` is open in the same browser, the `/live` page auto-displays its latest `PerformanceResult` and updates within 500ms of each new render.

## QA Test Plan

| # | Type | Input | Expected |
|---|------|-------|----------|
| 1 | Happy | `window.__SPATIAL__` set | `readBridge()` returns BridgeData with result + timestamp |
| 2 | Happy | `window.__SPATIAL__` not set | `readBridge()` returns null |
| 3 | Edge | Timestamp value | Preserved exactly in returned BridgeData |
| 4 | Failure | `window.__SPATIAL__ = undefined` | `readBridge()` returns null |
| 5 | Happy | No bridge data on mount | LiveAnalysisPage shows waiting/disconnected message |
| 6 | Happy | No bridge data on mount | LiveAnalysisPage shows SpatialProvider setup instructions |
| 7 | Happy | Bridge data present before mount | ResultDetailView shows PASS after timer tick |
| 8 | Happy | Bridge data present | Shows "Last updated" label |
| 9 | Edge | Bridge data arrives after initial render | Component updates to show new result |
| 10 | Edge | Bridge data present | Shows live/connected indicator |
| 11 | Unknown | Bridge data with UNKNOWN result | UNKNOWN status is displayed |

## Implementation Plan

**Files created/modified:**
1. `src/lib/live.ts` — `readBridge(): BridgeData` reads `window.__SPATIAL__`, returns null if absent
2. `src/pages/LiveAnalysisPage.tsx` — polls bridge every 500ms via `setInterval` in `useEffect`; shows connected banner + last-updated timestamp when live, disconnected state + setup instructions when not
3. `src/App.tsx` — added `/live` route
4. `src/components/Sidebar.tsx` — added "Live" nav link

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Gate | PASS | Problem, scope, non-goals, done-when all present |
| Component Gate | PASS | LiveAnalysisPage isolated; props typed; lib/live.ts handles all engine interaction |
| Dev Gate | PASS | Engine calls only in lib/; no `any`; strict TS |
| Visual Gate | PASS | Connected/disconnected banners; accessible labels; setup code block renders cleanly |

Overall: PASS
