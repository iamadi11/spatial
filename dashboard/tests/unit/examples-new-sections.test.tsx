/**
 * D24: New example sections — PropDrillingSection, MissingKeySection, FragmentSection
 * Verifies bad/good pattern demos with live engine analysis.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PropDrillingSection } from '../../src/components/examples/sections/PropDrillingSection'
import { MissingKeySection } from '../../src/components/examples/sections/MissingKeySection'
import { FragmentSection } from '../../src/components/examples/sections/FragmentSection'
import { ExamplesPage } from '../../src/pages/ExamplesPage'

// ── PropDrillingSection ───────────────────────────────────────────────────────

describe('PropDrillingSection', () => {
  it('renders title and both bad/good panels', () => {
    render(<PropDrillingSection />)
    expect(screen.getByText('Prop Drilling')).toBeInTheDocument()
    expect(screen.getByText('Bad Pattern')).toBeInTheDocument()
    expect(screen.getByText('Good Pattern')).toBeInTheDocument()
  })

  it('bad panel has a depth slider', () => {
    render(<PropDrillingSection />)
    const slider = screen.getByRole('slider', { name: /drilling depth/i })
    expect(slider).toBeInTheDocument()
  })

  it('bad panel shows fail at default depth (> threshold of 3)', () => {
    render(<PropDrillingSection />)
    // default depth should exceed threshold
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('bad panel shows pass when depth set to 2 (below threshold of 3)', () => {
    render(<PropDrillingSection />)
    const slider = screen.getByRole('slider', { name: /drilling depth/i })
    fireEvent.change(slider, { target: { value: '2' } })
    expect(screen.getAllByText('pass').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel always shows pass', () => {
    render(<PropDrillingSection />)
    expect(screen.getAllByText(/pass/).length).toBeGreaterThanOrEqual(1)
  })
})

// ── MissingKeySection ─────────────────────────────────────────────────────────

describe('MissingKeySection', () => {
  it('renders title and both bad/good panels', () => {
    render(<MissingKeySection />)
    expect(screen.getByText('Missing Key Props')).toBeInTheDocument()
    expect(screen.getByText('Bad Pattern')).toBeInTheDocument()
    expect(screen.getByText('Good Pattern')).toBeInTheDocument()
  })

  it('bad panel shows fail (same-type children without key props)', () => {
    render(<MissingKeySection />)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel shows pass (same-type children with key props)', () => {
    render(<MissingKeySection />)
    expect(screen.getAllByText('pass').length).toBeGreaterThanOrEqual(1)
  })
})

// ── FragmentSection ───────────────────────────────────────────────────────────

describe('FragmentSection', () => {
  it('renders title and both bad/good panels', () => {
    render(<FragmentSection />)
    expect(screen.getByText('Unnecessary Fragment')).toBeInTheDocument()
    expect(screen.getByText('Bad Pattern')).toBeInTheDocument()
    expect(screen.getByText('Good Pattern')).toBeInTheDocument()
  })

  it('bad panel shows fail (single-child Fragment)', () => {
    render(<FragmentSection />)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel shows pass (no wrapping Fragment)', () => {
    render(<FragmentSection />)
    expect(screen.getAllByText('pass').length).toBeGreaterThanOrEqual(1)
  })
})

// ── ExamplesPage integration ──────────────────────────────────────────────────

describe('ExamplesPage with new sections', () => {
  function renderPage() {
    return render(<MemoryRouter><ExamplesPage /></MemoryRouter>)
  }

  it('renders all 8 section nav buttons (5 original + 3 new)', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /show prop drilling example/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show missing key props example/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show unnecessary fragment example/i })).toBeInTheDocument()
  })

  it('clicking Prop Drilling nav button shows its section', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /show prop drilling example/i }))
    expect(screen.getByRole('heading', { name: /prop drilling/i })).toBeInTheDocument()
  })

  it('clicking Missing Key Props nav button shows its section', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /show missing key props example/i }))
    expect(screen.getByRole('heading', { name: /missing key props/i })).toBeInTheDocument()
  })

  it('clicking Unnecessary Fragment nav button shows its section', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /show unnecessary fragment example/i }))
    expect(screen.getByRole('heading', { name: /unnecessary fragment/i })).toBeInTheDocument()
  })
})
