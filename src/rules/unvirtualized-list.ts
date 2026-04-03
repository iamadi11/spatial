import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 50

/**
 * Rule: unvirtualized-list
 * SOT Section 4.2.2 — "long lists without virtualization"
 *
 * Detects a node whose immediate children contain N or more siblings of the
 * same component type. This pattern indicates an unvirtualized list (e.g.
 * rendering 100× <Row> components without react-window/react-virtual).
 *
 * Only immediate children are inspected — no nested traversal.
 * Metrics are not used by this rule (structural check only).
 */
export function createUnvirtualizedListRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'unvirtualized-list',
    detect: (node, _metrics) => {
      const children = node.children
      if (!children || children.length === 0) {
        return { triggered: false }
      }

      // Count occurrences of each child type
      const typeCounts = new Map<string, number>()
      for (const child of children) {
        typeCounts.set(child.type, (typeCounts.get(child.type) ?? 0) + 1)
      }

      // Find the largest group
      let maxCount = 0
      let dominantType = ''
      for (const [type, count] of typeCounts) {
        if (count > maxCount) {
          maxCount = count
          dominantType = type
        }
      }

      if (maxCount <= threshold) {
        return { triggered: false }
      }

      return {
        triggered: true,
        issue: {
          rule: 'unvirtualized-list',
          severity: 'warning',
          message: `${maxCount} children of type "${dominantType}" — consider virtualizing this list (threshold: ${threshold})`,
          nodeId: node.id,
        },
      }
    },
  }
}
