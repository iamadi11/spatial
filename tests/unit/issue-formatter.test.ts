import { describe, it, expect } from 'vitest'
import { formatIssue, formatIssues } from '../../src/issue-formatter'
import type { PerformanceIssue } from '../../src/types'

const warningIssue: PerformanceIssue = {
  rule: 'render-count',
  severity: 'warning',
  message: 'Too many renders',
  nodeId: 'btn',
}

const errorIssue: PerformanceIssue = {
  rule: 'fps-drop',
  severity: 'error',
  message: 'FPS drop of 20',
  nodeId: 'list',
}

describe('Issue Formatter', () => {
  describe('Happy Path', () => {
    it('H1: formatIssue with warning severity → correct format', () => {
      expect(formatIssue(warningIssue)).toBe('[warning] render-count: Too many renders (node: btn)')
    })

    it('H2: formatIssue with error severity → correct format', () => {
      expect(formatIssue(errorIssue)).toBe('[error] fps-drop: FPS drop of 20 (node: list)')
    })

    it('H3: formatIssues with multiple issues → newline-joined', () => {
      const result = formatIssues([warningIssue, errorIssue])
      expect(result).toBe(
        '[warning] render-count: Too many renders (node: btn)\n[error] fps-drop: FPS drop of 20 (node: list)',
      )
    })
  })

  describe('Edge Cases', () => {
    it('E1: formatIssues with empty array → "No issues found."', () => {
      expect(formatIssues([])).toBe('No issues found.')
    })

    it('E2: formatIssues with single issue → single formatted string', () => {
      const result = formatIssues([warningIssue])
      expect(result).toBe('[warning] render-count: Too many renders (node: btn)')
      expect(result).not.toContain('\n')
    })
  })

  describe('Failure Cases', () => {
    it('F1: formatIssue preserves exact message text with special chars', () => {
      const issue: PerformanceIssue = {
        rule: 'memory-usage',
        severity: 'error',
        message: 'Memory usage 150MB exceeds threshold of 100MB',
        nodeId: 'table-1',
      }
      const result = formatIssue(issue)
      expect(result).toContain('Memory usage 150MB exceeds threshold of 100MB')
    })
  })

  describe('Unknown Cases', () => {
    it('U1: formatIssues with empty issues (from unknown result) → "No issues found."', () => {
      // unknown results always have issues: []
      expect(formatIssues([])).toBe('No issues found.')
    })
  })
})
