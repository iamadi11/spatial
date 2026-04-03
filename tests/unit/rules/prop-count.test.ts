import { describe, it, expect } from 'vitest'
import { createPropCountRule } from '../../../src/rules/prop-count'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

function makeNode(id: string, propCount: number): ComponentNode {
  const props: Record<string, unknown> = {}
  for (let i = 0; i < propCount; i++) {
    props[`prop${i}`] = i
  }
  return { id, type: 'div', props }
}

describe('prop-count rule', () => {
  // Happy path 1: props within threshold — not triggered
  it('does not trigger when prop count is below threshold', () => {
    const rule = createPropCountRule(10)
    const node = makeNode('n1', 5)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
    expect(result.issue).toBeUndefined()
  })

  // Happy path 2: props exactly at threshold — not triggered
  it('does not trigger when prop count equals threshold', () => {
    const rule = createPropCountRule(10)
    const node = makeNode('n2', 10)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Happy path 3: props exceed threshold — triggered
  it('triggers with warning when prop count exceeds threshold', () => {
    const rule = createPropCountRule(10)
    const node = makeNode('n3', 11)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue).toBeDefined()
    expect(result.issue?.rule).toBe('prop-count')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('n3')
    expect(result.issue?.message).toContain('11')
  })

  // Edge case 1: no props property at all
  it('does not trigger when node has no props property', () => {
    const rule = createPropCountRule(10)
    const node: ComponentNode = { id: 'n4', type: 'div' }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 2: empty props object
  it('does not trigger when props is an empty object', () => {
    const rule = createPropCountRule(10)
    const node: ComponentNode = { id: 'n5', type: 'div', props: {} }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 3: very high prop count
  it('triggers correctly with very large prop count', () => {
    const rule = createPropCountRule(10)
    const node = makeNode('n6', 500)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('500')
  })

  // Edge case 4: threshold 0 — any prop triggers
  it('triggers with threshold 0 when node has 1 prop', () => {
    const rule = createPropCountRule(0)
    const node = makeNode('n7', 1)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
  })

  // Failure case: default threshold applied, 0 props
  it('uses a sensible default threshold, does not trigger for 0 props', () => {
    const rule = createPropCountRule()
    const node: ComponentNode = { id: 'n8', type: 'div', props: {} }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Unknown/deterministic: varying metrics never affect result
  it('result is unaffected by metric values (rule only reads props)', () => {
    const rule = createPropCountRule(10)
    const node = makeNode('n9', 5)
    const altMetrics: PerformanceMetrics = { renderCount: 100, layoutShifts: 50, fpsDrop: 30, memoryUsage: 500 }
    expect(rule.detect(node, baseMetrics).triggered).toBe(rule.detect(node, altMetrics).triggered)
  })
})
