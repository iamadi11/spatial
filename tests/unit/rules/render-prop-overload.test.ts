/**
 * 041: render-prop-overload rule
 * Flags component nodes with more than 3 non-event-handler function props.
 * Keys starting with 'on' are excluded (handled by event-handler-count).
 */
import { describe, it, expect } from 'vitest'
import { createRenderPropOverloadRule } from '../../../src/rules/render-prop-overload'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const metrics: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

const rule = createRenderPropOverloadRule()

// ── Happy path ────────────────────────────────────────────────────────────────

describe('render-prop-overload — happy path', () => {
  it('fires when node has 4 non-event function props (exceeds threshold of 3)', () => {
    const node: ComponentNode = {
      id: 'table',
      type: 'DataTable',
      props: {
        renderHeader: () => null,
        renderRow: () => null,
        getLabel: () => '',
        formatCell: () => '',
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('render-prop-overload')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('table')
  })

  it('fires when node has 5 non-event function props', () => {
    const node: ComponentNode = {
      id: 'form',
      type: 'SmartForm',
      props: {
        renderHeader: () => null,
        renderFooter: () => null,
        getLabel: () => '',
        formatRow: () => null,
        transformData: () => ({}),
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('SmartForm')
  })
})

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('render-prop-overload — edge cases', () => {
  it('does NOT fire when exactly at threshold (3 non-event function props)', () => {
    const node: ComponentNode = {
      id: 'card',
      type: 'Card',
      props: {
        renderHeader: () => null,
        renderBody: () => null,
        getLabel: () => '',
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire for on* props — event handlers are excluded', () => {
    const node: ComponentNode = {
      id: 'btn',
      type: 'Button',
      props: {
        onClick: () => {},
        onChange: () => {},
        onFocus: () => {},
        onBlur: () => {},
        onSubmit: () => {},
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('only counts non-event functions — mixed props: 4 non-event + 3 event = fires', () => {
    const node: ComponentNode = {
      id: 'mixed',
      type: 'ComplexWidget',
      props: {
        renderHeader: () => null,
        renderBody: () => null,
        getLabel: () => '',
        formatValue: () => '',
        onClick: () => {},
        onChange: () => {},
        onFocus: () => {},
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(true)
  })

  it('does NOT fire when non-function props are present (strings, numbers, booleans)', () => {
    const node: ComponentNode = {
      id: 'card',
      type: 'InfoCard',
      props: {
        title: 'Hello',
        count: 42,
        visible: true,
        label: 'Test',
        renderHeader: () => null,
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire when node has no props', () => {
    const node: ComponentNode = { id: 'leaf', type: 'Icon' }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire when props is an empty object', () => {
    const node: ComponentNode = { id: 'leaf', type: 'Spacer', props: {} }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })
})

// ── Failure case ──────────────────────────────────────────────────────────────

describe('render-prop-overload — failure case', () => {
  it('does NOT fire when node has exactly 0 non-event function props', () => {
    const node: ComponentNode = {
      id: 'simple',
      type: 'SimpleCard',
      props: {
        title: 'Hello',
        onClick: () => {},
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire when only 1 non-event function prop is present', () => {
    const node: ComponentNode = {
      id: 'card',
      type: 'Card',
      props: {
        renderHeader: () => null,
        onClick: () => {},
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })
})

// ── Unknown case ──────────────────────────────────────────────────────────────

describe('render-prop-overload — unknown case', () => {
  it('does NOT fire when props values include null (null is not a function)', () => {
    const node: ComponentNode = {
      id: 'card',
      type: 'Card',
      props: {
        renderHeader: null,
        renderBody: null,
        getLabel: null,
        formatCell: null,
      },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })
})
