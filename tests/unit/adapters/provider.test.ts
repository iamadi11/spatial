import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { PerformanceResult } from '../../../src/types'

// window.__SPATIAL__ shape
type SpatialWindow = {
  __SPATIAL__?: { result: PerformanceResult; timestamp: number }
}

describe('createSpatialHandler', () => {
  beforeEach(() => {
    vi.resetModules()
    // Clean up global between tests
    delete (globalThis as SpatialWindow).__SPATIAL__
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete (globalThis as SpatialWindow).__SPATIAL__
  })

  // Happy path 1: calling the handler populates window.__SPATIAL__
  it('posts a PerformanceResult to window.__SPATIAL__ after a render', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { createSpatialHandler } = await import('../../../src/adapters/index')

    const handler = createSpatialHandler()
    handler() // simulate one render

    const stored = (globalThis as SpatialWindow).__SPATIAL__
    expect(stored).toBeDefined()
    expect(stored!.result).toHaveProperty('status')
    expect(stored!.result).toHaveProperty('metrics')
    expect(stored!.result).toHaveProperty('issues')
  })

  // Happy path 2: timestamp is set on each post
  it('sets a numeric timestamp alongside the result', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { createSpatialHandler } = await import('../../../src/adapters/index')

    const handler = createSpatialHandler()
    handler()

    const stored = (globalThis as SpatialWindow).__SPATIAL__
    expect(typeof stored!.timestamp).toBe('number')
    expect(stored!.timestamp).toBeGreaterThan(0)
  })

  // Happy path 3: render count increments on successive calls
  it('increments renderCount with each handler invocation', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { createSpatialHandler } = await import('../../../src/adapters/index')

    const handler = createSpatialHandler()
    handler()
    const first = (globalThis as SpatialWindow).__SPATIAL__!.result.metrics.renderCount

    handler()
    const second = (globalThis as SpatialWindow).__SPATIAL__!.result.metrics.renderCount

    expect(second).toBeGreaterThan(first)
  })

  // Edge case 1: result.status is one of the valid statuses
  it('result.status is pass, fail, or unknown', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { createSpatialHandler } = await import('../../../src/adapters/index')

    const handler = createSpatialHandler()
    handler()

    const { status } = (globalThis as SpatialWindow).__SPATIAL__!.result
    expect(['pass', 'fail', 'unknown']).toContain(status)
  })

  // Edge case 2: result.issues is always an array
  it('result.issues is always an array', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { createSpatialHandler } = await import('../../../src/adapters/index')

    const handler = createSpatialHandler()
    handler()

    const { issues } = (globalThis as SpatialWindow).__SPATIAL__!.result
    expect(Array.isArray(issues)).toBe(true)
  })

  // Failure case: production guard — does not write to window.__SPATIAL__
  it('does nothing in production — window.__SPATIAL__ remains unset', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { createSpatialHandler } = await import('../../../src/adapters/index')

    const handler = createSpatialHandler()
    handler()

    expect((globalThis as SpatialWindow).__SPATIAL__).toBeUndefined()
  })
})

describe('useSpatial', () => {
  beforeEach(() => {
    vi.resetModules()
    delete (globalThis as SpatialWindow).__SPATIAL__
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete (globalThis as SpatialWindow).__SPATIAL__
  })

  // Happy path: returns the stored result when __SPATIAL__ is set
  it('returns the latest PerformanceResult when window.__SPATIAL__ is populated', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { useSpatial } = await import('../../../src/adapters/index')

    const mockResult: PerformanceResult = {
      status: 'pass',
      metrics: { renderCount: 3, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 },
      issues: [],
    }
    ;(globalThis as SpatialWindow).__SPATIAL__ = { result: mockResult, timestamp: Date.now() }

    expect(useSpatial()).toEqual(mockResult)
  })

  // Edge case: returns null when __SPATIAL__ is not yet set
  it('returns null when window.__SPATIAL__ has not been set', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { useSpatial } = await import('../../../src/adapters/index')

    expect(useSpatial()).toBeNull()
  })

  // Unknown case: returns null in production
  it('returns null in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { useSpatial } = await import('../../../src/adapters/index')

    expect(useSpatial()).toBeNull()
  })
})
