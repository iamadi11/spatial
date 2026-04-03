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

  // Happy path 2: renders both nav links
  it('renders Rules and Analyze nav links', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /rules/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /analyze/i })).toBeInTheDocument()
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

  // Edge case 2: Analyze link points to /analyze
  it('Analyze link points to /analyze', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /analyze/i })
    expect(link).toHaveAttribute('href', '/analyze')
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
  // Happy path 1: / redirects to /rules and shows Rule Catalog heading
  it('/ redirects to Rule Catalog page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /rule catalog/i })).toBeInTheDocument()
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

  // Edge case: /analyze shows Analysis Playground page
  it('/analyze renders Analysis Playground page', () => {
    render(
      <MemoryRouter initialEntries={['/analyze']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /analysis playground/i })).toBeInTheDocument()
  })
})
