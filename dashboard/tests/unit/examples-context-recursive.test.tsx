/**
 * D26: New example sections — ContextInstabilitySection, RecursiveComponentSection
 * Verifies bad/good pattern demos with live engine analysis.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ContextInstabilitySection } from '../../src/components/examples/sections/ContextInstabilitySection'
import { RecursiveComponentSection } from '../../src/components/examples/sections/RecursiveComponentSection'
import { ExamplesPage } from '../../src/pages/ExamplesPage'

// ── ContextInstabilitySection ─────────────────────────────────────────────────

describe('ContextInstabilitySection', () => {
  it('renders title and both bad/good panels', () => {
    render(<ContextInstabilitySection />)
    expect(screen.getByText('Context Value Instability')).toBeInTheDocument()
    expect(screen.getByText('Bad Pattern')).toBeInTheDocument()
    expect(screen.getByText('Good Pattern')).toBeInTheDocument()
  })

  it('bad panel shows fail (Provider with object value)', () => {
    render(<ContextInstabilitySection />)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel shows pass (Provider with primitive value)', () => {
    render(<ContextInstabilitySection />)
    expect(screen.getAllByText(/pass/).length).toBeGreaterThanOrEqual(1)
  })
})

// ── RecursiveComponentSection ─────────────────────────────────────────────────

describe('RecursiveComponentSection', () => {
  it('renders title and both bad/good panels', () => {
    render(<RecursiveComponentSection />)
    expect(screen.getByText('Recursive Component')).toBeInTheDocument()
    expect(screen.getByText('Bad Pattern')).toBeInTheDocument()
    expect(screen.getByText('Good Pattern')).toBeInTheDocument()
  })

  it('bad panel shows fail (component type in own ancestor chain)', () => {
    render(<RecursiveComponentSection />)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel shows pass (unique types at each level)', () => {
    render(<RecursiveComponentSection />)
    expect(screen.getAllByText(/pass/).length).toBeGreaterThanOrEqual(1)
  })
})

// ── ExamplesPage integration ──────────────────────────────────────────────────

describe('ExamplesPage with D26 sections', () => {
  function renderPage() {
    return render(<MemoryRouter><ExamplesPage /></MemoryRouter>)
  }

  it('renders nav buttons for context instability and recursive component', () => {
    renderPage()
    expect(
      screen.getByRole('button', { name: /show context value instability example/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /show recursive component example/i })
    ).toBeInTheDocument()
  })

  it('clicking Context Value Instability nav shows its section', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /show context value instability example/i }))
    expect(
      screen.getByRole('heading', { name: /context value instability/i })
    ).toBeInTheDocument()
  })

  it('clicking Recursive Component nav shows its section', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /show recursive component example/i }))
    expect(
      screen.getByRole('heading', { name: /recursive component/i })
    ).toBeInTheDocument()
  })
})
