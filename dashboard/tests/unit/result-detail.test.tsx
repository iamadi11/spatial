/**
 * D05: Result detail view tests
 * Tests for IssueCard and ResultDetailView components.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IssueCard } from '../../src/components/IssueCard'
import { ResultDetailView } from '../../src/components/ResultDetailView'
import type { PerformanceIssue, PerformanceResult } from '../../src/lib/engine'

const warningIssue: PerformanceIssue = {
  rule: 'render-count',
  severity: 'warning',
  message: 'Component re-renders 8 times',
  nodeId: 'root',
}

const errorIssue: PerformanceIssue = {
  rule: 'fps-drop',
  severity: 'error',
  message: 'FPS drop of 15 frames',
  nodeId: 'child-1',
}

const passResult: PerformanceResult = {
  status: 'pass',
  metrics: { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
  issues: [],
}

const failResult: PerformanceResult = {
  status: 'fail',
  metrics: { renderCount: 8, layoutShifts: 2, fpsDrop: 15, memoryUsage: 50 },
  issues: [warningIssue, errorIssue],
}

const unknownResult: PerformanceResult = {
  status: 'unknown',
  metrics: { renderCount: -1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
  issues: [],
  reason: 'metrics contain invalid values',
}

describe('D05: IssueCard', () => {
  // Happy path 1: renders rule name
  it('renders the rule name', () => {
    render(<IssueCard issue={warningIssue} />)
    expect(screen.getByText('render-count')).toBeInTheDocument()
  })

  // Happy path 2: renders message
  it('renders the issue message', () => {
    render(<IssueCard issue={warningIssue} />)
    expect(screen.getByText('Component re-renders 8 times')).toBeInTheDocument()
  })

  // Edge case 1: renders nodeId
  it('renders the affected node ID', () => {
    render(<IssueCard issue={warningIssue} />)
    expect(screen.getByText(/root/)).toBeInTheDocument()
  })

  // Edge case 2: shows error severity badge
  it('renders error severity for error issues', () => {
    render(<IssueCard issue={errorIssue} />)
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  // Failure case: shows warning severity badge
  it('renders warning severity for warning issues', () => {
    render(<IssueCard issue={warningIssue} />)
    expect(screen.getByText('warning')).toBeInTheDocument()
  })
})

describe('D05: ResultDetailView', () => {
  // Happy path 1: PASS result shows green pass banner
  it('shows PASS status for passing result', () => {
    render(<ResultDetailView result={passResult} />)
    expect(screen.getByText(/pass/i)).toBeInTheDocument()
  })

  // Happy path 2: FAIL result shows issues
  it('shows all issues for failing result', () => {
    render(<ResultDetailView result={failResult} />)
    expect(screen.getByText('render-count')).toBeInTheDocument()
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
  })

  // Edge case 1: metrics table shows all 4 metrics
  it('shows all 4 metric rows in a table', () => {
    render(<ResultDetailView result={failResult} />)
    expect(screen.getByText(/renderCount/i)).toBeInTheDocument()
    expect(screen.getByText(/layoutShifts/i)).toBeInTheDocument()
    expect(screen.getByText(/fpsDrop/i)).toBeInTheDocument()
    expect(screen.getByText(/memoryUsage/i)).toBeInTheDocument()
  })

  // Edge case 2: metrics table shows metric values
  it('shows metric values', () => {
    render(<ResultDetailView result={failResult} />)
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  // Failure case: PASS result shows no issues section
  it('shows no issues for PASS result', () => {
    render(<ResultDetailView result={passResult} />)
    expect(screen.queryByText('render-count')).not.toBeInTheDocument()
  })

  // Unknown case: UNKNOWN result shows reason
  it('shows reason for UNKNOWN result', () => {
    render(<ResultDetailView result={unknownResult} />)
    expect(screen.getByText(/unknown/i)).toBeInTheDocument()
    expect(screen.getByText(/metrics contain invalid values/i)).toBeInTheDocument()
  })
})
