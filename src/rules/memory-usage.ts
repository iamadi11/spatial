import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 100 // MB

/**
 * Rule: memory-usage
 * SOT Section 5.2 — metrics.memoryUsage; Section 2.3 — never guess metrics.
 * Severity is "error" — memory anomalies are critical performance issues.
 */
export function createMemoryUsageRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'memory-usage',
    detect: (node, metrics) => {
      if (metrics.memoryUsage <= 0) {
        return { triggered: false }
      }
      if (metrics.memoryUsage > threshold) {
        return {
          triggered: true,
          issue: {
            rule: 'memory-usage',
            severity: 'error',
            message: `Memory usage ${metrics.memoryUsage}MB exceeds threshold of ${threshold}MB`,
            nodeId: node.id,
          },
        }
      }
      return { triggered: false }
    },
  }
}
