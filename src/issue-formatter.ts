import type { PerformanceIssue } from './types'

/**
 * Formats a single PerformanceIssue into a human-readable string.
 * SOT Section 5.2 — issue fields: rule, severity, message, nodeId
 * SOT Section 14 — no ambiguity in output
 */
export function formatIssue(issue: PerformanceIssue): string {
  return `[${issue.severity}] ${issue.rule}: ${issue.message} (node: ${issue.nodeId})`
}

/**
 * Formats an array of PerformanceIssues into a newline-joined summary string.
 * Returns "No issues found." for an empty array.
 * SOT Section 9 — structured output; Section 5.2 — issues contract.
 */
export function formatIssues(issues: PerformanceIssue[]): string {
  if (issues.length === 0) {
    return 'No issues found.'
  }
  return issues.map(formatIssue).join('\n')
}
