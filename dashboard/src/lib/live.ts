/**
 * Live bridge reader — D07
 * Reads window.__SPATIAL__ posted by the spatial adapter (SpatialProvider).
 * Read-only: never writes to the bridge.
 *
 * dashboard/SourceOfTruth.md Section 3.4, 4
 */
import type { PerformanceResult } from './engine'

export type BridgeData = { result: PerformanceResult; timestamp: number } | null

export function readBridge(): BridgeData {
  const w = window as unknown as Record<string, unknown>
  const val = w.__SPATIAL__
  if (val == null || typeof val !== 'object') return null
  return val as BridgeData
}
