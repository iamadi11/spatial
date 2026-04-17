/**
 * Tests for fragment-single-child rule (item 037)
 * Flags Fragment nodes that wrap exactly one child — unnecessary structural overhead.
 */
import { describe, it, expect } from 'vitest'
import { createFragmentSingleChildRule } from '../../src/rules/fragment-single-child'
import type { ComponentNode, PerformanceMetrics } from '../../src/types'

const METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

describe('fragment-single-child rule', () => {
  const rule = createFragmentSingleChildRule()

  // Happy path 1: Fragment with 2 children — valid use, no issue
  it('does not fire for Fragment with 2 children', () => {
    const node: ComponentNode = {
      id: 'f1',
      type: 'Fragment',
      children: [
        { id: 'c1', type: 'A' },
        { id: 'c2', type: 'B' },
      ],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Happy path 2: non-Fragment type with 1 child — not a fragment, no issue
  it('does not fire for a non-Fragment node with 1 child', () => {
    const node: ComponentNode = {
      id: 'div',
      type: 'Div',
      children: [{ id: 'c1', type: 'Span' }],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Edge case 1: Fragment with exactly 1 child — fires
  it('fires for Fragment node with exactly 1 child', () => {
    const node: ComponentNode = {
      id: 'frag',
      type: 'Fragment',
      children: [{ id: 'only', type: 'Button' }],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('fragment-single-child')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('frag')
    expect(result.issue?.message).toMatch(/Fragment/)
  })

  // Edge case 2: React.Fragment type with 1 child — fires
  it('fires for React.Fragment node with exactly 1 child', () => {
    const node: ComponentNode = {
      id: 'rf',
      type: 'React.Fragment',
      children: [{ id: 'only', type: 'Div' }],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('fragment-single-child')
  })

  // Edge case 3: Fragment with 0 children (empty fragment) — no issue
  it('does not fire for Fragment with no children', () => {
    const node: ComponentNode = { id: 'empty', type: 'Fragment', children: [] }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Edge case 4: Fragment with 3+ children — valid use, no issue
  it('does not fire for Fragment with 3 children', () => {
    const node: ComponentNode = {
      id: 'f3',
      type: 'Fragment',
      children: [
        { id: 'a', type: 'A' },
        { id: 'b', type: 'B' },
        { id: 'c', type: 'C' },
      ],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Failure case: Fragment with no children field at all — no issue
  it('does not fire for Fragment node with no children field', () => {
    const node: ComponentNode = { id: 'bare', type: 'Fragment' }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Unknown/deterministic: same input always same output
  it('is deterministic — same Fragment node always yields same result', () => {
    const node: ComponentNode = {
      id: 'frag',
      type: 'Fragment',
      children: [{ id: 'only', type: 'Div' }],
    }
    const r1 = rule.detect(node, METRICS)
    const r2 = rule.detect(node, METRICS)
    expect(r1.triggered).toBe(r2.triggered)
    expect(r1.issue?.rule).toBe(r2.issue?.rule)
  })
})
