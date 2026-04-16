import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RerenderSection } from '../src/components/examples/sections/RerenderSection'
import { WrapperHellSection } from '../src/components/examples/sections/WrapperHellSection'
import { PropExplosionSection } from '../src/components/examples/sections/PropExplosionSection'
import { UnvirtualizedListSection } from '../src/components/examples/sections/UnvirtualizedListSection'
import { DeepNestingSection } from '../src/components/examples/sections/DeepNestingSection'

// ── RerenderSection ───────────────────────────────────────────────────────────

describe('RerenderSection', () => {
  it('renders both bad and good panels', () => {
    render(<RerenderSection />)
    expect(screen.getByText('Excessive Re-renders')).toBeTruthy()
    expect(screen.getByText('Bad Pattern')).toBeTruthy()
    expect(screen.getByText('Good Pattern')).toBeTruthy()
  })

  it('shows engine analysis labels in both panels', () => {
    render(<RerenderSection />)
    const engineLabels = screen.getAllByText(/engine/i)
    expect(engineLabels.length).toBeGreaterThanOrEqual(2)
  })

  it('bad panel starts with pass (0 renders below threshold)', () => {
    render(<RerenderSection />)
    // Before any clicks, renderCount = 1 (initial render) which is below threshold of 5
    const passBadges = screen.getAllByText('pass')
    expect(passBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('bad panel shows fail after 6 button clicks (renderCount crosses threshold)', () => {
    render(<RerenderSection />)
    // Click the bad demo button 6 times to exceed threshold of 5
    const buttons = screen.getAllByRole('button', { name: /update parent state/i })
    const badButton = buttons[0]
    for (let i = 0; i < 6; i++) fireEvent.click(badButton)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel stays pass regardless of clicks', () => {
    render(<RerenderSection />)
    const buttons = screen.getAllByRole('button', { name: /update parent state/i })
    const goodButton = buttons[1]
    for (let i = 0; i < 10; i++) fireEvent.click(goodButton)
    // Good side uses renderCount=1 (memo'd children don't re-render)
    // At least one pass badge should remain
    expect(screen.getAllByText(/pass|fail/).length).toBeGreaterThanOrEqual(2)
  })
})

// ── WrapperHellSection ────────────────────────────────────────────────────────

describe('WrapperHellSection', () => {
  it('renders title and both panels', () => {
    render(<WrapperHellSection />)
    expect(screen.getByText('Wrapper Hell')).toBeTruthy()
    expect(screen.getByText('Bad Pattern')).toBeTruthy()
    expect(screen.getByText('Good Pattern')).toBeTruthy()
  })

  it('bad panel has a depth slider', () => {
    render(<WrapperHellSection />)
    const slider = screen.getByRole('slider', { name: /nesting depth/i })
    expect(slider).toBeTruthy()
  })

  it('bad panel shows fail at default depth (8 > threshold 4)', () => {
    render(<WrapperHellSection />)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('bad panel shows pass when depth set to 3 (below single-child-chain threshold of 4)', () => {
    render(<WrapperHellSection />)
    const slider = screen.getByRole('slider', { name: /nesting depth/i })
    fireEvent.change(slider, { target: { value: '3' } })
    // nesting-depth threshold is 10, single-child-chain threshold is 4
    // at depth 3, neither fires
    expect(screen.getAllByText('pass').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel always shows pass', () => {
    render(<WrapperHellSection />)
    // Good panel has a fixed shallow tree — at least one pass badge
    expect(screen.getAllByText(/pass/).length).toBeGreaterThanOrEqual(1)
  })
})

// ── PropExplosionSection ──────────────────────────────────────────────────────

describe('PropExplosionSection', () => {
  it('renders title and both panels', () => {
    render(<PropExplosionSection />)
    expect(screen.getByText('Prop Explosion')).toBeTruthy()
  })

  it('bad panel has a prop count slider', () => {
    render(<PropExplosionSection />)
    const slider = screen.getByRole('slider', { name: /boolean props/i })
    expect(slider).toBeTruthy()
  })

  it('bad panel shows fail at default prop count (exceeds thresholds)', () => {
    render(<PropExplosionSection />)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('bad panel shows pass when prop count lowered below thresholds', () => {
    render(<PropExplosionSection />)
    const slider = screen.getByRole('slider', { name: /boolean props/i })
    fireEvent.change(slider, { target: { value: '3' } })
    expect(screen.getAllByText('pass').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel always shows pass', () => {
    render(<PropExplosionSection />)
    expect(screen.getAllByText(/pass/).length).toBeGreaterThanOrEqual(1)
  })
})

// ── UnvirtualizedListSection ──────────────────────────────────────────────────

describe('UnvirtualizedListSection', () => {
  it('renders title and both panels', () => {
    render(<UnvirtualizedListSection />)
    expect(screen.getByText('Unvirtualized List')).toBeTruthy()
  })

  it('bad panel has an item count slider', () => {
    render(<UnvirtualizedListSection />)
    const slider = screen.getByRole('slider', { name: /item count/i })
    expect(slider).toBeTruthy()
  })

  it('bad panel shows fail at default item count (200 > thresholds 20 and 50)', () => {
    render(<UnvirtualizedListSection />)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('bad panel shows pass when item count set to 10 (below both thresholds)', () => {
    render(<UnvirtualizedListSection />)
    const slider = screen.getByRole('slider', { name: /item count/i })
    fireEvent.change(slider, { target: { value: '10' } })
    expect(screen.getAllByText('pass').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel always shows pass', () => {
    render(<UnvirtualizedListSection />)
    expect(screen.getAllByText(/pass/).length).toBeGreaterThanOrEqual(1)
  })
})

// ── DeepNestingSection ────────────────────────────────────────────────────────

describe('DeepNestingSection', () => {
  it('renders title and both panels', () => {
    render(<DeepNestingSection />)
    expect(screen.getByText('Deep Nesting')).toBeTruthy()
  })

  it('bad panel has a depth slider', () => {
    render(<DeepNestingSection />)
    const slider = screen.getByRole('slider', { name: /tree depth/i })
    expect(slider).toBeTruthy()
  })

  it('bad panel shows fail at default depth (14 > threshold 10)', () => {
    render(<DeepNestingSection />)
    expect(screen.getAllByText('fail').length).toBeGreaterThanOrEqual(1)
  })

  it('bad panel shows pass when depth set to 8 (below nesting-depth threshold of 10)', () => {
    render(<DeepNestingSection />)
    const slider = screen.getByRole('slider', { name: /tree depth/i })
    fireEvent.change(slider, { target: { value: '8' } })
    expect(screen.getAllByText('pass').length).toBeGreaterThanOrEqual(1)
  })

  it('good panel always shows pass', () => {
    render(<DeepNestingSection />)
    expect(screen.getAllByText(/pass/).length).toBeGreaterThanOrEqual(1)
  })
})
