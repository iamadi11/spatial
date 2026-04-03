/**
 * D07: Live analysis page tests
 * Tests for src/lib/live.ts (bridge reader) and LiveAnalysisPage component.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import type { PerformanceResult } from '../../src/lib/engine'

type SpatialBridge = { result: PerformanceResult; timestamp: number }

const mockResult: PerformanceResult = {
  status: 'pass',
  metrics: { renderCount: 3, layoutShifts: 0, fpsDrop: 0, memoryUsage: 20 },
  issues: [],
}

const failResult: PerformanceResult = {
  status: 'fail',
  metrics: { renderCount: 8, layoutShifts: 4, fpsDrop: 0, memoryUsage: 20 },
  issues: [{ rule: 'render-count', severity: 'warning', message: 'Re-renders 8 times', nodeId: 'root' }],
}

// --- src/lib/live.ts tests ---

describe('D07: readBridge', () => {
  beforeEach(() => {
    delete (window as unknown as Record<string, unknown>).__SPATIAL__
  })

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).__SPATIAL__
  })

  // Happy path 1: returns BridgeData when window.__SPATIAL__ is set
  it('returns the stored BridgeData when __SPATIAL__ is populated', async () => {
    const { readBridge } = await import('../../src/lib/live')
    const bridge: SpatialBridge = { result: mockResult, timestamp: Date.now() }
    ;(window as unknown as Record<string, unknown>).__SPATIAL__ = bridge

    const data = readBridge()
    expect(data).not.toBeNull()
    expect(data!.result).toEqual(mockResult)
    expect(typeof data!.timestamp).toBe('number')
  })

  // Happy path 2: returns null when __SPATIAL__ is not set
  it('returns null when window.__SPATIAL__ is not set', async () => {
    const { readBridge } = await import('../../src/lib/live')
    expect(readBridge()).toBeNull()
  })

  // Edge case: timestamp is preserved exactly
  it('preserves the exact timestamp from the bridge', async () => {
    const { readBridge } = await import('../../src/lib/live')
    const ts = 1712345678000
    ;(window as unknown as Record<string, unknown>).__SPATIAL__ = { result: mockResult, timestamp: ts }

    expect(readBridge()!.timestamp).toBe(ts)
  })

  // Failure case: returns null when __SPATIAL__ is explicitly undefined
  it('returns null when __SPATIAL__ is explicitly undefined', async () => {
    const { readBridge } = await import('../../src/lib/live')
    ;(window as unknown as Record<string, unknown>).__SPATIAL__ = undefined
    expect(readBridge()).toBeNull()
  })
})

// --- LiveAnalysisPage component tests ---

describe('D07: LiveAnalysisPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    delete (window as unknown as Record<string, unknown>).__SPATIAL__
  })

  afterEach(() => {
    vi.useRealTimers()
    delete (window as unknown as Record<string, unknown>).__SPATIAL__
  })

  // Happy path 1: shows disconnected / waiting state when no bridge data
  it('shows a waiting/disconnected message when no bridge data', async () => {
    const { LiveAnalysisPage } = await import('../../src/pages/LiveAnalysisPage')
    render(<LiveAnalysisPage />)
    expect(screen.getByText(/waiting|disconnected|no data/i)).toBeInTheDocument()
  })

  // Happy path 2: shows setup instructions when disconnected
  it('shows SpatialProvider setup instructions when disconnected', async () => {
    const { LiveAnalysisPage } = await import('../../src/pages/LiveAnalysisPage')
    render(<LiveAnalysisPage />)
    expect(screen.getByText(/SpatialProvider/i)).toBeInTheDocument()
  })

  // Happy path 3: renders ResultDetailView when bridge data is present
  it('renders the PerformanceResult when bridge data is available', async () => {
    ;(window as unknown as Record<string, unknown>).__SPATIAL__ = {
      result: mockResult,
      timestamp: Date.now(),
    }
    const { LiveAnalysisPage } = await import('../../src/pages/LiveAnalysisPage')
    render(<LiveAnalysisPage />)
    await act(async () => { vi.advanceTimersByTime(600) })
    expect(screen.getByText(/pass/i)).toBeInTheDocument()
  })

  // Happy path 4: shows "last updated" timestamp when result is present
  it('shows a last updated label when result is present', async () => {
    ;(window as unknown as Record<string, unknown>).__SPATIAL__ = {
      result: mockResult,
      timestamp: Date.now(),
    }
    const { LiveAnalysisPage } = await import('../../src/pages/LiveAnalysisPage')
    render(<LiveAnalysisPage />)
    await act(async () => { vi.advanceTimersByTime(600) })
    expect(screen.getByText(/last updated/i)).toBeInTheDocument()
  })

  // Edge case 1: updates when new bridge data arrives after initial render
  it('updates the displayed result when bridge data changes', async () => {
    const { LiveAnalysisPage } = await import('../../src/pages/LiveAnalysisPage')
    render(<LiveAnalysisPage />)

    // Initially disconnected
    expect(screen.getByText(/waiting|disconnected|no data/i)).toBeInTheDocument()

    // Bridge data arrives
    await act(async () => {
      ;(window as unknown as Record<string, unknown>).__SPATIAL__ = {
        result: failResult,
        timestamp: Date.now(),
      }
      vi.advanceTimersByTime(600)
    })

    expect(screen.getByText(/fail/i)).toBeInTheDocument()
  })

  // Edge case 2: connected state shows a live indicator
  it('shows a connected/live indicator when bridge data is present', async () => {
    ;(window as unknown as Record<string, unknown>).__SPATIAL__ = {
      result: mockResult,
      timestamp: Date.now(),
    }
    const { LiveAnalysisPage } = await import('../../src/pages/LiveAnalysisPage')
    render(<LiveAnalysisPage />)
    await act(async () => { vi.advanceTimersByTime(600) })
    expect(screen.getByText(/live\s*[—–-]\s*connected/i)).toBeInTheDocument()
  })

  // Unknown case: unknown status result is displayed correctly
  it('renders UNKNOWN status result from bridge data', async () => {
    const unknownResult: PerformanceResult = {
      status: 'unknown',
      metrics: { renderCount: -1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
      issues: [],
      reason: 'invalid metrics',
    }
    ;(window as unknown as Record<string, unknown>).__SPATIAL__ = {
      result: unknownResult,
      timestamp: Date.now(),
    }
    const { LiveAnalysisPage } = await import('../../src/pages/LiveAnalysisPage')
    render(<LiveAnalysisPage />)
    await act(async () => { vi.advanceTimersByTime(600) })
    expect(screen.getByText(/unknown/i)).toBeInTheDocument()
  })
})
