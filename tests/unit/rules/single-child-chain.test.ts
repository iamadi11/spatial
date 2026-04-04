import { describe, it, expect } from 'vitest'
import { createSingleChildChainRule } from '../../../src/rules/single-child-chain'
import type { ComponentNode } from '../../../src/types'

/** Build a linear single-child chain of `length` nodes starting at root. */
function makeChain(length: number, idPrefix = 'n'): ComponentNode {
  const root: ComponentNode = { id: `${idPrefix}0`, type: 'Wrapper' }
  let current = root
  for (let i = 1; i < length; i++) {
    const child: ComponentNode = { id: `${idPrefix}${i}`, type: 'Wrapper' }
    current.children = [child]
    current = child
  }
  return root
}

describe('single-child-chain rule', () => {
  // Happy path 1: flat tree (root + 3 direct children) — no single-child chain
  it('does not trigger for a wide flat tree with multiple children', () => {
    const rule = createSingleChildChainRule(4)
    const root: ComponentNode = {
      id: 'root',
      type: 'App',
      children: [
        { id: 'a', type: 'A' },
        { id: 'b', type: 'B' },
        { id: 'c', type: 'C' },
      ],
    }
    expect(rule.check(root)).toBeNull()
  })

  // Happy path 2: chain of 5 single-child nodes — triggers with warning
  it('triggers when a single-child chain exceeds threshold', () => {
    const rule = createSingleChildChainRule(4)
    const root = makeChain(5)
    const result = rule.check(root)
    expect(result).not.toBeNull()
    expect(result?.rule).toBe('single-child-chain')
    expect(result?.severity).toBe('warning')
    expect(result?.nodeId).toBe('n0')
    expect(result?.message).toContain('5')
  })

  // Edge case 1: chain of exactly threshold (4) — not triggered (must exceed)
  it('does not trigger when chain length equals threshold', () => {
    const rule = createSingleChildChainRule(4)
    const root = makeChain(4)
    expect(rule.check(root)).toBeNull()
  })

  // Edge case 2: chain of 3 then a node with 2 children — resets; max chain=3, not triggered
  it('resets chain count when a node has multiple children', () => {
    const rule = createSingleChildChainRule(4)
    // chain of 3 single-child nodes, then root splits
    const leaf1: ComponentNode = { id: 'leaf1', type: 'Leaf' }
    const leaf2: ComponentNode = { id: 'leaf2', type: 'Leaf' }
    const n2: ComponentNode = { id: 'n2', type: 'W', children: [leaf1, leaf2] } // 2 children → reset
    const n1: ComponentNode = { id: 'n1', type: 'W', children: [n2] }
    const root: ComponentNode = { id: 'n0', type: 'W', children: [n1] }
    // chain: root→n1→n2 = 2 single-child hops, then n2 has 2 children → chain=2 < threshold=4
    expect(rule.check(root)).toBeNull()
  })

  // Edge case 3: leaf node only — not triggered
  it('does not trigger for a single root leaf node', () => {
    const rule = createSingleChildChainRule(4)
    const root: ComponentNode = { id: 'root', type: 'Leaf' }
    expect(rule.check(root)).toBeNull()
  })

  // Edge case 4: two separate chains — triggered for the longest; nodeId is root of that chain
  it('detects the longest chain when multiple chains exist', () => {
    const rule = createSingleChildChainRule(4)
    // root has two branches: left chain of 5, right chain of 3
    const leftChain = makeChain(5, 'l')
    const rightChain = makeChain(3, 'r')
    const root: ComponentNode = {
      id: 'root',
      type: 'App',
      children: [leftChain, rightChain],
    }
    const result = rule.check(root)
    expect(result).not.toBeNull()
    expect(result?.message).toContain('5')
    expect(result?.nodeId).toBe('l0') // root of the 5-chain
  })

  // Failure case: default threshold (4), chain of 5 — triggers
  it('uses default threshold of 4 and triggers on chain of 5', () => {
    const rule = createSingleChildChainRule()
    const root = makeChain(5)
    expect(rule.check(root)).not.toBeNull()
  })

  // Unknown/deterministic: same tree always produces same result
  it('is deterministic — same tree always yields same result', () => {
    const rule = createSingleChildChainRule(4)
    const root = makeChain(6)
    const r1 = rule.check(root)
    const r2 = rule.check(root)
    expect(r1?.rule).toBe(r2?.rule)
    expect(r1?.nodeId).toBe(r2?.nodeId)
    expect(r1?.message).toBe(r2?.message)
  })
})
