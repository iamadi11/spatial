/**
 * D17: Examples page — bad vs good pattern sections with live engine analysis
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ExamplesPage } from '../../src/pages/ExamplesPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <ExamplesPage />
    </MemoryRouter>
  )
}

describe('D17: ExamplesPage', () => {
  // Happy path 1: renders with section nav and defaults to first section
  it('renders with section nav visible and Re-renders section active by default', () => {
    renderPage()
    expect(screen.getByRole('complementary', { name: /example sections/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /excessive re-renders/i })).toBeInTheDocument()
  })

  // Happy path 2: clicking a section nav button switches active section
  it('switches to Wrapper Hell section on nav click', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /show wrapper hell example/i }))
    expect(screen.getByRole('heading', { name: /wrapper hell/i })).toBeInTheDocument()
  })

  // Edge case 1: all 5 section nav buttons are present
  it('renders all 5 section nav buttons', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /show excessive re-renders example/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show wrapper hell example/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show prop explosion example/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show unvirtualized list example/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show deep nesting example/i })).toBeInTheDocument()
  })

  // Edge case 2: bad analysis shows fail after clicks, good always stays pass
  it('bad analysis card shows fail after 6 clicks, good stays pass in Re-renders section', () => {
    renderPage()
    // Good panel uses renderCount=1 — always pass
    const goodCard = screen.getByRole('region', { name: /engine analysis: good: with react\.memo/i })
    expect(goodCard).toHaveTextContent('pass')
    // Bad panel: click 6 times to exceed render-count threshold of 5
    const badButton = screen.getAllByRole('button', { name: /update parent state/i })[0]
    for (let i = 0; i < 6; i++) fireEvent.click(badButton)
    const badCard = screen.getByRole('region', { name: /engine analysis: bad: no memoization/i })
    expect(badCard).toHaveTextContent('fail')
  })

  // Failure case: nav buttons have aria-label attributes
  it('section nav buttons have aria-label attributes', () => {
    renderPage()
    const buttons = screen.getAllByRole('button', { name: /show .* example/i })
    buttons.forEach(btn => {
      expect(btn).toHaveAttribute('aria-label')
    })
  })

  // Unknown/deterministic: switching sections and back always returns same content
  it('switching to prop explosion and back to re-renders renders same content', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /show prop explosion example/i }))
    expect(screen.getByRole('heading', { name: /prop explosion/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /show excessive re-renders example/i }))
    expect(screen.getByRole('heading', { name: /excessive re-renders/i })).toBeInTheDocument()
  })
})
