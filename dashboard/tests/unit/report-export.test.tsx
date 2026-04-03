/**
 * D09: Report text export tests
 * Tests for the CopyReportButton component and clipboard integration in ResultDetailView.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { PerformanceResult } from '../../src/lib/engine'

const passResult: PerformanceResult = {
  status: 'pass',
  metrics: { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 5 },
  issues: [],
}

const failResult: PerformanceResult = {
  status: 'fail',
  metrics: { renderCount: 8, layoutShifts: 2, fpsDrop: 15, memoryUsage: 10 },
  issues: [
    { rule: 'render-count', severity: 'warning', message: 'Re-renders 8 times', nodeId: 'root' },
  ],
}

// Mock navigator.clipboard
const mockWriteText = vi.fn().mockResolvedValue(undefined)
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
})

beforeEach(() => {
  mockWriteText.mockClear()
})

describe('D09: CopyReportButton component', () => {
  // Happy path 1: renders a "Copy report" button
  it('renders a Copy report button', async () => {
    const { CopyReportButton } = await import('../../src/components/CopyReportButton')
    render(<CopyReportButton result={passResult} />)
    expect(screen.getByRole('button', { name: /copy report/i })).toBeInTheDocument()
  })

  // Happy path 2: clicking calls navigator.clipboard.writeText with formatted report
  it('calls clipboard.writeText with formatReport output on click', async () => {
    const { CopyReportButton } = await import('../../src/components/CopyReportButton')
    render(<CopyReportButton result={passResult} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy report/i }))
    })
    expect(mockWriteText).toHaveBeenCalledTimes(1)
    const written = mockWriteText.mock.calls[0][0] as string
    expect(written).toMatch(/status.*pass/i)
    expect(written).toMatch(/metrics/i)
  })

  // Happy path 3: shows "Copied!" confirmation after click
  it('shows "Copied!" confirmation after click', async () => {
    const { CopyReportButton } = await import('../../src/components/CopyReportButton')
    render(<CopyReportButton result={passResult} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy report/i }))
    })
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
  })

  // Edge case 1: button has accessible aria-label
  it('has an aria-label on the button', async () => {
    const { CopyReportButton } = await import('../../src/components/CopyReportButton')
    render(<CopyReportButton result={failResult} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-label')
  })

  // Edge case 2: copied text includes issues when result has issues
  it('copied text includes issue details for fail result', async () => {
    const { CopyReportButton } = await import('../../src/components/CopyReportButton')
    render(<CopyReportButton result={failResult} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy report/i }))
    })
    const written = mockWriteText.mock.calls[0][0] as string
    expect(written).toMatch(/render-count/i)
  })
})

describe('D09: ResultDetailView with Copy report button', () => {
  // Happy path 4: ResultDetailView renders the Copy report button
  it('renders Copy report button inside ResultDetailView', async () => {
    const { ResultDetailView } = await import('../../src/components/ResultDetailView')
    render(<ResultDetailView result={passResult} />)
    expect(screen.getByRole('button', { name: /copy report/i })).toBeInTheDocument()
  })

  // Happy path 5: Copy report works for fail result inside ResultDetailView
  it('copying from ResultDetailView with fail result includes issues text', async () => {
    const { ResultDetailView } = await import('../../src/components/ResultDetailView')
    render(<ResultDetailView result={failResult} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy report/i }))
    })
    const written = mockWriteText.mock.calls[0][0] as string
    expect(written).toMatch(/fail/i)
    expect(written).toMatch(/render-count/i)
  })

  // Failure case: clipboard failure does not throw (button stays interactive)
  it('does not throw when clipboard.writeText rejects', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Permission denied'))
    const { CopyReportButton } = await import('../../src/components/CopyReportButton')
    render(<CopyReportButton result={passResult} />)
    await expect(
      act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /copy report/i }))
      })
    ).resolves.not.toThrow()
  })

  // Unknown case: result with unknown status — report still copies
  it('copies report for unknown status result', async () => {
    const { CopyReportButton } = await import('../../src/components/CopyReportButton')
    const unknownResult: PerformanceResult = {
      status: 'unknown',
      metrics: { renderCount: 0, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
      issues: [],
      reason: 'No data',
    }
    render(<CopyReportButton result={unknownResult} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy report/i }))
    })
    const written = mockWriteText.mock.calls[0][0] as string
    expect(written).toMatch(/unknown/i)
  })
})
