import { describe, it, expect } from 'vitest'
import { createLayoutShiftRule } from '../../../src/rules/layout-shift'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const node: ComponentNode = { id: 'card', type: 'Card' }
const baseMetrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 }

describe('Layout Shift Rule', () => {
  describe('Happy Path', () => {
    it('H1: layoutShifts exceeds default threshold (3) → triggers with issue', () => {
      const rule = createLayoutShiftRule()
      const result = rule.detect(node, { ...baseMetrics, layoutShifts: 5 })
      expect(result.triggered).toBe(true)
      expect(result.issue?.rule).toBe('layout-shift')
      expect(result.issue?.severity).toBe('warning')
      expect(result.issue?.nodeId).toBe('card')
    })

    it('H2: layoutShifts below threshold → does not trigger', () => {
      const rule = createLayoutShiftRule()
      const result = rule.detect(node, { ...baseMetrics, layoutShifts: 1 })
      expect(result.triggered).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('E1: layoutShifts exactly at threshold → does not trigger (strictly >)', () => {
      const rule = createLayoutShiftRule(3)
      const result = rule.detect(node, { ...baseMetrics, layoutShifts: 3 })
      expect(result.triggered).toBe(false)
    })

    it('E2: custom threshold respected', () => {
      const rule = createLayoutShiftRule(1)
      const above = rule.detect(node, { ...baseMetrics, layoutShifts: 2 })
      const below = rule.detect(node, { ...baseMetrics, layoutShifts: 1 })
      expect(above.triggered).toBe(true)
      expect(below.triggered).toBe(false)
    })
  })

  describe('Failure Cases', () => {
    it('F1: layoutShifts of 0 → does not trigger', () => {
      const rule = createLayoutShiftRule()
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(false)
    })
  })

  describe('Unknown Cases', () => {
    it('U1: negative layoutShifts → treated as invalid, no trigger', () => {
      const rule = createLayoutShiftRule()
      const result = rule.detect(node, { ...baseMetrics, layoutShifts: -1 })
      expect(result.triggered).toBe(false)
    })
  })
})
