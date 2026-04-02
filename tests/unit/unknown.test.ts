import { describe, it, expect } from 'vitest'
import { unknownResult } from '../../src/unknown'

describe('Unknown Handler', () => {
  describe('Happy Path', () => {
    it('H1: returns status unknown with the provided reason', () => {
      const result = unknownResult('metrics contain invalid values')
      expect(result.status).toBe('unknown')
      expect(result.reason).toBe('metrics contain invalid values')
    })

    it('H2: returns zero-value metrics and empty issues', () => {
      const result = unknownResult('unsupported environment')
      expect(result.metrics.renderCount).toBe(0)
      expect(result.metrics.layoutShifts).toBe(0)
      expect(result.metrics.fpsDrop).toBe(0)
      expect(result.metrics.memoryUsage).toBe(0)
      expect(result.issues).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('E1: works with an empty reason string', () => {
      const result = unknownResult('')
      expect(result.status).toBe('unknown')
      expect(result.reason).toBe('')
    })

    it('E2: each call returns a new independent object (no shared state)', () => {
      const r1 = unknownResult('reason-a')
      const r2 = unknownResult('reason-b')
      expect(r1.reason).toBe('reason-a')
      expect(r2.reason).toBe('reason-b')
      r1.issues.push({ rule: 'test', severity: 'warning', message: 'x', nodeId: 'n' })
      expect(r2.issues).toHaveLength(0) // r2 not affected
    })
  })

  describe('Failure Cases', () => {
    it('F1: status is always exactly "unknown", never "pass" or "fail"', () => {
      const result = unknownResult('something went wrong')
      expect(result.status).not.toBe('pass')
      expect(result.status).not.toBe('fail')
      expect(result.status).toBe('unknown')
    })
  })

  describe('Unknown Cases', () => {
    it('U1: represents the SOT Section 9 contract shape exactly', () => {
      const result = unknownResult('unsupported input or environment')
      // SOT Section 9: { "status": "unknown", "reason": "unsupported input or environment" }
      expect(result).toMatchObject({
        status: 'unknown',
        reason: 'unsupported input or environment',
        metrics: { renderCount: 0, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
        issues: [],
      })
    })
  })
})
