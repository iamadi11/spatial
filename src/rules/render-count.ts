import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 5

/**
 * Rule: render-count
 * SOT Section 6.3 — "IF renderCount > threshold → flag re-render"
 */
export function createRenderCountRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'render-count',
    detect: (node, metrics) => {
      if (metrics.renderCount <= 0) {
        return { triggered: false }
      }
      if (metrics.renderCount > threshold) {
        return {
          triggered: true,
          issue: {
            rule: 'render-count',
            severity: 'warning',
            message: `Component re-renders ${metrics.renderCount} times (threshold: ${threshold})`,
            nodeId: node.id,
          },
        }
      }
      return { triggered: false }
    },
  }
}
