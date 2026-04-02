import { describe, it, expect } from 'vitest'
import { analyze } from '../../src/engine'
import { createRegistry } from '../../src/rule-registry'
import type { Rule } from '../../src/rule-registry'
import type { ComponentNode, PerformanceMetrics } from '../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 10,
}

const simpleTree: ComponentNode = {
  id: 'root',
  type: 'View',
  children: [{ id: 'btn', type: 'Button' }],
}

const highRenderRule: Rule = {
  name: 'high-render-count',
  detect: (node, metrics) =>
    metrics.renderCount > 5
      ? { triggered: true, issue: { rule: 'high-render-count', severity: 'warning', message: 'Too many renders', nodeId: node.id } }
      : { triggered: false },
}

describe('Engine Core', () => {
  describe('Happy Path', () => {
    it('H1: no rules triggered → status pass, empty issues', () => {
      const registry = createRegistry()
      registry.register(highRenderRule)
      const result = analyze(simpleTree, baseMetrics, registry)
      expect(result.status).toBe('pass')
      expect(result.issues).toHaveLength(0)
      expect(result.metrics).toEqual(baseMetrics)
    })

    it('H2: rule triggered on a node → status fail, issue reported', () => {
      const registry = createRegistry()
      registry.register(highRenderRule)
      const result = analyze(simpleTree, { ...baseMetrics, renderCount: 10 }, registry)
      expect(result.status).toBe('fail')
      expect(result.issues.length).toBeGreaterThan(0)
      expect(result.issues[0].rule).toBe('high-render-count')
    })
  })

  describe('Edge Cases', () => {
    it('E1: empty registry always returns pass', () => {
      const registry = createRegistry()
      const result = analyze(simpleTree, baseMetrics, registry)
      expect(result.status).toBe('pass')
      expect(result.issues).toHaveLength(0)
    })

    it('E2: rule fires on multiple nodes in the tree', () => {
      const registry = createRegistry()
      const alwaysFires: Rule = {
        name: 'always',
        detect: (n) => ({
          triggered: true,
          issue: { rule: 'always', severity: 'error', message: 'fires on all', nodeId: n.id },
        }),
      }
      registry.register(alwaysFires)
      const result = analyze(simpleTree, baseMetrics, registry)
      // simpleTree has 2 nodes (root + btn), rule fires on each
      expect(result.issues).toHaveLength(2)
      expect(result.status).toBe('fail')
    })
  })

  describe('Failure Cases', () => {
    it('F1: single-node tree with no children still analyzed correctly', () => {
      const registry = createRegistry()
      registry.register(highRenderRule)
      const singleNode: ComponentNode = { id: 'lone', type: 'Text' }
      const result = analyze(singleNode, { ...baseMetrics, renderCount: 10 }, registry)
      expect(result.status).toBe('fail')
      expect(result.issues[0].nodeId).toBe('lone')
    })
  })

  describe('Unknown Cases', () => {
    it('U1: negative renderCount is invalid → status unknown', () => {
      const registry = createRegistry()
      const result = analyze(simpleTree, { ...baseMetrics, renderCount: -1 }, registry)
      expect(result.status).toBe('unknown')
      expect(result.reason).toBeDefined()
    })
  })
})
