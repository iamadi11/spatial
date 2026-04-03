/**
 * D08: Issue severity filter tests
 * Tests for the SeverityFilter component and its integration into ResultDetailView.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { PerformanceResult, PerformanceIssue } from '../../src/lib/engine'

const warningIssue: PerformanceIssue = {
  rule: 'render-count',
  severity: 'warning',
  message: 'Re-renders 8 times',
  nodeId: 'root',
}

const errorIssue: PerformanceIssue = {
  rule: 'fps-drop',
  severity: 'error',
  message: 'FPS drop of 15',
  nodeId: 'root',
}

const mixedResult: PerformanceResult = {
  status: 'fail',
  metrics: { renderCount: 8, layoutShifts: 0, fpsDrop: 15, memoryUsage: 10 },
  issues: [warningIssue, errorIssue],
}

const allWarningsResult: PerformanceResult = {
  status: 'fail',
  metrics: { renderCount: 8, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 },
  issues: [warningIssue, { ...warningIssue, rule: 'layout-shift', message: 'Layout shift' }],
}

describe('D08: SeverityFilter component', () => {
  // Happy path 1: All three filter buttons render
  it('renders All, Errors, and Warnings filter buttons', async () => {
    const { SeverityFilter } = await import('../../src/components/SeverityFilter')
    render(<SeverityFilter active="all" onChange={() => {}} counts={{ all: 3, error: 1, warning: 2 }} />)
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /error/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /warning/i })).toBeInTheDocument()
  })

  // Happy path 2: clicking Errors calls onChange with 'error'
  it('calls onChange with "error" when Errors button is clicked', async () => {
    const { SeverityFilter } = await import('../../src/components/SeverityFilter')
    const onChange = vi.fn()
    render(<SeverityFilter active="all" onChange={onChange} counts={{ all: 2, error: 1, warning: 1 }} />)
    fireEvent.click(screen.getByRole('button', { name: /error/i }))
    expect(onChange).toHaveBeenCalledWith('error')
  })

  // Happy path 3: clicking Warnings calls onChange with 'warning'
  it('calls onChange with "warning" when Warnings button is clicked', async () => {
    const { SeverityFilter } = await import('../../src/components/SeverityFilter')
    const onChange = vi.fn()
    render(<SeverityFilter active="all" onChange={onChange} counts={{ all: 2, error: 1, warning: 1 }} />)
    fireEvent.click(screen.getByRole('button', { name: /warning/i }))
    expect(onChange).toHaveBeenCalledWith('warning')
  })

  // Edge case 1: active filter button is visually distinguished (aria-pressed)
  it('marks the active filter button with aria-pressed=true', async () => {
    const { SeverityFilter } = await import('../../src/components/SeverityFilter')
    render(<SeverityFilter active="error" onChange={() => {}} counts={{ all: 2, error: 1, warning: 1 }} />)
    expect(screen.getByRole('button', { name: /error/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute('aria-pressed', 'false')
  })

  // Edge case 2: counts are displayed on each button
  it('shows issue counts on each filter button', async () => {
    const { SeverityFilter } = await import('../../src/components/SeverityFilter')
    render(<SeverityFilter active="all" onChange={() => {}} counts={{ all: 5, error: 2, warning: 3 }} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

describe('D08: ResultDetailView with filter', () => {
  // Happy path 4: selecting "Errors" hides warning issues
  it('hides warning issues when Errors filter is active', async () => {
    const { ResultDetailView } = await import('../../src/components/ResultDetailView')
    render(<ResultDetailView result={mixedResult} />)
    fireEvent.click(screen.getByRole('button', { name: /error/i }))
    expect(screen.queryByText('render-count')).not.toBeInTheDocument()
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
  })

  // Happy path 5: selecting "Warnings" hides error issues
  it('hides error issues when Warnings filter is active', async () => {
    const { ResultDetailView } = await import('../../src/components/ResultDetailView')
    render(<ResultDetailView result={mixedResult} />)
    fireEvent.click(screen.getByRole('button', { name: /warning/i }))
    expect(screen.getByText('render-count')).toBeInTheDocument()
    expect(screen.queryByText('fps-drop')).not.toBeInTheDocument()
  })

  // Happy path 6: "All" shows all issues
  it('shows all issues when All filter is active', async () => {
    const { ResultDetailView } = await import('../../src/components/ResultDetailView')
    render(<ResultDetailView result={mixedResult} />)
    expect(screen.getByText('render-count')).toBeInTheDocument()
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
  })

  // Edge case 3: filtered count badge updates
  it('shows filtered count badge reflecting active filter', async () => {
    const { ResultDetailView } = await import('../../src/components/ResultDetailView')
    render(<ResultDetailView result={mixedResult} />)
    // Default "All" shows 2 of 2
    expect(screen.getByText(/2 of 2/i)).toBeInTheDocument()
    // Switch to errors — 1 of 2
    fireEvent.click(screen.getByRole('button', { name: /error/i }))
    expect(screen.getByText(/1 of 2/i)).toBeInTheDocument()
  })

  // Failure case: result with no issues shows no filter (filter only shown when issues exist)
  it('does not render filter when result has no issues', async () => {
    const { ResultDetailView } = await import('../../src/components/ResultDetailView')
    const passResult: PerformanceResult = {
      status: 'pass',
      metrics: { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
      issues: [],
    }
    render(<ResultDetailView result={passResult} />)
    expect(screen.queryByRole('button', { name: /error/i })).not.toBeInTheDocument()
  })

  // Unknown case: result with only warnings — Errors filter shows 0 count
  it('shows 0 error count when result has only warnings', async () => {
    const { ResultDetailView } = await import('../../src/components/ResultDetailView')
    render(<ResultDetailView result={allWarningsResult} />)
    // Error button should show 0
    const errorBtn = screen.getByRole('button', { name: /error/i })
    expect(errorBtn).toHaveTextContent('0')
  })
})
