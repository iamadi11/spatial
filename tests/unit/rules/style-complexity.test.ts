import { describe, it, expect } from 'vitest'
import { createStyleComplexityRule } from '../../../src/rules/style-complexity'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

describe('style-complexity rule', () => {
  // Happy path 1: no expensive properties — not triggered
  it('does not trigger when styles contain only safe properties', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = {
      id: 'n1',
      type: 'div',
      styles: { color: 'red', fontSize: '16px', margin: '8px' },
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
    expect(result.issue).toBeUndefined()
  })

  // Happy path 2: one expensive property — triggered
  it('triggers when styles contain one expensive property (box-shadow)', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = {
      id: 'n2',
      type: 'div',
      styles: { boxShadow: '0 2px 4px rgba(0,0,0,0.5)' },
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue).toBeDefined()
    expect(result.issue?.rule).toBe('style-complexity')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('n2')
    expect(result.issue?.message).toContain('boxShadow')
  })

  // Happy path 3: multiple expensive properties — triggered, all listed
  it('triggers and lists all expensive properties found', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = {
      id: 'n3',
      type: 'div',
      styles: { filter: 'blur(4px)', backdropFilter: 'blur(2px)', color: 'blue' },
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('filter')
    expect(result.issue?.message).toContain('backdropFilter')
  })

  // Edge case 1: no styles property at all — not triggered
  it('does not trigger when node has no styles property', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = { id: 'n4', type: 'div' }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 2: empty styles object — not triggered
  it('does not trigger when styles is an empty object', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = { id: 'n5', type: 'div', styles: {} }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 3: transform property — triggered
  it('triggers for transform property', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = {
      id: 'n6',
      type: 'div',
      styles: { transform: 'translateX(100px)' },
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('transform')
  })

  // Edge case 4: clipPath property — triggered
  it('triggers for clipPath property', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = {
      id: 'n7',
      type: 'div',
      styles: { clipPath: 'polygon(0 0, 100% 0, 100% 100%)' },
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
  })

  // Failure case: styles with no matching keys — deterministically not triggered
  it('does not trigger when all style keys are unknown/safe', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = {
      id: 'n8',
      type: 'div',
      styles: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  // Unknown/deterministic: metrics have no effect
  it('result is unaffected by metric values (rule only reads styles)', () => {
    const rule = createStyleComplexityRule()
    const node: ComponentNode = {
      id: 'n9',
      type: 'div',
      styles: { boxShadow: '0 0 10px red' },
    }
    const altMetrics: PerformanceMetrics = { renderCount: 100, layoutShifts: 50, fpsDrop: 30, memoryUsage: 500 }
    expect(rule.detect(node, baseMetrics).triggered).toBe(rule.detect(node, altMetrics).triggered)
  })
})
