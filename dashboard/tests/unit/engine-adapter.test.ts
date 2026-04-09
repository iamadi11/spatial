/**
 * D02: Engine adapter layer tests
 * Tests for src/lib/engine.ts adapter functions.
 */
import { describe, it, expect } from 'vitest'
import { runAnalysis, getRuleCatalog } from '../../src/lib/engine'
import type { ComponentNode, PerformanceMetrics } from '../../src/lib/engine'

const baseMetrics: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

describe('D02: getRuleCatalog', () => {
  // Happy path 1: returns all registered rules
  it('returns exactly 20 rules', () => {
    const catalog = getRuleCatalog()
    expect(catalog).toHaveLength(20)
  })

  // Happy path 2: each rule has required metadata fields
  it('each rule has name, description, severity, and defaultThreshold', () => {
    const catalog = getRuleCatalog()
    for (const rule of catalog) {
      expect(typeof rule.name).toBe('string')
      expect(rule.name.length).toBeGreaterThan(0)
      expect(typeof rule.description).toBe('string')
      expect(rule.description.length).toBeGreaterThan(0)
      expect(['warning', 'error']).toContain(rule.severity)
      expect(typeof rule.defaultThreshold).toBe('number')
    }
  })

  // Edge case 1: rule names match known engine rule names
  it('contains all known rule names', () => {
    const catalog = getRuleCatalog()
    const names = catalog.map((r) => r.name)
    expect(names).toContain('child-count')
    expect(names).toContain('fps-drop')
    expect(names).toContain('inline-style-count')
    expect(names).toContain('layout-shift')
    expect(names).toContain('memory-usage')
    expect(names).toContain('nesting-depth')
    expect(names).toContain('prop-count')
    expect(names).toContain('render-count')
    expect(names).toContain('style-complexity')
    expect(names).toContain('total-node-count')
    // Rules added in 025–029
    expect(names).toContain('event-handler-count')
    expect(names).toContain('duplicate-component-type')
    expect(names).toContain('large-data-prop')
    expect(names).toContain('unvirtualized-list')
    expect(names).toContain('anonymous-component')
    expect(names).toContain('multi-type-sibling-fanout')
    expect(names).toContain('classname-token-sprawl')
  })

  // Edge case 2: result is deterministic
  it('is deterministic — same catalog returned each call', () => {
    const c1 = getRuleCatalog()
    const c2 = getRuleCatalog()
    expect(c1.map((r) => r.name)).toEqual(c2.map((r) => r.name))
  })
})

describe('D02: runAnalysis', () => {
  // Happy path 1: returns a result for a clean node
  it('returns pass for a clean node', () => {
    const node: ComponentNode = { id: 'root', type: 'div' }
    const result = runAnalysis(node, baseMetrics)
    expect(result.status).toBe('pass')
    expect(result.issues).toHaveLength(0)
  })

  // Happy path 2: detects high render count
  it('returns fail when renderCount exceeds threshold', () => {
    const node: ComponentNode = { id: 'root', type: 'div' }
    const metrics: PerformanceMetrics = { ...baseMetrics, renderCount: 100 }
    const result = runAnalysis(node, metrics)
    expect(result.status).toBe('fail')
    const issue = result.issues.find((i) => i.rule === 'render-count')
    expect(issue).toBeDefined()
  })

  // Edge case 1: works with custom ruleOptions to override threshold
  it('respects custom renderCount threshold', () => {
    const node: ComponentNode = { id: 'root', type: 'div' }
    const metrics: PerformanceMetrics = { ...baseMetrics, renderCount: 3 }
    // With default threshold of 5, 3 should pass
    const passResult = runAnalysis(node, metrics)
    expect(passResult.status).toBe('pass')
    // With lower threshold of 2, 3 should fail
    const failResult = runAnalysis(node, metrics, { renderCountThreshold: 2 })
    expect(failResult.status).toBe('fail')
  })

  // Edge case 2: invalid metrics returns unknown
  it('returns unknown status for invalid metrics (negative values)', () => {
    const node: ComponentNode = { id: 'root', type: 'div' }
    const badMetrics: PerformanceMetrics = { renderCount: -1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }
    const result = runAnalysis(node, badMetrics)
    expect(result.status).toBe('unknown')
  })

  // Failure case: expensive CSS properties trigger style-complexity
  it('flags expensive CSS properties', () => {
    const node: ComponentNode = { id: 'root', type: 'div', styles: { transform: 'scale(1.1)' } }
    const result = runAnalysis(node, baseMetrics)
    expect(result.status).toBe('fail')
    const issue = result.issues.find((i) => i.rule === 'style-complexity')
    expect(issue).toBeDefined()
    expect(issue?.severity).toBe('warning')
  })

  // D12: detects event-handler-count violation
  it('detects event handler count violation', () => {
    const node: ComponentNode = {
      id: 'root',
      type: 'Button',
      props: {
        onClick: () => {},
        onMouseEnter: () => {},
        onMouseLeave: () => {},
        onFocus: () => {},
        onBlur: () => {},
        onKeyDown: () => {},
      },
    }
    const result = runAnalysis(node, baseMetrics)
    expect(result.status).toBe('fail')
    const issue = result.issues.find((i) => i.rule === 'event-handler-count')
    expect(issue).toBeDefined()
  })

  // D12: detects anonymous component
  it('detects anonymous component type', () => {
    const node: ComponentNode = { id: 'root', type: '' }
    const result = runAnalysis(node, baseMetrics)
    expect(result.status).toBe('fail')
    const issue = result.issues.find((i) => i.rule === 'anonymous-component')
    expect(issue).toBeDefined()
  })

  // D12: detects large data prop
  it('detects large data prop', () => {
    const node: ComponentNode = {
      id: 'root',
      type: 'List',
      props: { data: 'x'.repeat(50_000) },
    }
    const result = runAnalysis(node, baseMetrics)
    expect(result.status).toBe('fail')
    const issue = result.issues.find((i) => i.rule === 'large-data-prop')
    expect(issue).toBeDefined()
  })

  // Unknown case: result always includes metrics
  it('result always includes the metrics that were passed in', () => {
    const node: ComponentNode = { id: 'root', type: 'div' }
    const result = runAnalysis(node, baseMetrics)
    expect(result.metrics).toEqual(baseMetrics)
  })
})
