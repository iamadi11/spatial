/**
 * D04: Analysis playground page tests
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NodeTreeInput } from '../../src/components/NodeTreeInput'
import { MetricsInput } from '../../src/components/MetricsInput'
import { AnalysisResult } from '../../src/components/AnalysisResult'
import { AnalysisPlaygroundPage } from '../../src/pages/AnalysisPlaygroundPage'
import type { PerformanceResult, PerformanceMetrics } from '../../src/lib/engine'

const validJson = JSON.stringify({ id: 'root', type: 'div' })
const invalidJson = '{ not valid json'

const passResult: PerformanceResult = {
  status: 'pass',
  metrics: { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
  issues: [],
}

const failResult: PerformanceResult = {
  status: 'fail',
  metrics: { renderCount: 10, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
  issues: [{ rule: 'render-count', severity: 'warning', message: 'Too many renders', nodeId: 'root' }],
}

const unknownResult: PerformanceResult = {
  status: 'unknown',
  metrics: { renderCount: -1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
  issues: [],
  reason: 'Invalid metrics',
}

describe('D04: NodeTreeInput', () => {
  // Happy path 1: renders a textarea
  it('renders a textarea', () => {
    render(<NodeTreeInput value={validJson} onChange={() => undefined} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  // Happy path 2: shows no error for valid JSON
  it('shows no parse error for valid JSON', () => {
    render(<NodeTreeInput value={validJson} onChange={() => undefined} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  // Edge case: shows error for invalid JSON
  it('shows a parse error for invalid JSON', () => {
    render(<NodeTreeInput value={invalidJson} onChange={() => undefined} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

describe('D04: MetricsInput', () => {
  const defaultMetrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

  // Happy path 1: renders 4 number inputs
  it('renders 4 number inputs', () => {
    render(<MetricsInput metrics={defaultMetrics} onChange={() => undefined} />)
    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs).toHaveLength(4)
  })

  // Happy path 2: shows current values
  it('shows current metric values', () => {
    render(<MetricsInput metrics={{ renderCount: 7, layoutShifts: 2, fpsDrop: 5, memoryUsage: 50 }} onChange={() => undefined} />)
    expect(screen.getByDisplayValue('7')).toBeInTheDocument()
  })
})

describe('D04: AnalysisResult', () => {
  // Happy path 1: shows pass status
  it('shows pass status', () => {
    render(<AnalysisResult result={passResult} />)
    expect(screen.getByText(/pass/i)).toBeInTheDocument()
  })

  // Happy path 2: shows fail status and issues
  it('shows fail status and issue rule name', () => {
    render(<AnalysisResult result={failResult} />)
    expect(screen.getByText(/fail/i)).toBeInTheDocument()
    expect(screen.getByText(/render-count/i)).toBeInTheDocument()
  })

  // Edge case: shows unknown status with reason
  it('shows unknown status', () => {
    render(<AnalysisResult result={unknownResult} />)
    expect(screen.getByText(/unknown/i)).toBeInTheDocument()
  })

  // Failure case: shows issue message
  it('shows issue message', () => {
    render(<AnalysisResult result={failResult} />)
    expect(screen.getByText(/Too many renders/i)).toBeInTheDocument()
  })
})

describe('D04: AnalysisPlaygroundPage', () => {
  // Happy path: page renders with a Run Analysis button
  it('renders Run Analysis button', () => {
    render(<AnalysisPlaygroundPage />)
    expect(screen.getByRole('button', { name: /run analysis/i })).toBeInTheDocument()
  })

  // Happy path: page pre-populates with example data
  it('pre-populates the textarea with example JSON', () => {
    render(<AnalysisPlaygroundPage />)
    const textarea = screen.getByRole('textbox')
    expect((textarea as HTMLTextAreaElement).value.length).toBeGreaterThan(0)
  })

  // Edge case: clicking Run Analysis shows a result
  it('shows a result after clicking Run Analysis', () => {
    render(<AnalysisPlaygroundPage />)
    fireEvent.click(screen.getByRole('button', { name: /run analysis/i }))
    const section = screen.getByRole('region', { name: /analysis result/i })
    expect(section).toBeInTheDocument()
  })

  // Unknown case: page has a heading
  it('has a page heading', () => {
    render(<AnalysisPlaygroundPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

describe('D13: Playground preset buttons', () => {
  // Happy path 1: renders "Load passing example" button with aria-label
  it('renders a Load passing example button', () => {
    render(<AnalysisPlaygroundPage />)
    expect(screen.getByRole('button', { name: /load passing example/i })).toBeInTheDocument()
  })

  // Happy path 2: renders "Load failing example" button with aria-label
  it('renders a Load failing example button', () => {
    render(<AnalysisPlaygroundPage />)
    expect(screen.getByRole('button', { name: /load failing example/i })).toBeInTheDocument()
  })

  // Edge case 1: clicking "Load passing example" populates textarea with valid JSON
  it('populates textarea with valid JSON when passing example is loaded', () => {
    render(<AnalysisPlaygroundPage />)
    fireEvent.click(screen.getByRole('button', { name: /load passing example/i }))
    const textarea = screen.getByRole('textbox')
    expect(() => JSON.parse((textarea as HTMLTextAreaElement).value)).not.toThrow()
  })

  // Edge case 2: clicking "Load failing example" populates textarea with valid JSON
  it('populates textarea with valid JSON when failing example is loaded', () => {
    render(<AnalysisPlaygroundPage />)
    fireEvent.click(screen.getByRole('button', { name: /load failing example/i }))
    const textarea = screen.getByRole('textbox')
    expect(() => JSON.parse((textarea as HTMLTextAreaElement).value)).not.toThrow()
  })

  // Failure case: running analysis after loading failing example produces a fail result
  it('produces a fail result when failing example is run', () => {
    render(<AnalysisPlaygroundPage />)
    fireEvent.click(screen.getByRole('button', { name: /load failing example/i }))
    fireEvent.click(screen.getByRole('button', { name: /run analysis/i }))
    // The status badge text is exactly "fail"
    expect(screen.getByText('fail')).toBeInTheDocument()
  })

  // Unknown case: running analysis after loading passing example produces a pass result
  it('produces a pass result when passing example is run', () => {
    render(<AnalysisPlaygroundPage />)
    fireEvent.click(screen.getByRole('button', { name: /load passing example/i }))
    fireEvent.click(screen.getByRole('button', { name: /run analysis/i }))
    // The status badge text is exactly "pass"
    expect(screen.getByText('pass')).toBeInTheDocument()
  })
})
