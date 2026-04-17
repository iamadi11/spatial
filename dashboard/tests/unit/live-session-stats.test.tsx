/**
 * D25: LiveSessionStats component
 * Compact stats panel: pass/fail/unknown counts + top-3 rules by frequency.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LiveSessionStats } from '../../src/components/LiveSessionStats'
import type { Snapshot } from '../../src/components/IssueHistoryTimeline'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSnapshot(status: 'pass' | 'fail' | 'unknown', rules: string[]): Snapshot {
  return {
    timestamp: Date.now(),
    result: {
      status,
      issues: rules.map(rule => ({
        rule,
        severity: 'warning' as const,
        message: `${rule} fired`,
        nodeId: 'node-1',
      })),
      metrics: { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
    },
  }
}

// ── Happy path ────────────────────────────────────────────────────────────────

describe('LiveSessionStats — happy path', () => {
  it('shows total snapshot count', () => {
    const snapshots = [
      makeSnapshot('pass', []),
      makeSnapshot('fail', ['render-count']),
      makeSnapshot('fail', ['render-count']),
    ]
    render(<LiveSessionStats snapshots={snapshots} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows correct pass, fail, and unknown counts', () => {
    const snapshots = [
      makeSnapshot('pass', []),
      makeSnapshot('pass', []),
      makeSnapshot('fail', ['render-count']),
      makeSnapshot('unknown', []),
    ]
    render(<LiveSessionStats snapshots={snapshots} />)
    // Two passes, one fail, one unknown
    expect(screen.getByLabelText(/pass count/i)).toHaveTextContent('2')
    expect(screen.getByLabelText(/fail count/i)).toHaveTextContent('1')
    expect(screen.getByLabelText(/unknown count/i)).toHaveTextContent('1')
  })

  it('shows top-3 rules by occurrence across all snapshots', () => {
    const snapshots = [
      makeSnapshot('fail', ['render-count', 'prop-count']),
      makeSnapshot('fail', ['render-count', 'child-count']),
      makeSnapshot('fail', ['render-count', 'prop-count']),
    ]
    render(<LiveSessionStats snapshots={snapshots} />)
    // render-count: 3, prop-count: 2, child-count: 1
    expect(screen.getByText('render-count')).toBeInTheDocument()
    expect(screen.getByText('prop-count')).toBeInTheDocument()
    expect(screen.getByText('child-count')).toBeInTheDocument()
  })
})

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('LiveSessionStats — edge cases', () => {
  it('renders empty state when snapshots array is empty', () => {
    render(<LiveSessionStats snapshots={[]} />)
    expect(screen.getByText(/no snapshots/i)).toBeInTheDocument()
  })

  it('shows only as many top rules as exist (fewer than 3)', () => {
    const snapshots = [makeSnapshot('fail', ['render-count'])]
    render(<LiveSessionStats snapshots={snapshots} />)
    expect(screen.getByText('render-count')).toBeInTheDocument()
    // Only 1 unique rule — no second rule label rendered for top rules
    expect(screen.queryByText('prop-count')).not.toBeInTheDocument()
  })

  it('shows zero count for unknown when all snapshots are pass', () => {
    const snapshots = [makeSnapshot('pass', []), makeSnapshot('pass', [])]
    render(<LiveSessionStats snapshots={snapshots} />)
    expect(screen.getByLabelText(/unknown count/i)).toHaveTextContent('0')
  })

  it('has accessible section label', () => {
    render(<LiveSessionStats snapshots={[]} />)
    expect(
      screen.getByRole('region', { name: /session stats/i })
    ).toBeInTheDocument()
  })
})

// ── Failure case ──────────────────────────────────────────────────────────────

describe('LiveSessionStats — failure case', () => {
  it('shows only top 3 rules even when more than 3 rules fire', () => {
    const snapshots = [
      makeSnapshot('fail', ['rule-a', 'rule-b', 'rule-c', 'rule-d', 'rule-e']),
    ]
    render(<LiveSessionStats snapshots={snapshots} />)
    // Top 3 section should show exactly 3 rule names (first 3 alphabetically or by freq)
    const ruleEls = screen.getAllByLabelText(/top rule/i)
    expect(ruleEls.length).toBeLessThanOrEqual(3)
  })
})
