import { describe, it, expect } from 'vitest'
import { createRegistry } from '../../src/rule-registry'
import type { Rule } from '../../src/rule-registry'
import type { ComponentNode, PerformanceMetrics } from '../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 10,
}

const node: ComponentNode = { id: 'btn', type: 'Button' }

describe('Rule Registry', () => {
  describe('Happy Path', () => {
    it('H1: registered rule that triggers returns its issue', () => {
      const registry = createRegistry()
      const rule: Rule = {
        name: 'high-render-count',
        detect: (n, metrics) => {
          if (metrics.renderCount > 5) {
            return {
              triggered: true,
              issue: { rule: 'high-render-count', severity: 'warning', message: 'Too many renders', nodeId: n.id },
            }
          }
          return { triggered: false }
        },
      }
      registry.register(rule)
      const issues = registry.runAll(node, { ...baseMetrics, renderCount: 10 })
      expect(issues).toHaveLength(1)
      expect(issues[0].rule).toBe('high-render-count')
      expect(issues[0].nodeId).toBe('btn')
    })

    it('H2: registered rule that does not trigger returns empty issues', () => {
      const registry = createRegistry()
      const rule: Rule = {
        name: 'high-render-count',
        detect: (_n, metrics) =>
          metrics.renderCount > 5
            ? { triggered: true, issue: { rule: 'high-render-count', severity: 'warning', message: 'Too many', nodeId: _n.id } }
            : { triggered: false },
      }
      registry.register(rule)
      const issues = registry.runAll(node, baseMetrics) // renderCount = 1, not > 5
      expect(issues).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('E1: empty registry returns empty issues array', () => {
      const registry = createRegistry()
      const issues = registry.runAll(node, baseMetrics)
      expect(issues).toHaveLength(0)
    })

    it('E2: multiple rules — only triggered ones produce issues', () => {
      const registry = createRegistry()
      const alwaysFires: Rule = {
        name: 'always',
        detect: (n) => ({ triggered: true, issue: { rule: 'always', severity: 'error', message: 'Always fires', nodeId: n.id } }),
      }
      const neverFires: Rule = {
        name: 'never',
        detect: () => ({ triggered: false }),
      }
      registry.register(alwaysFires)
      registry.register(neverFires)
      const issues = registry.runAll(node, baseMetrics)
      expect(issues).toHaveLength(1)
      expect(issues[0].rule).toBe('always')
    })
  })

  describe('Failure Cases', () => {
    it('F1: rule with no issue field when triggered is ignored gracefully', () => {
      const registry = createRegistry()
      const badRule: Rule = {
        name: 'no-issue',
        detect: () => ({ triggered: true }), // triggered but no issue
      }
      registry.register(badRule)
      const issues = registry.runAll(node, baseMetrics)
      expect(issues).toHaveLength(0) // no issue to report
    })
  })

  describe('Unknown Cases', () => {
    it('U1: rule that cannot determine result returns triggered: false (UNKNOWN handled as no-op)', () => {
      const registry = createRegistry()
      const uncertainRule: Rule = {
        name: 'uncertain',
        detect: (_n, metrics) => {
          if (metrics.renderCount < 0) {
            // Invalid metrics — cannot determine
            return { triggered: false }
          }
          return { triggered: false }
        },
      }
      registry.register(uncertainRule)
      const issues = registry.runAll(node, { ...baseMetrics, renderCount: -1 })
      expect(issues).toHaveLength(0)
    })
  })
})
