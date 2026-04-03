import { describe, it, expect } from 'vitest'
import { createInlineStyleCountRule } from '../../../src/rules/inline-style-count'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

function makeNodeWithStyles(id: string, styleCount: number): ComponentNode {
  const styles: Record<string, string> = {}
  for (let i = 0; i < styleCount; i++) {
    styles[`prop${i}`] = 'value'
  }
  return { id, type: 'div', styles }
}

describe('createInlineStyleCountRule', () => {
  // Happy path 1: styles within threshold — not triggered
  it('does not trigger when style count is below threshold', () => {
    const rule = createInlineStyleCountRule(10)
    const node = makeNodeWithStyles('n1', 5)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
    expect(result.issue).toBeUndefined()
  })

  // Happy path 2: styles exactly at threshold — not triggered
  it('does not trigger when style count equals threshold', () => {
    const rule = createInlineStyleCountRule(10)
    const node = makeNodeWithStyles('n2', 10)
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Happy path 3: styles exceed threshold — triggered
  it('triggers with warning when style count exceeds threshold', () => {
    const rule = createInlineStyleCountRule(10)
    const node = makeNodeWithStyles('n3', 11)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue).toBeDefined()
    expect(result.issue?.rule).toBe('inline-style-count')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('n3')
    expect(result.issue?.message).toContain('11')
    expect(result.issue?.message).toContain('10')
  })

  // Edge case 1: no styles property — not triggered
  it('does not trigger when node has no styles property', () => {
    const rule = createInlineStyleCountRule(10)
    const node: ComponentNode = { id: 'n4', type: 'div' }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Edge case 2: empty styles object — not triggered
  it('does not trigger when styles is empty', () => {
    const rule = createInlineStyleCountRule(10)
    const node: ComponentNode = { id: 'n5', type: 'div', styles: {} }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Edge case 3: very large style count
  it('triggers for very large style count and message contains count', () => {
    const rule = createInlineStyleCountRule(10)
    const node = makeNodeWithStyles('n6', 200)
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('200')
  })

  // Edge case 4: threshold 0 — any style triggers
  it('triggers with threshold 0 when node has 1 style', () => {
    const rule = createInlineStyleCountRule(0)
    const node = makeNodeWithStyles('n7', 1)
    expect(rule.detect(node, baseMetrics).triggered).toBe(true)
  })

  // Failure case: default threshold, 0 styles — not triggered
  it('uses a sensible default threshold, empty styles do not trigger', () => {
    const rule = createInlineStyleCountRule()
    const node: ComponentNode = { id: 'n8', type: 'div', styles: {} }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Unknown/deterministic: metrics do not affect result
  it('result is unaffected by metric values — rule only reads styles', () => {
    const rule = createInlineStyleCountRule(10)
    const node = makeNodeWithStyles('n9', 5)
    const altMetrics: PerformanceMetrics = { renderCount: 99, layoutShifts: 10, fpsDrop: 20, memoryUsage: 300 }
    expect(rule.detect(node, baseMetrics).triggered).toBe(rule.detect(node, altMetrics).triggered)
  })
})
