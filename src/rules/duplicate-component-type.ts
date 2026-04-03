import type { ComponentNode, PerformanceIssue } from '../types'

/**
 * Tree-level rule: counts occurrences of each component type in a single O(n)
 * traversal and flags any Pascal-cased type that exceeds the threshold.
 *
 * HTML tag types (lowercase first char) are intentionally ignored.
 * Only one issue is returned — for the most-repeated offending type.
 *
 * SOT Section 4.2.2 (tree structure), 7 (rule template), 11 (O(n))
 */

export type DuplicateComponentTypeRule = {
  name: string
  check: (root: ComponentNode) => PerformanceIssue | null
}

function countTypes(node: ComponentNode, counts: Map<string, { count: number; firstId: string }>): void {
  const { type, id } = node
  // Only count component types (Pascal-cased — first char uppercase)
  if (type.length > 0 && type[0] === type[0].toUpperCase() && type[0] !== type[0].toLowerCase()) {
    const existing = counts.get(type)
    if (existing) {
      existing.count++
    } else {
      counts.set(type, { count: 1, firstId: id })
    }
  }
  if (node.children) {
    for (const child of node.children) {
      countTypes(child, counts)
    }
  }
}

export function createDuplicateComponentTypeRule(threshold = 30): DuplicateComponentTypeRule {
  return {
    name: 'duplicate-component-type',
    check(root: ComponentNode): PerformanceIssue | null {
      const counts = new Map<string, { count: number; firstId: string }>()
      countTypes(root, counts)

      let worstType = ''
      let worstCount = 0
      let worstId = root.id

      for (const [type, { count, firstId }] of counts) {
        if (count > threshold && count > worstCount) {
          worstType = type
          worstCount = count
          worstId = firstId
        }
      }

      if (!worstType) return null

      return {
        rule: 'duplicate-component-type',
        severity: 'warning',
        message: `Component type "${worstType}" appears ${worstCount} times (threshold: ${threshold}) — consider virtualisation`,
        nodeId: worstId,
      }
    },
  }
}
