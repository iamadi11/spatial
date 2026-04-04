import { describe, it, expect } from 'vitest'
import { createMemoCandidateRule } from '../../../src/rules/memo-candidate'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

function makeMetrics(renderCount: number): PerformanceMetrics {
  return { renderCount, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }
}

function makeNode(id: string, childCount: number): ComponentNode {
  return {
    id,
    type: 'Widget',
    children: Array.from({ length: childCount }, (_, i) => ({
      id: `${id}-child-${i}`,
      type: 'Child',
    })),
  }
}

describe('memo-candidate rule', () => {
  // Happy path 1: both below threshold — not triggered
  it('does not trigger when both renderCount and children are below threshold', () => {
    const rule = createMemoCandidateRule(3, 3)
    const node = makeNode('n1', 2)
    const result = rule.detect(node, makeMetrics(2))
    expect(result.triggered).toBe(false)
    expect(result.issue).toBeUndefined()
  })

  // Happy path 2: both conditions exceeded — triggered with warning
  it('triggers with warning when both renderCount and children exceed thresholds', () => {
    const rule = createMemoCandidateRule(3, 3)
    const node = makeNode('n2', 4)
    const result = rule.detect(node, makeMetrics(5))
    expect(result.triggered).toBe(true)
    expect(result.issue).toBeDefined()
    expect(result.issue?.rule).toBe('memo-candidate')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('n2')
    expect(result.issue?.message).toContain('5')
    expect(result.issue?.message).toContain('4')
  })

  // Edge case 1: renderCount exceeds but children at threshold — not triggered
  it('does not trigger when renderCount exceeds but children equal threshold', () => {
    const rule = createMemoCandidateRule(3, 3)
    const node = makeNode('n3', 3)
    const result = rule.detect(node, makeMetrics(5))
    expect(result.triggered).toBe(false)
  })

  // Edge case 2: children exceed but renderCount at threshold — not triggered
  it('does not trigger when children exceed but renderCount equals threshold', () => {
    const rule = createMemoCandidateRule(3, 3)
    const node = makeNode('n4', 5)
    const result = rule.detect(node, makeMetrics(3))
    expect(result.triggered).toBe(false)
  })

  // Edge case 3: leaf node (no children) with high renderCount — not triggered
  it('does not trigger for a leaf node even with very high renderCount', () => {
    const rule = createMemoCandidateRule(3, 3)
    const node: ComponentNode = { id: 'n5', type: 'Leaf' }
    const result = rule.detect(node, makeMetrics(100))
    expect(result.triggered).toBe(false)
  })

  // Edge case 4: empty children array — not triggered
  it('does not trigger when children array is empty', () => {
    const rule = createMemoCandidateRule(3, 3)
    const node: ComponentNode = { id: 'n6', type: 'Empty', children: [] }
    const result = rule.detect(node, makeMetrics(10))
    expect(result.triggered).toBe(false)
  })

  // Failure case: default thresholds, both met — triggers
  it('uses default thresholds (3/3) and triggers when both exceeded', () => {
    const rule = createMemoCandidateRule()
    const node = makeNode('n7', 4)
    const result = rule.detect(node, makeMetrics(4))
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('memo-candidate')
  })

  // Unknown/deterministic: same input always same output
  it('is deterministic — same input always produces same result', () => {
    const rule = createMemoCandidateRule(3, 3)
    const node = makeNode('n8', 4)
    const metrics = makeMetrics(5)
    const r1 = rule.detect(node, metrics)
    const r2 = rule.detect(node, metrics)
    expect(r1.triggered).toBe(r2.triggered)
    expect(r1.issue?.rule).toBe(r2.issue?.rule)
  })
})
