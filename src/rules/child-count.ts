import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 20

/**
 * Rule: child-count
 * SOT Section 4.2.2 — "Large component trees" / "Long lists without virtualization"
 * Flags any node whose direct children count exceeds the threshold.
 * Pure function — reads node.children.length only, no side effects.
 */
export function createChildCountRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'child-count',
    detect: (node, _metrics) => {
      const count = node.children?.length ?? 0
      if (count > threshold) {
        return {
          triggered: true,
          issue: {
            rule: 'child-count',
            severity: 'warning',
            message: `Component has ${count} direct children (threshold: ${threshold})`,
            nodeId: node.id,
          },
        }
      }
      return { triggered: false }
    },
  }
}
