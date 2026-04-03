import type { ComponentNode, PerformanceIssue } from '../types'

const DEFAULT_THRESHOLD = 10

/**
 * Computes the maximum depth of a component tree via depth-first traversal.
 * Root node counts as depth 1.
 * O(n) — each node visited exactly once.
 * Pure function — no side effects, no mutations.
 *
 * SOT Section 11: O(n) traversal max.
 */
export function computeMaxDepth(root: ComponentNode): number {
  if (!root.children || root.children.length === 0) {
    return 1
  }
  let max = 0
  for (const child of root.children) {
    const childDepth = computeMaxDepth(child)
    if (childDepth > max) {
      max = childDepth
    }
  }
  return 1 + max
}

export type NestingDepthRule = {
  name: string
  check: (root: ComponentNode) => PerformanceIssue | null
}

/**
 * Rule: nesting-depth
 * SOT Section 4.2.2 — "Nested layouts" / "deeply nested components".
 *
 * Tree-level checker (not per-node) to preserve O(n) traversal.
 * Computes max depth once per `check()` call.
 *
 * Pure function — no DOM, no side effects, deterministic.
 */
export function createNestingDepthRule(threshold: number = DEFAULT_THRESHOLD): NestingDepthRule {
  return {
    name: 'nesting-depth',
    check: (root: ComponentNode): PerformanceIssue | null => {
      const depth = computeMaxDepth(root)
      if (depth > threshold) {
        return {
          rule: 'nesting-depth',
          severity: 'warning',
          message: `Component tree reaches depth ${depth} (threshold: ${threshold})`,
          nodeId: root.id,
        }
      }
      return null
    },
  }
}
