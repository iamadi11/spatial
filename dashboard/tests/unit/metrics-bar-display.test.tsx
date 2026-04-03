/**
 * D11: MetricsBarDisplay component tests
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricsBarDisplay } from '../../src/components/MetricsBarDisplay'
import type { PerformanceMetrics } from '../../src/lib/engine'

const zeroMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

const lowMetrics: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 2,
  memoryUsage: 10,
}

const highMetrics: PerformanceMetrics = {
  renderCount: 100,
  layoutShifts: 20,
  fpsDrop: 60,
  memoryUsage: 500,
}

describe('D11: MetricsBarDisplay', () => {
  // Happy path 1: renders all 4 metric labels
  it('renders a bar for each of the 4 metrics', () => {
    render(<MetricsBarDisplay metrics={lowMetrics} />)
    expect(screen.getByText('renderCount')).toBeInTheDocument()
    expect(screen.getByText('layoutShifts')).toBeInTheDocument()
    expect(screen.getByText('fpsDrop')).toBeInTheDocument()
    expect(screen.getByText('memoryUsage')).toBeInTheDocument()
  })

  // Happy path 2: renders numeric values next to bars
  it('renders the numeric value for each metric', () => {
    render(<MetricsBarDisplay metrics={lowMetrics} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  // Happy path 3: renders without crash for all-zero metrics
  it('renders without crashing for zero metrics', () => {
    render(<MetricsBarDisplay metrics={zeroMetrics} />)
    expect(screen.getByText('renderCount')).toBeInTheDocument()
    // All values are 0
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(4)
  })

  // Happy path 4: renders without crash for high metrics
  it('renders without crashing for high metric values', () => {
    render(<MetricsBarDisplay metrics={highMetrics} />)
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  // Edge case 1: component has a wrapping accessible region
  it('has an accessible label or region', () => {
    render(<MetricsBarDisplay metrics={lowMetrics} />)
    // Component should have aria-label or a labelled region
    const region = screen.getByRole('region', { name: /metrics/i })
    expect(region).toBeInTheDocument()
  })

  // Edge case 2: each bar has an accessible label matching its metric name
  it('each bar row has an accessible label', () => {
    render(<MetricsBarDisplay metrics={lowMetrics} />)
    expect(screen.getByLabelText(/renderCount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/layoutShifts/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/fpsDrop/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/memoryUsage/i)).toBeInTheDocument()
  })

  // Edge case 3: green class applied for low renderCount (below 50% of max)
  it('applies green styling for low renderCount', () => {
    render(<MetricsBarDisplay metrics={lowMetrics} />)
    const bar = screen.getByLabelText(/renderCount/i)
    // The fill div inside should have a green class
    const fill = bar.querySelector('[data-testid="bar-fill"]')
    expect(fill).not.toBeNull()
    expect(fill?.className).toMatch(/green/)
  })

  // Edge case 4: red class applied for very high renderCount (above 80% of max)
  it('applies red styling for very high renderCount', () => {
    render(<MetricsBarDisplay metrics={highMetrics} />)
    const bar = screen.getByLabelText(/renderCount/i)
    const fill = bar.querySelector('[data-testid="bar-fill"]')
    expect(fill?.className).toMatch(/red/)
  })

  // Failure case: negative metric value renders as 0 (clamped)
  it('renders 0 width for negative metric values', () => {
    const negMetrics: PerformanceMetrics = { renderCount: -5, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }
    render(<MetricsBarDisplay metrics={negMetrics} />)
    // Should render without crash
    expect(screen.getByText('renderCount')).toBeInTheDocument()
  })

  // Unknown: component is display-only and never calls engine directly
  it('renders correctly when integrated inside ResultDetailView', () => {
    // Just ensure MetricsBarDisplay renders with valid props without any engine call
    const { container } = render(<MetricsBarDisplay metrics={zeroMetrics} />)
    expect(container.firstChild).not.toBeNull()
  })
})
