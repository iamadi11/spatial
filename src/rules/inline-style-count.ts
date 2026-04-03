import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 15

/**
 * Rule: inline-style-count
 * SOT Section 4.2.2 — excessive inline style declarations incur per-render parsing overhead.
 * Flags any node whose styles object has more keys than the threshold.
 *
 * Distinct from style-complexity (which checks property names) and prop-count (which checks props).
 * Pure function — reads Object.keys(node.styles) only, no side effects.
 */
export function createInlineStyleCountRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'inline-style-count',
    detect: (node, _metrics) => {
      const count = Object.keys(node.styles ?? {}).length
      if (count > threshold) {
        return {
          triggered: true,
          issue: {
            rule: 'inline-style-count',
            severity: 'warning',
            message: `Component has ${count} inline style declarations (threshold: ${threshold})`,
            nodeId: node.id,
          },
        }
      }
      return { triggered: false }
    },
  }
}
