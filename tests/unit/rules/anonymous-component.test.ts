import { describe, it, expect } from 'vitest'
import { createAnonymousComponentRule } from '../../../src/rules/anonymous-component'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

function makeNode(id: string, type: string): ComponentNode {
  return { id, type }
}

describe('anonymous-component rule', () => {
  // Happy path 1: well-named component is not flagged
  it('does not trigger for a normally named component', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n1', 'UserProfile')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
    expect(result.issue).toBeUndefined()
  })

  // Happy path 2: another well-named component
  it('does not trigger for a PascalCase component name', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n2', 'ProductCard')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Happy path 3: HTML tag names are not flagged (lowercase = HTML element)
  it('does not trigger for lowercase HTML tag types', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n3', 'div')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Happy path 4: multi-word HTML elements not flagged
  it('does not trigger for "section" or other HTML elements', () => {
    const rule = createAnonymousComponentRule()
    expect(rule.detect(makeNode('n4a', 'section'), baseMetrics).triggered).toBe(false)
    expect(rule.detect(makeNode('n4b', 'button'), baseMetrics).triggered).toBe(false)
    expect(rule.detect(makeNode('n4c', 'input'), baseMetrics).triggered).toBe(false)
  })

  // Edge case 1: empty string type is flagged
  it('triggers for empty type string', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n5', '')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue).toBeDefined()
    expect(result.issue?.rule).toBe('anonymous-component')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('n5')
  })

  // Edge case 2: "Anonymous" literal is flagged
  it('triggers for type "Anonymous"', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n6', 'Anonymous')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toContain('Anonymous')
  })

  // Edge case 3: "Component" literal is flagged
  it('triggers for type "Component"', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n7', 'Component')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
  })

  // Edge case 4: single-character uppercase type is flagged (minified)
  it('triggers for single-character uppercase type (minified name)', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n8', 'A')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
  })

  // Edge case 5: two-character type like "_c" or "C0" is flagged (minified)
  it('triggers for two-character component types', () => {
    const rule = createAnonymousComponentRule()
    expect(rule.detect(makeNode('n9a', '_c'), baseMetrics).triggered).toBe(true)
    expect(rule.detect(makeNode('n9b', 'C0'), baseMetrics).triggered).toBe(true)
  })

  // Edge case 6: three-character type should NOT be flagged by default (borderline but valid)
  it('does not trigger for type names 3+ characters that start uppercase', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n10', 'Btn')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(false)
  })

  // Failure case: issue message includes the actual type and the node id
  it('issue message includes the type name and nodeId', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('comp-42', 'Anonymous')
    const result = rule.detect(node, baseMetrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.nodeId).toBe('comp-42')
    expect(result.issue?.message).toMatch(/Anonymous/)
  })

  // Unknown/determinism: metrics have no effect on outcome
  it('result is unaffected by metric values (structural rule only)', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n11', 'Anonymous')
    const altMetrics: PerformanceMetrics = { renderCount: 999, layoutShifts: 5, fpsDrop: 20, memoryUsage: 200 }
    const r1 = rule.detect(node, baseMetrics)
    const r2 = rule.detect(node, altMetrics)
    expect(r1.triggered).toBe(r2.triggered)
  })

  // Determinism: same input always produces same output
  it('is deterministic — repeated calls produce identical results', () => {
    const rule = createAnonymousComponentRule()
    const node = makeNode('n12', 'Anonymous')
    const r1 = rule.detect(node, baseMetrics)
    const r2 = rule.detect(node, baseMetrics)
    expect(r1.triggered).toBe(r2.triggered)
    expect(r1.issue?.message).toBe(r2.issue?.message)
  })
})
