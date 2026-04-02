import { describe, it, expect } from 'vitest'
import { createMetricsCache, buildCacheKey } from '../../src/metrics-cache'
import type { PerformanceMetrics, PerformanceResult } from '../../src/types'

const metrics: PerformanceMetrics = { renderCount: 3, layoutShifts: 1, fpsDrop: 5, memoryUsage: 50 }
const metrics2: PerformanceMetrics = { renderCount: 10, layoutShifts: 2, fpsDrop: 15, memoryUsage: 120 }

const passResult: PerformanceResult = { status: 'pass', metrics, issues: [] }
const failResult: PerformanceResult = {
  status: 'fail',
  metrics,
  issues: [{ rule: 'render-count', severity: 'warning', message: 'Too many renders', nodeId: 'n1' }],
}
const unknownResult: PerformanceResult = {
  status: 'unknown',
  metrics,
  issues: [],
  reason: 'metrics contain invalid values',
}

describe('Metrics Cache', () => {
  describe('Happy Path', () => {
    it('H1: set and get a cached result → returns stored result', () => {
      const cache = createMetricsCache()
      const key = buildCacheKey('n1', metrics)
      cache.set(key, passResult)
      expect(cache.get(key)).toEqual(passResult)
    })

    it('H2: has() returns true after set', () => {
      const cache = createMetricsCache()
      const key = buildCacheKey('n1', metrics)
      cache.set(key, failResult)
      expect(cache.has(key)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('E1: different nodeIds with same metrics → different keys', () => {
      const keyA = buildCacheKey('a', metrics)
      const keyB = buildCacheKey('b', metrics)
      expect(keyA).not.toBe(keyB)
    })

    it('E2: same nodeId with different metrics → different keys', () => {
      const key1 = buildCacheKey('a', metrics)
      const key2 = buildCacheKey('a', metrics2)
      expect(key1).not.toBe(key2)
    })

    it('E3: clear() removes all entries', () => {
      const cache = createMetricsCache()
      const key1 = buildCacheKey('n1', metrics)
      const key2 = buildCacheKey('n2', metrics)
      cache.set(key1, passResult)
      cache.set(key2, failResult)
      cache.clear()
      expect(cache.has(key1)).toBe(false)
      expect(cache.has(key2)).toBe(false)
    })
  })

  describe('Failure Cases', () => {
    it('F1: get() on missing key returns undefined', () => {
      const cache = createMetricsCache()
      expect(cache.get('non-existent-key')).toBeUndefined()
    })
  })

  describe('Unknown Cases', () => {
    it('U1: cached result preserves unknown status', () => {
      const cache = createMetricsCache()
      const key = buildCacheKey('n1', metrics)
      cache.set(key, unknownResult)
      const retrieved = cache.get(key)
      expect(retrieved?.status).toBe('unknown')
      expect(retrieved?.reason).toBe('metrics contain invalid values')
    })
  })
})
