/**
 * ThemeToggle — D22
 * Dark/light mode toggle button.
 *
 * Priority on mount:
 *   1. localStorage 'spatial-theme' ('dark' | 'light')
 *   2. window.matchMedia('prefers-color-scheme: dark')
 *   3. Default: dark
 *
 * Applies 'dark' class to document.documentElement on each change.
 * Persists preference to localStorage.
 */
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'spatial-theme'

function getInitialTheme(): 'dark' | 'light' {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // localStorage unavailable (e.g. private browsing restriction) — fall through
  }

  try {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  } catch {
    // matchMedia unavailable — fall through
  }

  return 'dark' // default
}

function applyTheme(theme: 'dark' | 'light') {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore storage errors
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getInitialTheme())

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function toggle() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={`Toggle ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors w-full"
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}
