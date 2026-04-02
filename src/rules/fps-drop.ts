import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 10

/**
 * Rule: fps-drop
 * SOT Section 5.2 — metrics.fpsDrop; Section 6.1 — never assume baseline FPS.
 * Severity is "error" because FPS drops are more severe than re-renders.
 */
export function createFpsDropRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'fps-drop',
    detect: (node, metrics) => {
      if (metrics.fpsDrop <= 0) {
        return { triggered: false }
      }
      if (metrics.fpsDrop > threshold) {
        return {
          triggered: true,
          issue: {
            rule: 'fps-drop',
            severity: 'error',
            message: `FPS drop of ${metrics.fpsDrop} frames (threshold: ${threshold})`,
            nodeId: node.id,
          },
        }
      }
      return { triggered: false }
    },
  }
}
