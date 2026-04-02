import { describe, it, expect } from 'vitest'
import { createMemoryUsageRule } from '../../../src/rules/memory-usage'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const node: ComponentNode = { id: 'table', type: 'DataTable' }
const baseMetrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 }

describe('Memory Usage Rule', () => {
  describe('Happy Path', () => {
    it('H1: memoryUsage exceeds default threshold (100MB) → triggers with issue', () => {
      const rule = createMemoryUsageRule()
      const result = rule.detect(node, { ...baseMetrics, memoryUsage: 200 })
      expect(result.triggered).toBe(true)
      expect(result.issue?.rule).toBe('memory-usage')
      expect(result.issue?.severity).toBe('error')
      expect(result.issue?.nodeId).toBe('table')
    })

    it('H2: memoryUsage below threshold → does not trigger', () => {
      const rule = createMemoryUsageRule()
      const result = rule.detect(node, { ...baseMetrics, memoryUsage: 50 })
      expect(result.triggered).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('E1: memoryUsage exactly at threshold → does not trigger (strictly >)', () => {
      const rule = createMemoryUsageRule(100)
      const result = rule.detect(node, { ...baseMetrics, memoryUsage: 100 })
      expect(result.triggered).toBe(false)
    })

    it('E2: custom threshold respected', () => {
      const rule = createMemoryUsageRule(50)
      const above = rule.detect(node, { ...baseMetrics, memoryUsage: 51 })
      const below = rule.detect(node, { ...baseMetrics, memoryUsage: 49 })
      expect(above.triggered).toBe(true)
      expect(below.triggered).toBe(false)
    })
  })

  describe('Failure Cases', () => {
    it('F1: memoryUsage of 0 → does not trigger', () => {
      const rule = createMemoryUsageRule()
      const result = rule.detect(node, { ...baseMetrics, memoryUsage: 0 })
      expect(result.triggered).toBe(false)
    })
  })

  describe('Unknown Cases', () => {
    it('U1: negative memoryUsage → treated as invalid, no trigger', () => {
      const rule = createMemoryUsageRule()
      const result = rule.detect(node, { ...baseMetrics, memoryUsage: -10 })
      expect(result.triggered).toBe(false)
    })
  })
})
