import { describe, it, expect } from 'vitest'
import { createMultiTypeSiblingFanoutRule } from '../../../src/rules/multi-type-sibling-fanout'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

function makeDistinctChildren(count: number, idPrefix = 'c'): ComponentNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${i}`,
    type: `Type${i}`,
  }))
}

describe('multi-type-sibling-fanout rule', () => {
  // Happy path 1: few children — no trigger
  it('does not trigger when direct children count is below minimum', () => {
    const rule = createMultiTypeSiblingFanoutRule()
    const node: ComponentNode = {
      id: 'root',
      type: 'Shell',
      children: makeDistinctChildren(5),
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Happy path 2: many children but low type diversity — no trigger
  it('does not trigger when many children share few types', () => {
    const rule = createMultiTypeSiblingFanoutRule({ minDirectChildren: 10, minDistinctTypes: 6 })
    const children: ComponentNode[] = [
      ...Array.from({ length: 8 }, (_, i) => ({ id: `a-${i}`, type: 'Row' })),
      ...Array.from({ length: 4 }, (_, i) => ({ id: `b-${i}`, type: 'Cell' })),
    ]
    const node: ComponentNode = { id: 'root', type: 'Grid', children }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Happy path 3: thresholds met — triggers
  it('triggers when direct children and distinct types both meet thresholds', () => {
    const rule = createMultiTypeSiblingFanoutRule({ minDirectChildren: 10, minDistinctTypes: 6 })
    const node: ComponentNode = {
      id: 'kitchen',
      type: 'KitchenSink',
      children: makeDistinctChildren(10),
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('multi-type-sibling-fanout')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('kitchen')
    expect(result.issue?.message).toMatch(/10 direct children/)
    expect(result.issue?.message).toMatch(/10 distinct types/)
  })

  // Edge case 1: no children
  it('does not trigger when node has no children', () => {
    const rule = createMultiTypeSiblingFanoutRule()
    const node: ComponentNode = { id: 'leaf', type: 'Leaf' }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Edge case 2: empty children array
  it('does not trigger when children array is empty', () => {
    const rule = createMultiTypeSiblingFanoutRule()
    const node: ComponentNode = { id: 'x', type: 'X', children: [] }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Edge case 3: ten children but only five distinct types — no trigger
  it('does not trigger when distinct type count is below minimum', () => {
    const rule = createMultiTypeSiblingFanoutRule({ minDirectChildren: 10, minDistinctTypes: 6 })
    const children: ComponentNode[] = [
      ...Array.from({ length: 3 }, (_, i) => ({ id: `a-${i}`, type: 'Alpha' })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: `b-${i}`, type: 'Beta' })),
      ...Array.from({ length: 2 }, (_, i) => ({ id: `c-${i}`, type: 'Gamma' })),
      ...Array.from({ length: 2 }, (_, i) => ({ id: `d-${i}`, type: 'Delta' })),
    ]
    const node: ComponentNode = { id: 'root', type: 'Mix', children }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Failure case: custom low thresholds make violation easy to hit
  it('triggers with relaxed thresholds', () => {
    const rule = createMultiTypeSiblingFanoutRule({ minDirectChildren: 4, minDistinctTypes: 4 })
    const node: ComponentNode = {
      id: 'r',
      type: 'Panel',
      children: makeDistinctChildren(4),
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('≥4')
  })

  // Unknown / metrics: rule ignores metrics — still deterministic
  it('ignores metrics values (structural rule only)', () => {
    const rule = createMultiTypeSiblingFanoutRule({ minDirectChildren: 3, minDistinctTypes: 3 })
    const node: ComponentNode = { id: 'n', type: 'N', children: makeDistinctChildren(3) }
    const mBad: PerformanceMetrics = { renderCount: -999, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }
    const r1 = rule.detect(node, baseMetrics)
    const r2 = rule.detect(node, mBad)
    expect(r1.triggered).toBe(r2.triggered)
    expect(r1.issue?.nodeId).toBe(r2.issue?.nodeId)
  })
})
