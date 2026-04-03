import type { ComponentNode, PerformanceIssue } from '../types'

const DEFAULT_THRESHOLD = 200

/**
 * Counts all nodes in the component tree via depth-first traversal.
 * O(n) — each node visited exactly once.
 * Pure function — no side effects, no mutations.
 *
 * SOT Section 11: O(n) traversal max.
 */
export function countNodes(root: ComponentNode): number {
  let count = 1
  if (root.children) {
    for (const child of root.children) {
      count += countNodes(child)
    }
  }
  return count
}

export type TotalNodeCountRule = {
  name: string
  check: (root: ComponentNode) => PerformanceIssue | null
}

/**
 * Rule: total-node-count
 * SOT Section 4.2.2 — "Very large component trees".
 *
 * Tree-level checker (not per-node) — computes total nodes in O(n).
 * Flags trees whose total node count exceeds the threshold.
 *
 * Pure function — no DOM, no side effects, deterministic.
 */
export function createTotalNodeCountRule(threshold: number = DEFAULT_THRESHOLD): TotalNodeCountRule {
  return {
    name: 'total-node-count',
    check: (root: ComponentNode): PerformanceIssue | null => {
      const total = countNodes(root)
      if (total > threshold) {
        return {
          rule: 'total-node-count',
          severity: 'warning',
          message: `Component tree has ${total} nodes (threshold: ${threshold})`,
          nodeId: root.id,
        }
      }
      return null
    },
  }
}
