import type { PerformanceResult } from './types'

/**
 * Builds a well-formed UNKNOWN result.
 * SOT Section 2.3 / 9: when the engine cannot compute, return a structured unknown.
 * Pure function — no side effects.
 */
export function unknownResult(reason: string): PerformanceResult {
  return {
    status: 'unknown',
    metrics: {
      renderCount: 0,
      layoutShifts: 0,
      fpsDrop: 0,
      memoryUsage: 0,
    },
    issues: [],
    reason,
  }
}
