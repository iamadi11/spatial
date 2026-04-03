import { describe, it, expect } from 'vitest'
import { createUnvirtualizedListRule } from '../../../src/rules/unvirtualized-list'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

function makeChildren(type: string, count: number, idPrefix = 'child'): ComponentNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${i}`,
    type,
  }))
}

function makeNode(id: string, children: ComponentNode[]): ComponentNode {
  return { id, type: 'List', children }
}

describe('unvirtualized-list rule', () => {
  // Happy path 1: mixed children types below threshold — no trigger
  it('does not trigger when no single type group meets threshold', () => {
    const rule = createUnvirtualizedListRule(50)
    const children = [
      ...makeChildren('ListItemA', 20, 'a'),
      ...makeChildren('ListItemB', 20, 'b'),
    ]
    const node = makeNode('n1', children)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
    expect(result.issue).toBeUndefined()
  })

  // Happy path 2: exactly at threshold — no trigger (threshold is exclusive)
  it('does not trigger when same-type count equals threshold', () => {
    const rule = createUnvirtualizedListRule(50)
    const node = makeNode('n2', makeChildren('Row', 50))
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Happy path 3: count exceeds threshold — triggers warning
  it('triggers warning when same-type sibling count exceeds threshold', () => {
    const rule = createUnvirtualizedListRule(50)
    const node = makeNode('n3', makeChildren('Row', 51))
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue).toBeDefined()
    expect(result.issue?.rule).toBe('unvirtualized-list')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('n3')
    expect(result.issue?.message).toContain('51')
    expect(result.issue?.message).toContain('Row')
  })

  // Happy path 4: large list with mixed types — only the dominant group counts
  it('uses the largest same-type group when children are mixed', () => {
    const rule = createUnvirtualizedListRule(50)
    const children = [
      ...makeChildren('Row', 60, 'r'),
      ...makeChildren('Divider', 5, 'd'),
    ]
    const node = makeNode('n4', children)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('60')
    expect(result.issue?.message).toContain('Row')
  })

  // Edge case 1: no children property
  it('does not trigger when node has no children property', () => {
    const rule = createUnvirtualizedListRule(50)
    const node: ComponentNode = { id: 'n5', type: 'Empty' }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 2: empty children array
  it('does not trigger when children is an empty array', () => {
    const rule = createUnvirtualizedListRule(50)
    const node = makeNode('n6', [])
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 3: very large list (500 same-type items)
  it('correctly flags very large same-type groups', () => {
    const rule = createUnvirtualizedListRule(50)
    const node = makeNode('n7', makeChildren('Item', 500))
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('500')
  })

  // Edge case 4: all children have different types — largest group is 1
  it('does not trigger when all children are unique types', () => {
    const rule = createUnvirtualizedListRule(50)
    const children = Array.from({ length: 100 }, (_, i) => ({
      id: `uniq-${i}`,
      type: `Component${i}`,
    }))
    const node = makeNode('n8', children)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Failure case: default threshold used — 100 same-type items trigger with default
  it('uses default threshold of 50 when not provided, flagging 51 items', () => {
    const rule = createUnvirtualizedListRule()
    const node = makeNode('n9', makeChildren('Row', 51))
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
  })

  // Failure case: default threshold — 49 items do not trigger
  it('uses default threshold of 50 when not provided, not flagging 49 items', () => {
    const rule = createUnvirtualizedListRule()
    const node = makeNode('n10', makeChildren('Row', 49))
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Unknown/deterministic: metrics values have no effect on outcome
  it('result is unaffected by metric values (rule only inspects children)', () => {
    const rule = createUnvirtualizedListRule(50)
    const node = makeNode('n11', makeChildren('Row', 30))
    const altMetrics: PerformanceMetrics = { renderCount: 999, layoutShifts: 10, fpsDrop: 5, memoryUsage: 100 }
    const r1 = rule.detect(node, baseMetrics)
    const r2 = rule.detect(node, altMetrics)
    expect(r1.triggered).toBe(r2.triggered)
    expect(r1.triggered).toBe(false)
  })

  // Determinism: same input always produces same output
  it('is deterministic — produces identical results on repeated calls', () => {
    const rule = createUnvirtualizedListRule(50)
    const node = makeNode('n12', makeChildren('Row', 75))
    const r1 = rule.detect(node, baseMetrics)
    const r2 = rule.detect(node, baseMetrics)
    expect(r1.triggered).toBe(r2.triggered)
    expect(r1.issue?.message).toBe(r2.issue?.message)
  })
})
