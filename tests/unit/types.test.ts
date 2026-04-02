import { describe, it, expect } from 'vitest'
import type {
  ComponentNode,
  PerformanceMetrics,
  PerformanceIssue,
  PerformanceResult,
} from '../../src/types'

describe('Type Definitions', () => {
  describe('Happy Path', () => {
    it('H1: ComponentNode accepts a full node with all optional fields', () => {
      const node: ComponentNode = {
        id: 'btn-1',
        type: 'Button',
        props: { disabled: false, label: 'Click me' },
        children: [
          { id: 'icon-1', type: 'Icon' },
        ],
        styles: { color: 'red', fontSize: '14px' },
      }
      expect(node.id).toBe('btn-1')
      expect(node.type).toBe('Button')
      expect(node.props?.disabled).toBe(false)
      expect(node.children).toHaveLength(1)
      expect(node.styles?.color).toBe('red')
    })

    it('H2: PerformanceResult accepts a passing result with metrics', () => {
      const result: PerformanceResult = {
        status: 'pass',
        metrics: {
          renderCount: 1,
          layoutShifts: 0,
          fpsDrop: 0,
          memoryUsage: 5,
        },
        issues: [],
      }
      expect(result.status).toBe('pass')
      expect(result.metrics.renderCount).toBe(1)
      expect(result.issues).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('E1: ComponentNode works with only required fields (id + type)', () => {
      const node: ComponentNode = {
        id: 'root',
        type: 'View',
      }
      expect(node.id).toBe('root')
      expect(node.type).toBe('View')
      expect(node.props).toBeUndefined()
      expect(node.children).toBeUndefined()
      expect(node.styles).toBeUndefined()
    })

    it('E2: PerformanceResult accepts a fail status with issues', () => {
      const issue: PerformanceIssue = {
        rule: 'render-count',
        severity: 'warning',
        message: 'Component re-renders 12 times (threshold: 5)',
        nodeId: 'btn-1',
      }
      const result: PerformanceResult = {
        status: 'fail',
        metrics: {
          renderCount: 12,
          layoutShifts: 3,
          fpsDrop: 15,
          memoryUsage: 200,
        },
        issues: [issue],
      }
      expect(result.status).toBe('fail')
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0].rule).toBe('render-count')
    })
  })

  describe('Failure Cases', () => {
    it('F1: PerformanceResult status is strictly "pass" | "fail" | "unknown"', () => {
      const validStatuses: PerformanceResult['status'][] = ['pass', 'fail', 'unknown']
      for (const status of validStatuses) {
        const result: PerformanceResult = {
          status,
          metrics: { renderCount: 0, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
          issues: [],
        }
        expect(['pass', 'fail', 'unknown']).toContain(result.status)
      }
    })
  })

  describe('Unknown Cases', () => {
    it('U1: PerformanceResult supports unknown status with reason', () => {
      const result: PerformanceResult = {
        status: 'unknown',
        metrics: { renderCount: 0, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 },
        issues: [],
        reason: 'cannot measure reliably in this environment',
      }
      expect(result.status).toBe('unknown')
      expect(result.reason).toBe('cannot measure reliably in this environment')
    })
  })
})
