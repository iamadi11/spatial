import { describe, it, expect } from 'vitest'
import { formatReport } from '../../src/report-summary'
import type { PerformanceResult } from '../../src/types'

const baseMetrics = { renderCount: 2, layoutShifts: 0, fpsDrop: 0, memoryUsage: 45 }

describe('formatReport', () => {
  // Happy path 1: PASS result
  it('formats a passing result with status and metrics', () => {
    const result: PerformanceResult = { status: 'pass', metrics: baseMetrics, issues: [] }
    const output = formatReport(result)
    expect(output).toContain('Status: PASS')
    expect(output).toContain('renderCount=2')
    expect(output).toContain('layoutShifts=0')
    expect(output).toContain('fpsDrop=0')
    expect(output).toContain('memoryUsage=45')
    expect(output).toContain('none')
  })

  // Happy path 2: FAIL result with issues
  it('formats a failing result and lists all issues', () => {
    const result: PerformanceResult = {
      status: 'fail',
      metrics: { renderCount: 8, layoutShifts: 5, fpsDrop: 0, memoryUsage: 45 },
      issues: [
        { rule: 'render-count', severity: 'warning', message: 'Component re-renders 8 times (threshold: 5)', nodeId: 'root' },
        { rule: 'layout-shift', severity: 'warning', message: 'Layout shifts 5 times (threshold: 3)', nodeId: 'root' },
      ],
    }
    const output = formatReport(result)
    expect(output).toContain('Status: FAIL')
    expect(output).toContain('render-count')
    expect(output).toContain('layout-shift')
    expect(output).toContain('renderCount=8')
  })

  // Happy path 3: UNKNOWN result with reason
  it('formats an unknown result and includes the reason', () => {
    const result: PerformanceResult = {
      status: 'unknown',
      metrics: baseMetrics,
      issues: [],
      reason: 'metrics contain invalid values',
    }
    const output = formatReport(result)
    expect(output).toContain('Status: UNKNOWN')
    expect(output).toContain('metrics contain invalid values')
  })

  // Edge case 1: status is uppercased
  it('uppercases the status value', () => {
    const pass: PerformanceResult = { status: 'pass', metrics: baseMetrics, issues: [] }
    const fail: PerformanceResult = { status: 'fail', metrics: baseMetrics, issues: [] }
    expect(formatReport(pass)).toContain('PASS')
    expect(formatReport(fail)).toContain('FAIL')
  })

  // Edge case 2: single issue renders correctly
  it('renders a single issue inside the issues section', () => {
    const result: PerformanceResult = {
      status: 'fail',
      metrics: baseMetrics,
      issues: [{ rule: 'fps-drop', severity: 'error', message: 'FPS drop of 15 frames', nodeId: 'n1' }],
    }
    const output = formatReport(result)
    expect(output).toContain('fps-drop')
    expect(output).toContain('n1')
  })

  // Edge case 3: result without reason field — no "Reason:" line
  it('omits the Reason line when result has no reason field', () => {
    const result: PerformanceResult = { status: 'pass', metrics: baseMetrics, issues: [] }
    expect(formatReport(result)).not.toContain('Reason:')
  })

  // Failure case: output is a string (not object, not array)
  it('always returns a string', () => {
    const result: PerformanceResult = { status: 'pass', metrics: baseMetrics, issues: [] }
    expect(typeof formatReport(result)).toBe('string')
  })

  // Unknown: same input always produces same output (deterministic)
  it('is deterministic — same result produces same string', () => {
    const result: PerformanceResult = { status: 'pass', metrics: baseMetrics, issues: [] }
    expect(formatReport(result)).toBe(formatReport(result))
  })
})
