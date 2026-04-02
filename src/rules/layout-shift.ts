import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 3

/**
 * Rule: layout-shift
 * SOT Section 6.3 — "IF layoutShift > threshold → flag layout instability"
 */
export function createLayoutShiftRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'layout-shift',
    detect: (node, metrics) => {
      if (metrics.layoutShifts <= 0) {
        return { triggered: false }
      }
      if (metrics.layoutShifts > threshold) {
        return {
          triggered: true,
          issue: {
            rule: 'layout-shift',
            severity: 'warning',
            message: `Layout shifts ${metrics.layoutShifts} times (threshold: ${threshold})`,
            nodeId: node.id,
          },
        }
      }
      return { triggered: false }
    },
  }
}
