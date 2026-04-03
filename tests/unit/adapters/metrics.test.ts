import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { PerformanceMetrics } from '../../../src/types'

// Minimal browser API mocks (jsdom does not ship PerformanceObserver or performance.memory)
function setupBrowserMocks() {
  // PerformanceObserver: accumulate entries via observe()
  const observerCallbacks: Array<(list: { getEntries: () => Array<{ value: number }> }) => void> = []
  const MockObserver = vi.fn().mockImplementation((cb: typeof observerCallbacks[0]) => {
    observerCallbacks.push(cb)
    return { observe: vi.fn(), disconnect: vi.fn() }
  })
  ;(MockObserver as unknown as { callbacks: typeof observerCallbacks }).callbacks = observerCallbacks
  vi.stubGlobal('PerformanceObserver', MockObserver)

  // performance.memory
  Object.defineProperty(globalThis, 'performance', {
    writable: true,
    configurable: true,
    value: {
      memory: { usedJSHeapSize: 52_428_800 }, // 50 MB
      now: vi.fn(() => Date.now()),
    },
  })

  // requestAnimationFrame: synchronous stub — never calls the callback automatically
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 0))

  return { MockObserver, observerCallbacks }
}

describe('collectMetrics', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  // Happy path 1: basic call returns all four metric fields
  it('returns an object with all four PerformanceMetrics fields', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    setupBrowserMocks()
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    const result: PerformanceMetrics = collectMetrics(3)

    expect(result).toHaveProperty('renderCount')
    expect(result).toHaveProperty('layoutShifts')
    expect(result).toHaveProperty('fpsDrop')
    expect(result).toHaveProperty('memoryUsage')
  })

  // Happy path 2: renderCount is passed through directly
  it('uses the injected renderCount parameter', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    setupBrowserMocks()
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    expect(collectMetrics(7).renderCount).toBe(7)
    expect(collectMetrics(0).renderCount).toBe(0)
  })

  // Happy path 3: memoryUsage is converted from bytes to MB
  it('converts performance.memory.usedJSHeapSize to megabytes', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    setupBrowserMocks()
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    const result = collectMetrics(1)
    // 52_428_800 bytes / 1_048_576 = 50 MB
    expect(result.memoryUsage).toBe(50)
  })

  // Happy path 4: layoutShifts and fpsDrop are non-negative numbers
  it('returns non-negative numeric values for layoutShifts and fpsDrop', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    setupBrowserMocks()
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    const result = collectMetrics(2)
    expect(result.layoutShifts).toBeGreaterThanOrEqual(0)
    expect(result.fpsDrop).toBeGreaterThanOrEqual(0)
  })

  // Edge case 1: performance.memory missing — memoryUsage falls back to 0
  it('returns memoryUsage=0 when performance.memory is unavailable', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    setupBrowserMocks()
    Object.defineProperty(globalThis, 'performance', {
      writable: true,
      configurable: true,
      value: { now: vi.fn(() => Date.now()) }, // no .memory
    })
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    expect(collectMetrics(1).memoryUsage).toBe(0)
  })

  // Edge case 2: renderCount = 0 is valid
  it('handles renderCount of 0 without error', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    setupBrowserMocks()
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    const result = collectMetrics(0)
    expect(result.renderCount).toBe(0)
  })

  // Edge case 3: all numeric fields are finite numbers (no NaN, no Infinity)
  it('returns only finite numbers in all metric fields', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    setupBrowserMocks()
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    const result = collectMetrics(5)
    expect(Number.isFinite(result.renderCount)).toBe(true)
    expect(Number.isFinite(result.layoutShifts)).toBe(true)
    expect(Number.isFinite(result.fpsDrop)).toBe(true)
    expect(Number.isFinite(result.memoryUsage)).toBe(true)
  })

  // Failure case: production guard returns zero metrics
  it('returns zero metrics in production without touching browser APIs', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    const result = collectMetrics(99)
    expect(result).toEqual({ renderCount: 0, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 })
  })

  // Unknown case: PerformanceObserver unavailable — still returns valid PerformanceMetrics
  it('returns a valid PerformanceMetrics even when PerformanceObserver is not available', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    setupBrowserMocks()
    vi.stubGlobal('PerformanceObserver', undefined)
    const { collectMetrics } = await import('../../../src/adapters/metrics')

    const result = collectMetrics(2)
    expect(result).toHaveProperty('renderCount', 2)
    expect(result).toHaveProperty('layoutShifts')
    expect(result).toHaveProperty('fpsDrop')
    expect(result).toHaveProperty('memoryUsage')
  })
})
