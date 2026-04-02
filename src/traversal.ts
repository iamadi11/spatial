import type { ComponentNode } from './types'

/**
 * Visits every node in the component tree exactly once, depth-first.
 * O(n) — each node visited once, no repeated traversal.
 * Pure function — visitor may have side effects but traversal itself does not.
 */
export function walkTree(node: ComponentNode, visitor: (node: ComponentNode) => void): void {
  visitor(node)
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      walkTree(child, visitor)
    }
  }
}

/**
 * Returns a flat array of all nodes in the tree in depth-first order.
 * O(n) — each node added to the result array once.
 * Pure function — returns a new array, does not mutate the tree.
 */
export function collectNodes(node: ComponentNode): ComponentNode[] {
  const result: ComponentNode[] = []
  walkTree(node, (n) => { result.push(n) })
  return result
}
