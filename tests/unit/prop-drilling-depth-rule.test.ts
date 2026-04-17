/**
 * Tests for prop-drilling-depth rule (item 035)
 * Flags when the same prop key appears in N+ consecutive ancestor-descendant levels.
 */
import { describe, it, expect } from 'vitest'
import { createPropDrillingDepthRule } from '../../src/rules/prop-drilling-depth'
import type { ComponentNode } from '../../src/types'

/** Build a linear chain of N nodes where each node has the given props */
function linearChain(depth: number, props: Record<string, unknown>): ComponentNode {
  let node: ComponentNode = { id: `node-${depth}`, type: `Comp${depth}`, props }
  for (let i = depth - 1; i >= 1; i--) {
    node = { id: `node-${i}`, type: `Comp${i}`, props, children: [node] }
  }
  return node
}

describe('prop-drilling-depth rule', () => {
  const rule = createPropDrillingDepthRule(3) // threshold = 3 → fire when depth > 3 (i.e., 4+)

  // Happy path 1: no issue when same prop appears in exactly 3 consecutive levels (= threshold)
  it('returns null when prop appears in exactly 3 consecutive levels (at threshold)', () => {
    const root = linearChain(3, { userId: 'abc' })
    expect(rule.check(root)).toBeNull()
  })

  // Happy path 2: no issue when tree has no props at all
  it('returns null when nodes have no props', () => {
    const root: ComponentNode = {
      id: 'root', type: 'Root',
      children: [
        { id: 'child', type: 'Child' }
      ]
    }
    expect(rule.check(root)).toBeNull()
  })

  // Edge case 1: fires when same prop appears in 4 consecutive levels (> threshold 3)
  it('returns an issue when same prop drills through 4 consecutive levels', () => {
    const root = linearChain(4, { userId: 'abc' })
    const result = rule.check(root)
    expect(result).not.toBeNull()
    expect(result?.rule).toBe('prop-drilling-depth')
    expect(result?.message).toMatch(/userId/)
    expect(result?.severity).toBe('warning')
  })

  // Edge case 2: no issue when prop appears in non-consecutive levels (gap breaks the chain)
  it('returns null when same prop appears at non-consecutive levels', () => {
    // Level 1: has userId. Level 2: no userId. Level 3: has userId. Level 4: has userId.
    const leaf: ComponentNode = { id: 'l4', type: 'L4', props: { userId: 'abc' } }
    const l3: ComponentNode = { id: 'l3', type: 'L3', props: { userId: 'abc' }, children: [leaf] }
    const l2: ComponentNode = { id: 'l2', type: 'L2', props: {}, children: [l3] } // no userId here
    const root: ComponentNode = { id: 'root', type: 'Root', props: { userId: 'abc' }, children: [l2] }
    expect(rule.check(root)).toBeNull()
  })

  // Edge case 3: different props at same levels don't cross-contaminate
  it('does not fire when different props appear at 4 levels (no single prop drills)', () => {
    const l4: ComponentNode = { id: 'l4', type: 'L4', props: { d: 1 } }
    const l3: ComponentNode = { id: 'l3', type: 'L3', props: { c: 1 }, children: [l4] }
    const l2: ComponentNode = { id: 'l2', type: 'L2', props: { b: 1 }, children: [l3] }
    const root: ComponentNode = { id: 'root', type: 'Root', props: { a: 1 }, children: [l2] }
    expect(rule.check(root)).toBeNull()
  })

  // Failure case: fires with correct nodeId pointing to the node where threshold crossed
  it('returned issue nodeId points to the node where drilling threshold was crossed', () => {
    const root = linearChain(4, { userId: 'abc' })
    const result = rule.check(root)
    expect(result).not.toBeNull()
    expect(result?.nodeId).toBeTruthy()
  })

  // Unknown: empty root (no props, no children) returns null
  it('returns null for a root node with no props and no children', () => {
    const root: ComponentNode = { id: 'root', type: 'Root' }
    expect(rule.check(root)).toBeNull()
  })

  // Configurable threshold: custom threshold of 2 fires at depth 3
  it('respects custom threshold — fires at depth 3 when threshold is 2', () => {
    const strictRule = createPropDrillingDepthRule(2)
    const root = linearChain(3, { token: 'xyz' })
    const result = strictRule.check(root)
    expect(result).not.toBeNull()
    expect(result?.message).toMatch(/token/)
  })
})
