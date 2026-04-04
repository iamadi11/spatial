import { describe, it, expect } from 'vitest'
import { createBooleanPropOverloadRule } from '../../../src/rules/boolean-prop-overload'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

function makeNode(id: string, booleanProps: Record<string, boolean>, otherProps?: Record<string, unknown>): ComponentNode {
  return { id, type: 'Button', props: { ...booleanProps, ...otherProps } }
}

describe('boolean-prop-overload rule', () => {
  // Happy path 1: fewer boolean props than threshold — not triggered
  it('does not trigger when boolean prop count is below threshold', () => {
    const rule = createBooleanPropOverloadRule(5)
    const node = makeNode('n1', { isActive: true, isDisabled: false, isLoading: true })
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
    expect(result.issue).toBeUndefined()
  })

  // Happy path 2: boolean props exactly at threshold — not triggered
  it('does not trigger when boolean prop count equals threshold', () => {
    const rule = createBooleanPropOverloadRule(5)
    const node = makeNode('n2', {
      isActive: true,
      isDisabled: false,
      isLoading: true,
      isReadOnly: false,
      isExpanded: true,
    })
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Happy path 3: boolean props exceed threshold — triggered with warning
  it('triggers with warning when boolean prop count exceeds threshold', () => {
    const rule = createBooleanPropOverloadRule(5)
    const node = makeNode('n3', {
      isActive: true,
      isDisabled: false,
      isLoading: true,
      isReadOnly: false,
      isExpanded: true,
      isSelected: false,
    })
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue).toBeDefined()
    expect(result.issue?.rule).toBe('boolean-prop-overload')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('n3')
    expect(result.issue?.message).toContain('6')
  })

  // Edge case 1: no props — not triggered
  it('does not trigger when node has no props', () => {
    const rule = createBooleanPropOverloadRule(5)
    const node: ComponentNode = { id: 'n4', type: 'div' }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 2: non-boolean props are not counted
  it('counts only boolean props, not strings or numbers', () => {
    const rule = createBooleanPropOverloadRule(5)
    // 3 booleans + many non-boolean props
    const node: ComponentNode = {
      id: 'n5',
      type: 'Form',
      props: {
        isActive: true,
        isDisabled: false,
        isLoading: true,
        label: 'Submit',
        count: 42,
        onClick: () => {},
        items: [1, 2, 3],
        style: { color: 'red' },
        className: 'btn',
        value: 'hello',
      },
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Edge case 3: mixed props, exactly 6 booleans — triggers at threshold 5
  it('triggers when boolean count exceeds threshold among mixed prop types', () => {
    const rule = createBooleanPropOverloadRule(5)
    const node: ComponentNode = {
      id: 'n6',
      type: 'Card',
      props: {
        isActive: true,
        isDisabled: false,
        isLoading: true,
        isReadOnly: false,
        isExpanded: true,
        isSelected: false,
        title: 'hello',
        count: 3,
      },
    }
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('6')
  })

  // Failure case: default threshold of 5, node with 6 booleans triggers
  it('uses default threshold of 5, triggers when 6 boolean props present', () => {
    const rule = createBooleanPropOverloadRule()
    const node = makeNode('n7', {
      a: true,
      b: false,
      c: true,
      d: false,
      e: true,
      f: false,
    })
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
  })

  // Unknown/deterministic: metric values never affect result
  it('result is unaffected by metric values (rule only reads boolean props)', () => {
    const rule = createBooleanPropOverloadRule(5)
    const node = makeNode('n8', { isActive: true, isDisabled: false })
    const altMetrics: PerformanceMetrics = { renderCount: 100, layoutShifts: 50, fpsDrop: 30, memoryUsage: 500 }
    expect(rule.detect(node, baseMetrics).triggered).toBe(rule.detect(node, altMetrics).triggered)
  })
})
