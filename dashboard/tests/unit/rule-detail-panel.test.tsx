/**
 * D16: Rule detail panel — expandable details + Try in Playground link on RuleCard
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RuleCard } from '../../src/components/RuleCard'
import type { RuleMetadata } from '../../src/lib/engine'

const warningRule: RuleMetadata = {
  name: 'render-count',
  description: 'Flags components that re-render too many times.',
  severity: 'warning',
  defaultThreshold: 5,
}

const errorRule: RuleMetadata = {
  name: 'fps-drop',
  description: 'Flags when FPS drop exceeds threshold.',
  severity: 'error',
  defaultThreshold: 10,
}

function renderInRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('D16: RuleCard detail panel', () => {
  // Happy path 1: shows toggle button with aria-expanded=false by default
  it('renders a Show details button with aria-expanded=false by default', () => {
    renderInRouter(<RuleCard rule={warningRule} />)
    const btn = screen.getByRole('button', { name: /show details/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  // Happy path 2: clicking button toggles expanded state and shows playground link
  it('expands on click — shows severity explanation, playground link, and aria-expanded=true', () => {
    renderInRouter(<RuleCard rule={warningRule} />)
    fireEvent.click(screen.getByRole('button', { name: /show details/i }))
    expect(screen.getByRole('button', { name: /hide details/i })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: /try in playground/i })).toBeInTheDocument()
    expect(screen.getByText(/warning.*investigate/i)).toBeInTheDocument()
  })

  // Edge case 1: clicking again collapses — link hidden, aria-expanded back to false
  it('collapses on second click — link gone, aria-expanded false', () => {
    renderInRouter(<RuleCard rule={warningRule} />)
    fireEvent.click(screen.getByRole('button', { name: /show details/i }))
    fireEvent.click(screen.getByRole('button', { name: /hide details/i }))
    expect(screen.getByRole('button', { name: /show details/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: /try in playground/i })).not.toBeInTheDocument()
  })

  // Edge case 2: playground link points to /examples
  it('Try in Playground link navigates to /examples', () => {
    renderInRouter(<RuleCard rule={warningRule} />)
    fireEvent.click(screen.getByRole('button', { name: /show details/i }))
    const link = screen.getByRole('link', { name: /try in playground/i })
    expect(link).toHaveAttribute('href', '/examples')
  })

  // Failure case: error-severity rule shows "error = critical" explanation
  it('shows error = critical explanation for error severity rules', () => {
    renderInRouter(<RuleCard rule={errorRule} />)
    fireEvent.click(screen.getByRole('button', { name: /show details/i }))
    expect(screen.getByText(/error.*critical/i)).toBeInTheDocument()
  })

  // Unknown/deterministic: toggle button always renders regardless of metadata
  it('always renders the toggle button regardless of rule metadata', () => {
    const zeroThresholdRule: RuleMetadata = {
      name: 'style-complexity',
      description: 'Flags expensive CSS.',
      severity: 'warning',
      defaultThreshold: 0,
    }
    renderInRouter(<RuleCard rule={zeroThresholdRule} />)
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument()
  })
})
