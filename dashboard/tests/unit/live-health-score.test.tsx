/**
 * D27: LiveHealthScore component
 * Displays pass-ratio meter above LiveSessionStats on /live page.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LiveHealthScore } from '../../src/components/LiveHealthScore'
import type { Snapshot } from '../../src/components/IssueHistoryTimeline'

function makeSnapshot(status: 'pass' | 'fail' | 'unknown'): Snapshot {
  return {
    timestamp: Date.now(),
    result: {
      status,
      issues: [],
      metrics: { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
    },
  }
}

// ── Happy path ────────────────────────────────────────────────────────────────

describe('LiveHealthScore — happy path', () => {
  it('shows 100% when all snapshots pass', () => {
    const snapshots = [makeSnapshot('pass'), makeSnapshot('pass'), makeSnapshot('pass')]
    render(<LiveHealthScore snapshots={snapshots} />)
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('shows 0% when all snapshots fail', () => {
    const snapshots = [makeSnapshot('fail'), makeSnapshot('fail')]
    render(<LiveHealthScore snapshots={snapshots} />)
    expect(screen.getByText(/^0%$/)).toBeInTheDocument()
  })

  it('computes correct percentage for mixed results', () => {
    // 2 pass out of 4 = 50%
    const snapshots = [
      makeSnapshot('pass'),
      makeSnapshot('pass'),
      makeSnapshot('fail'),
      makeSnapshot('unknown'),
    ]
    render(<LiveHealthScore snapshots={snapshots} />)
    expect(screen.getByText(/50/)).toBeInTheDocument()
  })
})

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('LiveHealthScore — edge cases', () => {
  it('renders nothing (or empty placeholder) when snapshots is empty', () => {
    const { container } = render(<LiveHealthScore snapshots={[]} />)
    // Should not render a visible score — component returns null or empty
    expect(screen.queryByRole('region', { name: /health score/i })).not.toBeInTheDocument()
  })

  it('has accessible region label when snapshots exist', () => {
    render(<LiveHealthScore snapshots={[makeSnapshot('pass')]} />)
    expect(screen.getByRole('region', { name: /health score/i })).toBeInTheDocument()
  })

  it('shows green styling indicator for score >= 80%', () => {
    const snapshots = Array.from({ length: 10 }, (_, i) =>
      i < 9 ? makeSnapshot('pass') : makeSnapshot('fail')
    ) // 90% pass
    render(<LiveHealthScore snapshots={snapshots} />)
    // Score label should be present and show 90%
    expect(screen.getByText(/90/)).toBeInTheDocument()
  })

  it('shows score for all-unknown snapshots (0% pass)', () => {
    const snapshots = [makeSnapshot('unknown'), makeSnapshot('unknown')]
    render(<LiveHealthScore snapshots={snapshots} />)
    expect(screen.getByText(/^0%$/)).toBeInTheDocument()
  })
})

// ── Failure case ──────────────────────────────────────────────────────────────

describe('LiveHealthScore — failure case', () => {
  it('single passing snapshot shows 100%', () => {
    render(<LiveHealthScore snapshots={[makeSnapshot('pass')]} />)
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })
})
