import { describe, it, expect } from 'vitest'
import { computeMaxDepth, createNestingDepthRule } from '../../../src/rules/nesting-depth'
import type { ComponentNode } from '../../../src/types'

// Helpers
function makeChain(depth: number): ComponentNode {
  // Creates a linear chain: root → child → grandchild → ... (depth levels total)
  const root: ComponentNode = { id: 'n0', type: 'div' }
  let current = root
  for (let i = 1; i < depth; i++) {
    const child: ComponentNode = { id: `n${i}`, type: 'span' }
    current.children = [child]
    current = child
  }
  return root
}

describe('computeMaxDepth', () => {
  // Happy path 1: single root node → depth 1
  it('returns 1 for a single root node with no children', () => {
    const root: ComponentNode = { id: 'root', type: 'div' }
    expect(computeMaxDepth(root)).toBe(1)
  })

  // Happy path 2: linear chain of 5 → depth 5
  it('returns correct depth for a linear chain', () => {
    const root = makeChain(5)
    expect(computeMaxDepth(root)).toBe(5)
  })

  // Happy path 3: branching tree — returns the deepest branch
  it('returns the depth of the deepest branch in a branching tree', () => {
    const root: ComponentNode = {
      id: 'root',
      type: 'div',
      children: [
        { id: 'a', type: 'div', children: [{ id: 'a1', type: 'span' }] }, // depth 3
        { id: 'b', type: 'div' }, // depth 2
      ],
    }
    expect(computeMaxDepth(root)).toBe(3)
  })

  // Edge case 1: empty children array — same as no children
  it('returns 1 for a node with an empty children array', () => {
    const root: ComponentNode = { id: 'root', type: 'div', children: [] }
    expect(computeMaxDepth(root)).toBe(1)
  })

  // Edge case 2: wide flat tree (many children, no nesting) → depth 2
  it('returns 2 for a flat tree with many direct children', () => {
    const root: ComponentNode = {
      id: 'root',
      type: 'div',
      children: Array.from({ length: 50 }, (_, i) => ({ id: `c${i}`, type: 'span' })),
    }
    expect(computeMaxDepth(root)).toBe(2)
  })
})

describe('createNestingDepthRule', () => {
  // Happy path 1: shallow tree — not triggered
  it('does not trigger when max depth is within threshold', () => {
    const rule = createNestingDepthRule(5)
    const root = makeChain(3)
    const result = rule.check(root)
    expect(result).toBeNull()
  })

  // Happy path 2: tree exactly at threshold — not triggered
  it('does not trigger when max depth exactly equals threshold', () => {
    const rule = createNestingDepthRule(5)
    const root = makeChain(5)
    const result = rule.check(root)
    expect(result).toBeNull()
  })

  // Happy path 3: tree exceeds threshold — triggered
  it('triggers when max depth exceeds threshold', () => {
    const rule = createNestingDepthRule(5)
    const root = makeChain(6)
    const result = rule.check(root)
    expect(result).not.toBeNull()
    expect(result?.rule).toBe('nesting-depth')
    expect(result?.severity).toBe('warning')
    expect(result?.nodeId).toBe('root')
    expect(result?.message).toContain('6')
  })

  // Edge case 1: single root node — not triggered
  it('does not trigger for a single root node', () => {
    const rule = createNestingDepthRule(5)
    const root: ComponentNode = { id: 'root', type: 'div' }
    expect(rule.check(root)).toBeNull()
  })

  // Edge case 2: very deeply nested — triggered, message contains depth
  it('triggers for a deeply nested tree and message contains the actual depth', () => {
    const rule = createNestingDepthRule(5)
    const root = makeChain(20)
    const result = rule.check(root)
    expect(result).not.toBeNull()
    expect(result?.message).toContain('20')
    expect(result?.message).toContain('5') // threshold
  })

  // Edge case 3: threshold 1 — any child triggers
  it('triggers with threshold 1 when tree has any children', () => {
    const rule = createNestingDepthRule(1)
    const root: ComponentNode = {
      id: 'root',
      type: 'div',
      children: [{ id: 'child', type: 'span' }],
    }
    expect(rule.check(root)).not.toBeNull()
  })

  // Failure case: default threshold is sensible (root alone should not trigger)
  it('uses a sensible default threshold, single root does not trigger', () => {
    const rule = createNestingDepthRule()
    const root: ComponentNode = { id: 'root', type: 'div' }
    expect(rule.check(root)).toBeNull()
  })

  // Unknown/deterministic: same input always same output
  it('is deterministic — same tree always yields same result', () => {
    const rule = createNestingDepthRule(5)
    const root = makeChain(7)
    const r1 = rule.check(root)
    const r2 = rule.check(root)
    expect(r1?.triggered ?? false).toBe(r2?.triggered ?? false)
    expect(r1?.rule).toBe(r2?.rule)
  })
})
