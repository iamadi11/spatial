/**
 * D22: Dark mode toggle — system preference + manual override via localStorage
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeToggle } from '../../src/components/ThemeToggle'

// Mock window.matchMedia (not available in jsdom by default)
function setupMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: prefersDark && query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  })
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark', 'light')
    setupMatchMedia(false)
    cleanup()
  })

  // Happy path 1: renders a button with accessible label
  it('renders a toggle button with aria-label', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /toggle (dark|light) mode/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-label')
  })

  // Happy path 2: clicking toggles the dark class on <html>
  it('clicking the button toggles dark class on document.documentElement', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /toggle (dark|light) mode/i })
    const initialHasDark = document.documentElement.classList.contains('dark')
    fireEvent.click(btn)
    expect(document.documentElement.classList.contains('dark')).toBe(!initialHasDark)
  })

  // Edge case 1: localStorage is read on mount — persisted preference respected
  it('reads persisted dark preference from localStorage on mount', () => {
    localStorage.setItem('spatial-theme', 'dark')
    render(<ThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  // Edge case 2: persisted light preference respected
  it('reads persisted light preference from localStorage on mount', () => {
    localStorage.setItem('spatial-theme', 'light')
    document.documentElement.classList.add('dark') // start dark, should clear it
    render(<ThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  // Edge case 3: after toggle, preference is written to localStorage
  it('writes theme preference to localStorage after toggle', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /toggle (dark|light) mode/i })
    fireEvent.click(btn)
    const stored = localStorage.getItem('spatial-theme')
    expect(stored === 'dark' || stored === 'light').toBe(true)
  })

  // Edge case 4: system preference for dark mode sets dark class when no localStorage
  it('applies dark class when system prefers dark and no localStorage', () => {
    setupMatchMedia(true) // system prefers dark
    render(<ThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  // Failure case: no crash when matchMedia is unavailable
  it('does not throw when matchMedia is not defined', () => {
    const original = window.matchMedia
    ;(window as unknown as Record<string, unknown>).matchMedia = undefined
    expect(() => render(<ThemeToggle />)).not.toThrow()
    ;(window as unknown as Record<string, unknown>).matchMedia = original
  })
})
