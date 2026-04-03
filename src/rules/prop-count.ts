import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 15

/**
 * Rule: prop-count
 * SOT Section 4.2.2 — "Large component trees" / prop-heavy components are a re-render risk.
 * Flags any node whose props object has more keys than the threshold.
 * Pure function — reads Object.keys(node.props) only, no side effects.
 */
export function createPropCountRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'prop-count',
    detect: (node, _metrics) => {
      const count = Object.keys(node.props ?? {}).length
      if (count > threshold) {
        return {
          triggered: true,
          issue: {
            rule: 'prop-count',
            severity: 'warning',
            message: `Component has ${count} props (threshold: ${threshold})`,
            nodeId: node.id,
          },
        }
      }
      return { triggered: false }
    },
  }
}
