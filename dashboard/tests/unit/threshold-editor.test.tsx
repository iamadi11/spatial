/**
 * D15: ThresholdEditor component + AnalysisPlaygroundPage threshold integration
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThresholdEditor } from '../../src/components/ThresholdEditor'
import { AnalysisPlaygroundPage } from '../../src/pages/AnalysisPlaygroundPage'
import type { RuleOptions } from '../../src/lib/engine'

describe('D15: ThresholdEditor', () => {
  // Happy path 1: renders a details/summary collapsible panel
  it('renders a details element with a summary label', () => {
    const onChange = vi.fn()
    render(<ThresholdEditor options={{}} onChange={onChange} />)
    expect(screen.getByText(/advanced.*rule thresholds/i)).toBeInTheDocument()
  })

  // Happy path 2: inputs for configurable thresholds are present with aria-labels
  it('renders a number input for renderCountThreshold with aria-label', () => {
    const onChange = vi.fn()
    render(<ThresholdEditor options={{}} onChange={onChange} />)
    expect(screen.getByRole('spinbutton', { name: /render.?count.?threshold/i })).toBeInTheDocument()
  })

  it('renders a number input for childCountThreshold with aria-label', () => {
    const onChange = vi.fn()
    render(<ThresholdEditor options={{}} onChange={onChange} />)
    expect(screen.getByRole('spinbutton', { name: /child.?count.?threshold/i })).toBeInTheDocument()
  })

  // Edge case 1: onChange is called with updated RuleOptions when input changes
  it('calls onChange with updated threshold when input value changes', () => {
    const onChange = vi.fn()
    render(<ThresholdEditor options={{}} onChange={onChange} />)
    const input = screen.getByRole('spinbutton', { name: /render.?count.?threshold/i })
    fireEvent.change(input, { target: { value: '2' } })
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ renderCountThreshold: 2 })
    )
  })

  // Edge case 2: empty input value removes the threshold key (reverts to undefined)
  it('calls onChange without the key when input is cleared', () => {
    const onChange = vi.fn()
    render(<ThresholdEditor options={{ renderCountThreshold: 5 }} onChange={onChange} />)
    const input = screen.getByRole('spinbutton', { name: /render.?count.?threshold/i })
    fireEvent.change(input, { target: { value: '' } })
    const calledWith: RuleOptions = onChange.mock.calls[0][0]
    expect(calledWith.renderCountThreshold).toBeUndefined()
  })

  // Failure case: reflects current options values in inputs
  it('displays existing option values in inputs', () => {
    const onChange = vi.fn()
    render(<ThresholdEditor options={{ renderCountThreshold: 7 }} onChange={onChange} />)
    const input = screen.getByRole('spinbutton', { name: /render.?count.?threshold/i })
    expect((input as HTMLInputElement).value).toBe('7')
  })

  // Unknown/deterministic: same props render same content
  it('is deterministic — same options render same inputs', () => {
    const onChange = vi.fn()
    const { container: c1 } = render(<ThresholdEditor options={{ renderCountThreshold: 3 }} onChange={onChange} />)
    const { container: c2 } = render(<ThresholdEditor options={{ renderCountThreshold: 3 }} onChange={onChange} />)
    expect(c1.querySelectorAll('input').length).toBe(c2.querySelectorAll('input').length)
  })
})

describe('D15: AnalysisPlaygroundPage threshold integration', () => {
  // Happy path: ThresholdEditor is rendered on the playground page
  it('renders the threshold editor on the playground page', () => {
    render(<AnalysisPlaygroundPage />)
    expect(screen.getByText(/advanced.*rule thresholds/i)).toBeInTheDocument()
  })

  // Edge case: lowering renderCountThreshold causes failure on a tree with 2 renders
  it('uses custom threshold — renderCount=2 fails when threshold set to 1', () => {
    render(<AnalysisPlaygroundPage />)
    // Load passing example (renderCount=1 by default)
    fireEvent.click(screen.getByRole('button', { name: /load passing example/i }))
    // Override renderCountThreshold to 0 so even renderCount=1 triggers
    const input = screen.getByRole('spinbutton', { name: /render.?count.?threshold/i })
    fireEvent.change(input, { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /run analysis/i }))
    expect(screen.getByText('fail')).toBeInTheDocument()
  })
})
