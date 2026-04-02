import { describe, it, expect } from 'vitest'
import { createRenderCountRule } from '../../../src/rules/render-count'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const node: ComponentNode = { id: 'btn', type: 'Button' }
const baseMetrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 }

describe('Render Count Rule', () => {
  describe('Happy Path', () => {
    it('H1: renderCount exceeds default threshold (5) → triggers with issue', () => {
      const rule = createRenderCountRule()
      const result = rule.detect(node, { ...baseMetrics, renderCount: 10 })
      expect(result.triggered).toBe(true)
      expect(result.issue).toBeDefined()
      expect(result.issue?.rule).toBe('render-count')
      expect(result.issue?.nodeId).toBe('btn')
      expect(result.issue?.severity).toBe('warning')
    })

    it('H2: renderCount below threshold → does not trigger', () => {
      const rule = createRenderCountRule()
      const result = rule.detect(node, { ...baseMetrics, renderCount: 3 })
      expect(result.triggered).toBe(false)
      expect(result.issue).toBeUndefined()
    })
  })

  describe('Edge Cases', () => {
    it('E1: renderCount exactly at threshold → does not trigger (> not >=)', () => {
      const rule = createRenderCountRule(5)
      const result = rule.detect(node, { ...baseMetrics, renderCount: 5 })
      expect(result.triggered).toBe(false)
    })

    it('E2: custom threshold respected', () => {
      const rule = createRenderCountRule(2)
      const above = rule.detect(node, { ...baseMetrics, renderCount: 3 })
      const below = rule.detect(node, { ...baseMetrics, renderCount: 1 })
      expect(above.triggered).toBe(true)
      expect(below.triggered).toBe(false)
    })
  })

  describe('Failure Cases', () => {
    it('F1: renderCount of 0 → does not trigger', () => {
      const rule = createRenderCountRule()
      const result = rule.detect(node, { ...baseMetrics, renderCount: 0 })
      expect(result.triggered).toBe(false)
    })
  })

  describe('Unknown Cases', () => {
    it('U1: negative renderCount → returns triggered: false (invalid, treat as unknown/no-op)', () => {
      const rule = createRenderCountRule()
      const result = rule.detect(node, { ...baseMetrics, renderCount: -1 })
      expect(result.triggered).toBe(false)
    })
  })
})
