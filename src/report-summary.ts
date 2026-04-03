import type { PerformanceResult } from './types'
import { formatIssues } from './issue-formatter'

/**
 * Formats a complete PerformanceResult into a human-readable multi-line text block.
 * Builds on formatIssues() from issue-formatter.ts (item 012).
 *
 * SOT Section 5.2 — output contract; Section 9 — failure handling.
 * Pure function — no DOM, no side effects, deterministic.
 */
export function formatReport(result: PerformanceResult): string {
  const lines: string[] = []

  lines.push(`Status: ${result.status.toUpperCase()}`)

  const m = result.metrics
  lines.push(
    `Metrics: renderCount=${m.renderCount} layoutShifts=${m.layoutShifts} fpsDrop=${m.fpsDrop} memoryUsage=${m.memoryUsage}`
  )

  if (result.reason !== undefined) {
    lines.push(`Reason: ${result.reason}`)
  }

  if (result.issues.length === 0) {
    lines.push('Issues: none')
  } else {
    lines.push('Issues:')
    lines.push(formatIssues(result.issues))
  }

  return lines.join('\n')
}
