import { describe, it, expect } from 'vitest'
import { countNodes, createTotalNodeCountRule } from '../../../src/rules/total-node-count'
import type { ComponentNode } from '../../../src/types'

function makeTree(totalNodes: number): ComponentNode {
  // Builds a flat tree: root with (totalNodes - 1) direct children
  return {
    id: 'root',
    type: 'div',
    children: Array.from({ length: totalNodes - 1 }, (_, i) => ({
      id: `child-${i}`,
      type: 'span',
    })),
  }
}

describe('countNodes', () => {
  // Happy path 1: single node
  it('returns 1 for a single root node', () => {
    const root: ComponentNode = { id: 'root', type: 'div' }
    expect(countNodes(root)).toBe(1)
  })

  // Happy path 2: root + children
  it('counts root + all children correctly', () => {
    const root = makeTree(6) // root + 5 children = 6
    expect(countNodes(root)).toBe(6)
  })

  // Happy path 3: nested tree
  it('counts all nodes in a nested tree', () => {
    const root: ComponentNode = {
      id: 'root',
      type: 'div',
      children: [
        {
          id: 'a',
          type: 'div',
          children: [
            { id: 'a1', type: 'span' },
            { id: 'a2', type: 'span' },
          ],
        },
        { id: 'b', type: 'div' },
      ],
    }
    // root + a + a1 + a2 + b = 5
    expect(countNodes(root)).toBe(5)
  })

  // Edge case 1: empty children array
  it('returns 1 for a node with an empty children array', () => {
    const root: ComponentNode = { id: 'root', type: 'div', children: [] }
    expect(countNodes(root)).toBe(1)
  })
})

describe('createTotalNodeCountRule', () => {
  // Happy path 1: small tree within threshold
  it('does not trigger when total nodes are within threshold', () => {
    const rule = createTotalNodeCountRule(100)
    const root = makeTree(50)
    expect(rule.check(root)).toBeNull()
  })

  // Happy path 2: exactly at threshold
  it('does not trigger when total nodes exactly equal threshold', () => {
    const rule = createTotalNodeCountRule(100)
    const root = makeTree(100)
    expect(rule.check(root)).toBeNull()
  })

  // Happy path 3: exceeds threshold — triggered
  it('triggers when total nodes exceed threshold', () => {
    const rule = createTotalNodeCountRule(100)
    const root = makeTree(101)
    const result = rule.check(root)
    expect(result).not.toBeNull()
    expect(result?.rule).toBe('total-node-count')
    expect(result?.severity).toBe('warning')
    expect(result?.nodeId).toBe('root')
    expect(result?.message).toContain('101')
    expect(result?.message).toContain('100')
  })

  // Edge case 1: single root node
  it('does not trigger for a single root node', () => {
    const rule = createTotalNodeCountRule(100)
    const root: ComponentNode = { id: 'root', type: 'div' }
    expect(rule.check(root)).toBeNull()
  })

  // Edge case 2: threshold 0 — any node triggers
  it('triggers with threshold 0 even for a single node', () => {
    const rule = createTotalNodeCountRule(0)
    const root: ComponentNode = { id: 'root', type: 'div' }
    expect(rule.check(root)).not.toBeNull()
  })

  // Edge case 3: very large tree
  it('triggers for a very large tree and message contains exact count', () => {
    const rule = createTotalNodeCountRule(100)
    const root = makeTree(500)
    const result = rule.check(root)
    expect(result).not.toBeNull()
    expect(result?.message).toContain('500')
  })

  // Failure case: default threshold, single root should not trigger
  it('uses a sensible default threshold — single root does not trigger', () => {
    const rule = createTotalNodeCountRule()
    const root: ComponentNode = { id: 'root', type: 'div' }
    expect(rule.check(root)).toBeNull()
  })

  // Unknown/deterministic: same tree always same result
  it('is deterministic — same tree produces same result on repeated calls', () => {
    const rule = createTotalNodeCountRule(100)
    const root = makeTree(150)
    const r1 = rule.check(root)
    const r2 = rule.check(root)
    expect(r1?.rule).toBe(r2?.rule)
    expect(r1?.message).toBe(r2?.message)
  })
})
