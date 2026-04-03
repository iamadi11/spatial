/**
 * D03: Rule catalog page tests
 * Tests for RuleCard component and RuleCatalogPage.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RuleCard } from '../../src/components/RuleCard'
import { RuleCatalogPage } from '../../src/pages/RuleCatalogPage'
import type { RuleMetadata } from '../../src/lib/engine'

const warningRule: RuleMetadata = {
  name: 'render-count',
  description: 'Flags components that re-render too many times.',
  severity: 'warning',
  defaultThreshold: 5,
}

const errorRule: RuleMetadata = {
  name: 'fps-drop',
  description: 'Flags when measured FPS drop exceeds threshold.',
  severity: 'error',
  defaultThreshold: 10,
}

describe('D03: RuleCard', () => {
  // Happy path 1: renders rule name
  it('renders the rule name', () => {
    render(<RuleCard rule={warningRule} />)
    expect(screen.getByText('render-count')).toBeInTheDocument()
  })

  // Happy path 2: renders description
  it('renders the description', () => {
    render(<RuleCard rule={warningRule} />)
    expect(screen.getByText('Flags components that re-render too many times.')).toBeInTheDocument()
  })

  // Edge case 1: renders warning severity badge
  it('renders warning severity badge', () => {
    render(<RuleCard rule={warningRule} />)
    expect(screen.getByText('warning')).toBeInTheDocument()
  })

  // Edge case 2: renders error severity badge
  it('renders error severity badge', () => {
    render(<RuleCard rule={errorRule} />)
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  // Failure case: renders threshold when defaultThreshold > 0
  it('renders threshold value when threshold > 0', () => {
    render(<RuleCard rule={warningRule} />)
    expect(screen.getByText(/5/)).toBeInTheDocument()
  })

  // Unknown case: style-complexity has threshold 0 — still renders without crash
  it('renders without crashing when threshold is 0', () => {
    const noThresholdRule: RuleMetadata = { ...warningRule, name: 'style-complexity', defaultThreshold: 0 }
    render(<RuleCard rule={noThresholdRule} />)
    expect(screen.getByText('style-complexity')).toBeInTheDocument()
  })
})

describe('D03: RuleCatalogPage', () => {
  // Happy path 1: renders a card for each rule
  it('renders 10 rule cards', () => {
    render(<RuleCatalogPage />)
    // All 10 rule names should appear
    expect(screen.getByText('render-count')).toBeInTheDocument()
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
    expect(screen.getByText('child-count')).toBeInTheDocument()
    expect(screen.getByText('style-complexity')).toBeInTheDocument()
  })

  // Happy path 2: page has a heading
  it('has a page heading', () => {
    render(<RuleCatalogPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  // Edge case: all 10 rules are rendered
  it('renders all 10 rule names', () => {
    render(<RuleCatalogPage />)
    const expectedRules = [
      'child-count', 'fps-drop', 'inline-style-count', 'layout-shift',
      'memory-usage', 'nesting-depth', 'prop-count', 'render-count',
      'style-complexity', 'total-node-count',
    ]
    for (const name of expectedRules) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })
})
