import type { ComponentNode, PerformanceIssue } from '../types'

const DEFAULT_THRESHOLD = 3

export type PropDrillingDepthRule = {
  name: string
  check: (root: ComponentNode) => PerformanceIssue | null
}

/**
 * DFS traversal tracking consecutive depth counts for each prop key.
 *
 * `propDepths` maps prop key → number of consecutive ancestor levels (including
 * the current node's ancestors) that also carried that prop.
 *
 * When entering a node:
 *   - For each key in node.props: depth = parentDepth[key] + 1
 *   - Keys NOT in node.props are not passed forward (chain broken)
 *
 * Fires on the first node where any key's depth exceeds the threshold.
 * Returns null if no violation is found in the entire subtree.
 *
 * O(n × k) where n = nodes, k = max props per node. Typically O(n).
 * Pure function — no side effects, no DOM, deterministic.
 */
function findDrilling(
  node: ComponentNode,
  parentDepths: Map<string, number>,
  threshold: number,
): PerformanceIssue | null {
  const nodePropsKeys = node.props ? Object.keys(node.props) : []
  const currentDepths = new Map<string, number>()

  for (const key of nodePropsKeys) {
    const newDepth = (parentDepths.get(key) ?? 0) + 1
    currentDepths.set(key, newDepth)

    if (newDepth > threshold) {
      return {
        rule: 'prop-drilling-depth',
        severity: 'warning',
        message: `Prop "${key}" drilled through ${newDepth} consecutive component levels (threshold: ${threshold}) — consider lifting to context or co-locating data`,
        nodeId: node.id,
      }
    }
  }

  // Recurse into children; return first violation found
  for (const child of node.children ?? []) {
    const childResult = findDrilling(child, currentDepths, threshold)
    if (childResult !== null) return childResult
  }

  return null
}

/**
 * Rule: prop-drilling-depth
 * SOT Section 12, 7
 *
 * Detects prop drilling — when the same prop key propagates through more than N
 * consecutive ancestor-descendant component levels. This signals tight coupling
 * that should be refactored to context, custom hooks, or co-location.
 *
 * Threshold (default 3): fire when depth > 3 (i.e., 4+ consecutive levels).
 * A gap in prop presence resets the consecutive count for that key.
 *
 * Tree-level rule. O(n) per path, O(n × k) overall where k = props per node.
 * Pure function — no DOM, no side effects, deterministic.
 */
export function createPropDrillingDepthRule(threshold: number = DEFAULT_THRESHOLD): PropDrillingDepthRule {
  return {
    name: 'prop-drilling-depth',
    check: (root: ComponentNode): PerformanceIssue | null => {
      return findDrilling(root, new Map(), threshold)
    },
  }
}
