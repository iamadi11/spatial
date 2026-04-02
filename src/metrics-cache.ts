import type { PerformanceMetrics, PerformanceResult } from './types'

/**
 * Builds a deterministic cache key from a node ID and its metrics.
 * SOT Section 11 — "Metrics cached per render"; "No repeated measurement"
 * SOT Section 2.2 — pure function, deterministic
 */
export function buildCacheKey(nodeId: string, metrics: PerformanceMetrics): string {
  return `${nodeId}:${metrics.renderCount}:${metrics.layoutShifts}:${metrics.fpsDrop}:${metrics.memoryUsage}`
}

export type MetricsCache = {
  has: (key: string) => boolean
  get: (key: string) => PerformanceResult | undefined
  set: (key: string, result: PerformanceResult) => void
  clear: () => void
}

/**
 * Creates an in-memory metrics cache for a single analysis run.
 * SOT Section 11 — cache per render, no repeated computation.
 */
export function createMetricsCache(): MetricsCache {
  const store = new Map<string, PerformanceResult>()
  return {
    has: (key) => store.has(key),
    get: (key) => store.get(key),
    set: (key, result) => { store.set(key, result) },
    clear: () => { store.clear() },
  }
}
