import { describe, it, expect } from 'vitest'
import { createFpsDropRule } from '../../../src/rules/fps-drop'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const node: ComponentNode = { id: 'list', type: 'List' }
const baseMetrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 }

describe('FPS Drop Rule', () => {
  describe('Happy Path', () => {
    it('H1: fpsDrop exceeds default threshold (10) → triggers with issue', () => {
      const rule = createFpsDropRule()
      const result = rule.detect(node, { ...baseMetrics, fpsDrop: 20 })
      expect(result.triggered).toBe(true)
      expect(result.issue?.rule).toBe('fps-drop')
      expect(result.issue?.severity).toBe('error')
      expect(result.issue?.nodeId).toBe('list')
    })

    it('H2: fpsDrop below threshold → does not trigger', () => {
      const rule = createFpsDropRule()
      const result = rule.detect(node, { ...baseMetrics, fpsDrop: 5 })
      expect(result.triggered).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('E1: fpsDrop exactly at threshold → does not trigger (strictly >)', () => {
      const rule = createFpsDropRule(10)
      const result = rule.detect(node, { ...baseMetrics, fpsDrop: 10 })
      expect(result.triggered).toBe(false)
    })

    it('E2: custom threshold respected', () => {
      const rule = createFpsDropRule(5)
      const above = rule.detect(node, { ...baseMetrics, fpsDrop: 6 })
      const below = rule.detect(node, { ...baseMetrics, fpsDrop: 4 })
      expect(above.triggered).toBe(true)
      expect(below.triggered).toBe(false)
    })
  })

  describe('Failure Cases', () => {
    it('F1: fpsDrop of 0 → does not trigger', () => {
      const rule = createFpsDropRule()
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(false)
    })
  })

  describe('Unknown Cases', () => {
    it('U1: negative fpsDrop → treated as invalid, no trigger', () => {
      const rule = createFpsDropRule()
      const result = rule.detect(node, { ...baseMetrics, fpsDrop: -5 })
      expect(result.triggered).toBe(false)
    })
  })
})
