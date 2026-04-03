/**
 * D10: Rule catalog search and filter tests
 * Tests for the search input and severity filter on RuleCatalogPage.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RuleCatalogPage } from '../../src/pages/RuleCatalogPage'

describe('D10: Rule catalog search', () => {
  // Happy path 1: search input is rendered
  it('renders a search input', () => {
    render(<RuleCatalogPage />)
    const input = screen.getByRole('textbox', { name: /search/i })
    expect(input).toBeInTheDocument()
  })

  // Happy path 2: typing in search filters visible rule cards
  it('filters rule cards by name (case-insensitive substring match)', () => {
    render(<RuleCatalogPage />)
    const input = screen.getByRole('textbox', { name: /search/i })
    fireEvent.change(input, { target: { value: 'fps' } })
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
    expect(screen.queryByText('render-count')).not.toBeInTheDocument()
  })

  // Happy path 3: clearing search restores all cards
  it('restores all rule cards when search is cleared', () => {
    render(<RuleCatalogPage />)
    const input = screen.getByRole('textbox', { name: /search/i })
    fireEvent.change(input, { target: { value: 'fps' } })
    fireEvent.change(input, { target: { value: '' } })
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
    expect(screen.getByText('render-count')).toBeInTheDocument()
  })

  // Edge case 1: search is case-insensitive
  it('matches rule names case-insensitively', () => {
    render(<RuleCatalogPage />)
    const input = screen.getByRole('textbox', { name: /search/i })
    fireEvent.change(input, { target: { value: 'FPS' } })
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
  })

  // Edge case 2: search with no matches shows empty state
  it('shows no rule cards when search matches nothing', () => {
    render(<RuleCatalogPage />)
    const input = screen.getByRole('textbox', { name: /search/i })
    fireEvent.change(input, { target: { value: 'zzznomatch' } })
    expect(screen.queryByText('fps-drop')).not.toBeInTheDocument()
    expect(screen.queryByText('render-count')).not.toBeInTheDocument()
  })

  // Edge case 3: filtered count label updates with search
  it('displays filtered count when search is active', () => {
    render(<RuleCatalogPage />)
    const input = screen.getByRole('textbox', { name: /search/i })
    fireEvent.change(input, { target: { value: 'count' } })
    // Several rules contain "count": render-count, child-count, inline-style-count, event-handler-count, total-node-count, prop-count
    const countText = screen.getByText(/Showing \d+ of \d+/)
    expect(countText).toBeInTheDocument()
  })
})

describe('D10: Rule catalog severity filter', () => {
  // Happy path 1: severity filter buttons are rendered
  it('renders severity filter buttons: All, warning, error', () => {
    render(<RuleCatalogPage />)
    expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^warning$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^error$/i })).toBeInTheDocument()
  })

  // Happy path 2: "All" is active by default
  it('"All" filter is active by default', () => {
    render(<RuleCatalogPage />)
    const allBtn = screen.getByRole('button', { name: /^all$/i })
    expect(allBtn).toHaveAttribute('aria-pressed', 'true')
  })

  // Happy path 3: clicking "warning" shows only warning-severity rules
  it('clicking "warning" filter shows only warning rules', () => {
    render(<RuleCatalogPage />)
    fireEvent.click(screen.getByRole('button', { name: /^warning$/i }))
    // fps-drop is error severity — should be hidden
    expect(screen.queryByText('fps-drop')).not.toBeInTheDocument()
    // render-count is warning — should be visible
    expect(screen.getByText('render-count')).toBeInTheDocument()
  })

  // Happy path 4: clicking "error" shows only error-severity rules
  it('clicking "error" filter shows only error rules', () => {
    render(<RuleCatalogPage />)
    fireEvent.click(screen.getByRole('button', { name: /^error$/i }))
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
    // render-count is warning — should be hidden
    expect(screen.queryByText('render-count')).not.toBeInTheDocument()
  })

  // Edge case 1: clicking "All" after filtering restores all rules
  it('clicking "All" after severity filter restores all rules', () => {
    render(<RuleCatalogPage />)
    fireEvent.click(screen.getByRole('button', { name: /^warning$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
    expect(screen.getByText('render-count')).toBeInTheDocument()
  })

  // Edge case 2: active filter button has aria-pressed="true"
  it('active severity button has aria-pressed="true"', () => {
    render(<RuleCatalogPage />)
    fireEvent.click(screen.getByRole('button', { name: /^warning$/i }))
    expect(screen.getByRole('button', { name: /^warning$/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^all$/i })).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('D10: Combined search + severity filter', () => {
  // Happy path: search and severity filter combine with AND logic
  it('applies search and severity filter simultaneously', () => {
    render(<RuleCatalogPage />)
    // Filter to warning only
    fireEvent.click(screen.getByRole('button', { name: /^warning$/i }))
    // Then search for "count"
    const input = screen.getByRole('textbox', { name: /search/i })
    fireEvent.change(input, { target: { value: 'count' } })
    // Should show warning rules matching "count"
    expect(screen.getByText('render-count')).toBeInTheDocument()
    // fps-drop is error — should not appear even though it exists
    expect(screen.queryByText('fps-drop')).not.toBeInTheDocument()
  })

  // Edge case: no results when combined filters exclude everything
  it('shows no cards when combined filters have no matches', () => {
    render(<RuleCatalogPage />)
    fireEvent.click(screen.getByRole('button', { name: /^error$/i }))
    const input = screen.getByRole('textbox', { name: /search/i })
    // "render-count" is warning severity — error filter will exclude it
    fireEvent.change(input, { target: { value: 'render-count' } })
    expect(screen.queryByText('render-count')).not.toBeInTheDocument()
  })
})
