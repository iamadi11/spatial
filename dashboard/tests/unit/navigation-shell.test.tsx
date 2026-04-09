/**
 * D06: Navigation shell tests
 * Tests for Sidebar, AppShell, and App routing.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from '../../src/components/Sidebar'
import { AppShell } from '../../src/components/AppShell'
import App from '../../src/App'

describe('D06: Sidebar', () => {
  // Happy path 1: renders app name
  it('renders the app name', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByText('Spatial Dashboard')).toBeInTheDocument()
  })

  // Happy path 2: renders Home, Rules, and Examples nav links
  it('renders Home, Rules, and Examples nav links', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /rules/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /examples/i })).toBeInTheDocument()
  })

  // Edge case 1: Rules link points to /rules
  it('Rules link points to /rules', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /rules/i })
    expect(link).toHaveAttribute('href', '/rules')
  })

  // Edge case 2: Examples link points to /examples
  it('Examples link points to /examples', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /examples/i })
    expect(link).toHaveAttribute('href', '/examples')
  })

  // Failure case: shows engine version in footer
  it('shows the engine version in the footer', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByText(/0\.\d+\.\d+/)).toBeInTheDocument()
  })
})

describe('D06: AppShell', () => {
  // Happy path: renders sidebar and page content slot
  it('renders sidebar alongside children', () => {
    render(
      <MemoryRouter>
        <AppShell>
          <div>Page content</div>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByText('Spatial Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  // Unknown case: shell renders without crashing when no children given
  it('renders without crashing with no children', () => {
    render(
      <MemoryRouter>
        <AppShell>{null}</AppShell>
      </MemoryRouter>
    )
    expect(screen.getByText('Spatial Dashboard')).toBeInTheDocument()
  })
})

describe('D06: App routing', () => {
  // Happy path 1: / shows home landing (D19)
  it('/ renders home landing page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('main', { name: /spatial product overview/i })).toBeInTheDocument()
  })

  // Happy path 2: /rules shows Rule Catalog page
  it('/rules renders Rule Catalog page', () => {
    render(
      <MemoryRouter initialEntries={['/rules']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /rule catalog/i })).toBeInTheDocument()
  })

  // Edge case: /examples shows Examples page
  it('/examples renders Examples page', () => {
    render(
      <MemoryRouter initialEntries={['/examples']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Performance Patterns')).toBeInTheDocument()
  })
})
