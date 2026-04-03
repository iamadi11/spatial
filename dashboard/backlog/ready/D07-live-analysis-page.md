---
id: D07
title: "Live analysis page (/live) — reads window.__SPATIAL__ bridge from instrumented React app"
type: feature
priority: 2
status: ready
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
