import { describe, it, expect } from 'vitest'
import { createChildCountRule } from '../../../src/rules/child-count'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

function makeNode(id: string, childCount: number): ComponentNode {
  return {
    id,
    type: 'div',
    children: Array.from({ length: childCount }, (_, i) => ({
      id: `${id}-child-${i}`,
      type: 'span',
    })),
  }
}

describe('child-count rule', () => {
  // Happy path 1: node within threshold is not flagged
  it('does not trigger when children count is below threshold', () => {
    const rule = createChildCountRule(10)
    const node = makeNode('n1', 5)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
    expect(result.issue).toBeUndefined()
  })

  // Happy path 2: node exactly at threshold is not flagged
  it('does not trigger when children count equals threshold', () => {
    const rule = createChildCountRule(10)
    const node = makeNode('n2', 10)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Happy path 3: node exceeding threshold is flagged
  it('triggers with warning when children count exceeds threshold', () => {
    const rule = createChildCountRule(10)
    const node = makeNode('n3', 11)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue).toBeDefined()
    expect(result.issue?.rule).toBe('child-count')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('n3')
    expect(result.issue?.message).toContain('11')
  })

  // Edge case 1: node with no children field
  it('does not trigger when node has no children property', () => {
    const rule = createChildCountRule(10)
    const node: ComponentNode = { id: 'n4', type: 'div' }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 2: node with empty children array
  it('does not trigger when children array is empty', () => {
    const rule = createChildCountRule(10)
    const node: ComponentNode = { id: 'n5', type: 'div', children: [] }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 3: very large child count
  it('triggers correctly for very large child counts', () => {
    const rule = createChildCountRule(10)
    const node = makeNode('n6', 1000)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('1000')
  })

  // Edge case 4: custom threshold of 0 — any child triggers
  it('triggers immediately with threshold of 0 when node has 1 child', () => {
    const rule = createChildCountRule(0)
    const node = makeNode('n7', 1)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
  })

  // Failure case: default threshold used when none provided
  it('uses a sensible default threshold when not configured', () => {
    const rule = createChildCountRule()
    // default threshold should be > 0, so a node with 0 children should not trigger
    const nodeNone = makeNode('n8', 0)
    expect(rule.detect(nodeNone, baseMetrics).triggered).toBe(false)
  })

  // Unknown/deterministic: metrics values do not affect rule outcome
  it('result is unaffected by non-zero metric values (rule only reads children)', () => {
    const rule = createChildCountRule(10)
    const node = makeNode('n9', 5)
    const altMetrics: PerformanceMetrics = { renderCount: 100, layoutShifts: 50, fpsDrop: 30, memoryUsage: 500 }
    const r1 = rule.detect(node, baseMetrics)
    const r2 = rule.detect(node, altMetrics)
    expect(r1.triggered).toBe(r2.triggered)
  })
})
