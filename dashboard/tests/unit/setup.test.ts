/**
 * D01: Project setup smoke tests
 * Verifies the engine can be imported and basic types are correct.
 */
import { describe, it, expect } from 'vitest'
import type { ComponentNode, PerformanceResult } from '@engine/types'
import { analyze } from '@engine/engine'
import { createRegistry } from '@engine/rule-registry'

const registry = createRegistry()
const baseMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

describe('D01: Engine import wiring', () => {
  // Happy path 1: engine function is callable
  it('analyze is a function', () => {
    expect(typeof analyze).toBe('function')
  })

  // Happy path 2: engine produces a valid result for a minimal node
  it('analyze returns a PerformanceResult for a minimal node', () => {
    const node: ComponentNode = { id: 'root', type: 'div' }
    const result = analyze(node, baseMetrics, registry)
    expect(result).toHaveProperty('status')
    expect(['pass', 'fail', 'unknown']).toContain(result.status)
  })

  // Edge case 1: node with no children still returns a result
  it('handles a node with empty children array', () => {
    const node: ComponentNode = { id: 'root', type: 'div', children: [] }
    const result = analyze(node, baseMetrics, registry)
    expect(result).toHaveProperty('issues')
    expect(Array.isArray(result.issues)).toBe(true)
  })

  // Edge case 2: node with nested children
  it('handles nested children without crashing', () => {
    const node: ComponentNode = {
      id: 'parent',
      type: 'div',
      children: [
        { id: 'child1', type: 'span' },
        { id: 'child2', type: 'p' },
      ],
    }
    const result: PerformanceResult = analyze(node, baseMetrics, registry)
    expect(result).toHaveProperty('status')
  })

  // Failure case: same input always produces same output (determinism)
  it('is deterministic — same input gives same output', () => {
    const node: ComponentNode = { id: 'test', type: 'div', styles: { position: 'fixed' } }
    const r1 = analyze(node, baseMetrics, registry)
    const r2 = analyze(node, baseMetrics, registry)
    expect(r1.status).toBe(r2.status)
    expect(r1.issues.length).toBe(r2.issues.length)
  })

  // Unknown case: result has metrics property
  it('result always includes a metrics object', () => {
    const node: ComponentNode = { id: 'x', type: 'unknown-type' }
    const result = analyze(node, baseMetrics, registry)
    expect(result).toHaveProperty('metrics')
    expect(typeof result.metrics).toBe('object')
  })
})
