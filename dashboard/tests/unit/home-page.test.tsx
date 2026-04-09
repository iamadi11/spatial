/**
 * D19: Home landing page
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from '../../src/pages/HomePage'
import App from '../../src/App'

describe('D19: HomePage', () => {
  it('renders overview heading and primary navigation links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByRole('main', { name: /spatial product overview/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^spatial$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open the rule catalog/i })).toHaveAttribute('href', '/rules')
    expect(screen.getByRole('link', { name: /open pattern examples/i })).toHaveAttribute('href', '/examples')
  })
})

describe('D19: App / route', () => {
  it('renders HomePage at / instead of redirecting to rules', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('main', { name: /spatial product overview/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /rule catalog/i })).not.toBeInTheDocument()
  })
})
