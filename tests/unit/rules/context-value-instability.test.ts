/**
 * 038: context-value-instability rule
 * Flags Context.Provider nodes whose `value` prop is a non-primitive (object, array, function).
 */
import { describe, it, expect } from 'vitest'
import { createContextValueInstabilityRule } from '../../../src/rules/context-value-instability'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const metrics: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

const rule = createContextValueInstabilityRule()

// ── Happy path ────────────────────────────────────────────────────────────────

describe('context-value-instability — happy path', () => {
  it('fires for a Provider node with an object value', () => {
    const node: ComponentNode = {
      id: 'user-provider',
      type: 'UserContext.Provider',
      props: { value: { user: 'alice', logout: () => {} } },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('context-value-instability')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('user-provider')
  })

  it('fires for a Provider node with an array value', () => {
    const node: ComponentNode = {
      id: 'list-provider',
      type: 'ListContext.Provider',
      props: { value: ['item1', 'item2'] },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('context-value-instability')
  })

  it('fires for a Provider node with a function value', () => {
    const node: ComponentNode = {
      id: 'fn-provider',
      type: 'Context.Provider',
      props: { value: () => 42 },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(true)
  })
})

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('context-value-instability — edge cases', () => {
  it('does NOT fire for a Provider with a string value', () => {
    const node: ComponentNode = {
      id: 'theme-provider',
      type: 'ThemeContext.Provider',
      props: { value: 'dark' },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire for a Provider with a number value', () => {
    const node: ComponentNode = {
      id: 'count-provider',
      type: 'CountContext.Provider',
      props: { value: 42 },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire for a Provider with a boolean value', () => {
    const node: ComponentNode = {
      id: 'flag-provider',
      type: 'FlagContext.Provider',
      props: { value: true },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire for a Provider with null value', () => {
    const node: ComponentNode = {
      id: 'null-provider',
      type: 'NullContext.Provider',
      props: { value: null },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire for a Provider with no value prop', () => {
    const node: ComponentNode = {
      id: 'no-val-provider',
      type: 'SomeContext.Provider',
      props: { otherProp: 'ignored' },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })
})

// ── Failure case ──────────────────────────────────────────────────────────────

describe('context-value-instability — failure case', () => {
  it('does NOT fire for a non-Provider node with an object prop', () => {
    const node: ComponentNode = {
      id: 'regular-div',
      type: 'div',
      props: { value: { foo: 'bar' } },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire for a non-Provider component with an object value prop', () => {
    const node: ComponentNode = {
      id: 'card',
      type: 'Card',
      props: { value: { title: 'hello' } },
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })
})
