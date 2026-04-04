import type { ComponentNode, PerformanceIssue } from '../types'

const DEFAULT_THRESHOLD = 4

export type SingleChildChainRule = {
  name: string
  check: (root: ComponentNode) => PerformanceIssue | null
}

/**
 * Traverses the tree in a single O(n) pass.
 *
 * A "single-child chain" is a contiguous sequence of nodes where each has
 * at most 1 child (childCount 0 or 1). The chain includes both the starting
 * wrapper nodes AND the final leaf. A node with 2+ children breaks the chain.
 *
 * `currentLen` = number of nodes in the current chain so far (0 if no chain
 * is active for the current path).
 * `currentChainRootId` = id of the node that started the current chain.
 *
 * Returns the longest chain found in this subtree.
 *
 * Pure function — no side effects, no mutations.
 */
function findMaxChain(
  node: ComponentNode,
  currentLen: number,
  currentChainRootId: string,
): { maxChain: number; chainRootId: string } {
  const childCount = node.children?.length ?? 0

  if (childCount <= 1) {
    // This node participates in the current chain
    const newLen = currentLen + 1
    const newRootId = currentLen === 0 ? node.id : currentChainRootId

    if (childCount === 0) {
      // Leaf — chain ends here; record its length
      return { maxChain: newLen, chainRootId: newRootId }
    }

    // Single child — extend chain through it
    return findMaxChain(node.children![0], newLen, newRootId)
  }

  // childCount >= 2: this node breaks the chain; it is NOT counted in any chain
  // Record whatever chain was active before this node
  let best: { maxChain: number; chainRootId: string } = {
    maxChain: currentLen,
    chainRootId: currentChainRootId,
  }

  // Each child starts a fresh chain search of its own
  for (const child of node.children!) {
    const childResult = findMaxChain(child, 0, child.id)
    if (childResult.maxChain > best.maxChain) {
      best = childResult
    }
  }

  return best
}

/**
 * Rule: single-child-chain
 * SOT Section 4.2.2, 7, 11
 *
 * Detects "wrapper hell" — long chains of components where each wraps exactly
 * one child without branching or adding structure. Complements `nesting-depth`
 * by specifically isolating the single-child anti-pattern.
 *
 * Chain length = number of contiguous nodes with ≤1 child (wrappers + leaf).
 * A node with 2+ children resets the chain.
 *
 * Tree-level rule (same pattern as nesting-depth, total-node-count).
 * O(n) — each node visited exactly once.
 * Metrics are unused (structural check only).
 * Pure function — no DOM, no side effects, deterministic.
 */
export function createSingleChildChainRule(threshold: number = DEFAULT_THRESHOLD): SingleChildChainRule {
  return {
    name: 'single-child-chain',
    check: (root: ComponentNode): PerformanceIssue | null => {
      const result = findMaxChain(root, 0, root.id)

      if (result.maxChain > threshold) {
        return {
          rule: 'single-child-chain',
          severity: 'warning',
          message: `Component tree contains a single-child chain of depth ${result.maxChain} (threshold: ${threshold}) — consider flattening wrapper components`,
          nodeId: result.chainRootId,
        }
      }

      return null
    },
  }
}
