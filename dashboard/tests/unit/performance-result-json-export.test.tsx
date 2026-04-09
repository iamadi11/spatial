/**
 * D18: PerformanceResult JSON copy and download
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { PerformanceResult } from '../../src/lib/engine'

const passResult: PerformanceResult = {
  status: 'pass',
  metrics: { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 5 },
  issues: [],
}

const mockWriteText = vi.fn().mockResolvedValue(undefined)
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
})

beforeEach(() => {
  mockWriteText.mockClear()
})

describe('D18: formatPerformanceResultJson (via engine adapter)', () => {
  it('exports deterministic JSON for a result', async () => {
    const { formatPerformanceResultJson } = await import('../../src/lib/engine')
    const s = formatPerformanceResultJson(passResult)
    expect(JSON.parse(s)).toEqual(passResult)
  })
})

describe('D18: PerformanceResultJsonActions', () => {
  it('renders copy and download buttons inside the export group', async () => {
    const { PerformanceResultJsonActions } = await import('../../src/components/PerformanceResultJsonActions')
    render(<PerformanceResultJsonActions result={passResult} />)
    expect(screen.getByRole('group', { name: /analysis json export/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy analysis json/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download analysis json/i })).toBeInTheDocument()
  })

  it('copies pretty-printed JSON on copy click', async () => {
    const { PerformanceResultJsonActions } = await import('../../src/components/PerformanceResultJsonActions')
    render(<PerformanceResultJsonActions result={passResult} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy analysis json/i }))
    })
    expect(mockWriteText).toHaveBeenCalledTimes(1)
    const written = mockWriteText.mock.calls[0][0] as string
    expect(written).toContain('"status"')
    expect(written).toContain('"pass"')
    expect(JSON.parse(written)).toEqual(passResult)
  })

  it('shows JSON copied confirmation after copy', async () => {
    const { PerformanceResultJsonActions } = await import('../../src/components/PerformanceResultJsonActions')
    render(<PerformanceResultJsonActions result={passResult} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy analysis json/i }))
    })
    expect(screen.getByRole('button', { name: /copied analysis json/i })).toBeInTheDocument()
  })

  it('download creates a blob URL and triggers anchor click', async () => {
    const createObjectURL = vi.fn(() => 'blob:mock')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL })

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    const { PerformanceResultJsonActions } = await import('../../src/components/PerformanceResultJsonActions')
    render(<PerformanceResultJsonActions result={passResult} />)
    fireEvent.click(screen.getByRole('button', { name: /download analysis json/i }))

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    const blobArg = createObjectURL.mock.calls[0][0] as Blob
    expect(blobArg).toBeInstanceOf(Blob)
    expect(clickSpy).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')

    clickSpy.mockRestore()
    vi.unstubAllGlobals()
  })

  it('does not throw when clipboard.writeText rejects', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('denied'))
    const { PerformanceResultJsonActions } = await import('../../src/components/PerformanceResultJsonActions')
    render(<PerformanceResultJsonActions result={passResult} />)
    await expect(
      act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /copy analysis json/i }))
      })
    ).resolves.not.toThrow()
  })

  it('copies JSON for unknown status including reason', async () => {
    const unknownResult: PerformanceResult = {
      status: 'unknown',
      metrics: { renderCount: 0, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
      issues: [],
      reason: 'No metrics',
    }
    const { PerformanceResultJsonActions } = await import('../../src/components/PerformanceResultJsonActions')
    render(<PerformanceResultJsonActions result={unknownResult} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy analysis json/i }))
    })
    const written = mockWriteText.mock.calls[0][0] as string
    expect(JSON.parse(written).status).toBe('unknown')
    expect(JSON.parse(written).reason).toBe('No metrics')
  })
})

describe('D18: LiveAnalysisCard includes JSON actions', () => {
  it('renders JSON export controls on each analysis card', async () => {
    const { LiveAnalysisCard } = await import('../../src/components/examples/LiveAnalysisCard')
    const tree = { id: 'r', type: 'Box', children: [] }
    const metrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }
    render(<LiveAnalysisCard tree={tree} metrics={metrics} label="unit test" />)
    expect(screen.getByRole('group', { name: /analysis json export/i })).toBeInTheDocument()
  })
})
