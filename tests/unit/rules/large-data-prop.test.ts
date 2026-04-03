import { describe, it, expect } from 'vitest'
import { createLargeDataPropRule } from '../../../src/rules/large-data-prop'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 }

/** Build a string of approximately `bytes` bytes */
function bigString(bytes: number): string {
  return 'x'.repeat(bytes)
}

describe('Large Data Prop Rule', () => {
  describe('Happy Path', () => {
    // H1: prop payload over threshold triggers
    it('H1: props serialising to >10000 bytes exceed default threshold → triggers', () => {
      const rule = createLargeDataPropRule()
      const node: ComponentNode = {
        id: 'list',
        type: 'DataTable',
        props: { data: bigString(11_000) },
      }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(true)
      expect(result.issue).toBeDefined()
      expect(result.issue?.rule).toBe('large-data-prop')
      expect(result.issue?.severity).toBe('warning')
      expect(result.issue?.nodeId).toBe('list')
    })

    // H2: small props below threshold → does not trigger
    it('H2: props serialising to <10000 bytes → does not trigger', () => {
      const rule = createLargeDataPropRule()
      const node: ComponentNode = {
        id: 'btn',
        type: 'Button',
        props: { label: 'Save', count: 3 },
      }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    // E1: exactly at threshold → does not trigger (> not >=)
    it('E1: prop payload exactly at threshold → does not trigger', () => {
      const rule = createLargeDataPropRule(100)
      const node: ComponentNode = {
        id: 'n',
        type: 'C',
        // JSON.stringify('x'.repeat(98)) = 100 chars: quote + 98 x's + quote
        props: { data: bigString(98) },
      }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(false)
    })

    // E2: custom threshold respected
    it('E2: custom threshold=500 triggers with 501-byte payload', () => {
      const rule = createLargeDataPropRule(500)
      const node: ComponentNode = {
        id: 'n',
        type: 'C',
        props: { data: bigString(600) },
      }
      expect(rule.detect(node, baseMetrics).triggered).toBe(true)
    })

    // E3: function props are excluded from size calculation
    it('E3: function-valued props do not count toward size', () => {
      const rule = createLargeDataPropRule(50)
      const node: ComponentNode = {
        id: 'n',
        type: 'C',
        props: {
          onClick: () => {},
          onSubmit: () => {},
          label: 'x', // tiny — serialises to 3 bytes
        },
      }
      expect(rule.detect(node, baseMetrics).triggered).toBe(false)
    })

    // E4: message contains approximate byte count
    it('E4: triggered issue message contains byte size info', () => {
      const rule = createLargeDataPropRule(100)
      const node: ComponentNode = {
        id: 'n',
        type: 'C',
        props: { data: bigString(200) },
      }
      const result = rule.detect(node, baseMetrics)
      expect(result.issue?.message).toMatch(/\d+.*bytes/i)
    })
  })

  describe('Failure Cases', () => {
    // F1: no props → does not trigger
    it('F1: no props → does not trigger', () => {
      const rule = createLargeDataPropRule()
      const node: ComponentNode = { id: 'n', type: 'div' }
      expect(rule.detect(node, baseMetrics).triggered).toBe(false)
    })

    // F2: empty props → does not trigger
    it('F2: empty props object → does not trigger', () => {
      const rule = createLargeDataPropRule()
      const node: ComponentNode = { id: 'n', type: 'div', props: {} }
      expect(rule.detect(node, baseMetrics).triggered).toBe(false)
    })
  })

  describe('Unknown Cases', () => {
    // U1: circular reference in props → safe fallback (no throw), does not trigger
    it('U1: circular reference in props → safe — returns triggered:false', () => {
      const rule = createLargeDataPropRule()
      const circular: Record<string, unknown> = {}
      circular['self'] = circular
      const node: ComponentNode = { id: 'n', type: 'C', props: circular }
      expect(() => rule.detect(node, baseMetrics)).not.toThrow()
      expect(rule.detect(node, baseMetrics).triggered).toBe(false)
    })

    // U2: rule name is always 'large-data-prop'
    it('U2: rule.name is large-data-prop', () => {
      const rule = createLargeDataPropRule()
      expect(rule.name).toBe('large-data-prop')
    })
  })
})
