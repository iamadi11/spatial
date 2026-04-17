import type { ComponentNode, PerformanceIssue } from '../types'

export type RecursiveComponentRule = {
  name: string
  check: (root: ComponentNode) => PerformanceIssue | null
}

/**
 * Returns true when `type` represents a React component (PascalCase) rather
 * than a DOM element (all-lowercase like `div`, `span`, `p`).
 * Sufficient check: first character is an ASCII uppercase letter.
 */
function isPascalCase(type: string): boolean {
  return type.length > 0 && type[0] >= 'A' && type[0] <= 'Z'
}

/**
 * DFS traversal that carries a Set of ancestor component types.
 * On entering each node:
 *   - If the node type is PascalCase AND already in `ancestors` → fire.
 *   - Otherwise add the type to `ancestors`, recurse into children,
 *     then REMOVE it before returning (backtrack) so siblings don't see it.
 *
 * Backtracking is critical: siblings share a parent's ancestor set, but a
 * sibling's descendants should NOT see the sibling's type as an ancestor.
 *
 * O(n) — each node is visited exactly once.
 * Pure function — no side effects, no DOM, deterministic.
 */
function dfs(
  node: ComponentNode,
  ancestors: Set<string>,
): PerformanceIssue | null {
  const isComponent = isPascalCase(node.type)

  // Check before we add this node's type — ancestors only contains proper ancestors
  if (isComponent && ancestors.has(node.type)) {
    return {
      rule: 'recursive-component',
      severity: 'warning',
      message: `Component type "${node.type}" (id: "${node.id}") appears within its own ancestor chain — recursive rendering increases reconciliation cost and risks infinite loops`,
      nodeId: node.id,
    }
  }

  // Add to ancestor set and recurse
  if (isComponent) ancestors.add(node.type)

  for (const child of node.children ?? []) {
    const result = dfs(child, ancestors)
    if (result !== null) {
      // Don't bother cleaning up — we're returning immediately
      return result
    }
  }

  // Backtrack: remove this node's type so it doesn't appear in a sibling's check
  if (isComponent) ancestors.delete(node.type)

  return null
}

/**
 * Rule: recursive-component
 * SOT Section 12, 7
 *
 * Flags the first node in the tree whose `type` already appears among its
 * ancestor component types — indicating that the component is rendering
 * within an instance of itself.
 *
 * Only PascalCase types are checked (React components). Lowercase types
 * (DOM elements: `div`, `span`, `p`, etc.) are ignored.
 *
 * Tree-level rule. O(n). Pure function, no DOM, deterministic.
 */
export function createRecursiveComponentRule(): RecursiveComponentRule {
  return {
    name: 'recursive-component',
    check: (root: ComponentNode): PerformanceIssue | null => {
      return dfs(root, new Set())
    },
  }
}
