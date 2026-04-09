import type { Rule } from '../rule-registry'

const DEFAULT_MIN_DIRECT_CHILDREN = 10
const DEFAULT_MIN_DISTINCT_TYPES = 6

export type MultiTypeSiblingFanoutOptions = {
  /** Minimum number of direct children required (default 10). */
  minDirectChildren?: number
  /** Minimum number of distinct `type` strings among those children (default 6). */
  minDistinctTypes?: number
}

/**
 * Rule: multi-type-sibling-fanout
 * Flags a parent that renders many direct children of many different component types
 * (“kitchen sink” composition) — complements child-count and unvirtualized-list.
 *
 * Per-node O(children); sum over tree visits is O(n) for n nodes.
 * Metrics are unused (structural check only).
 */
export function createMultiTypeSiblingFanoutRule(
  options: MultiTypeSiblingFanoutOptions = {},
): Rule {
  const minDirectChildren = options.minDirectChildren ?? DEFAULT_MIN_DIRECT_CHILDREN
  const minDistinctTypes = options.minDistinctTypes ?? DEFAULT_MIN_DISTINCT_TYPES

  return {
    name: 'multi-type-sibling-fanout',
    detect: (node, _metrics) => {
      const children = node.children
      if (!children || children.length === 0) {
        return { triggered: false }
      }

      if (children.length < minDirectChildren) {
        return { triggered: false }
      }

      const types = new Set<string>()
      for (const child of children) {
        types.add(child.type)
      }

      if (types.size < minDistinctTypes) {
        return { triggered: false }
      }

      return {
        triggered: true,
        issue: {
          rule: 'multi-type-sibling-fanout',
          severity: 'warning',
          message: `${children.length} direct children with ${types.size} distinct types — consider splitting this kitchen-sink render (thresholds: ≥${minDirectChildren} children, ≥${minDistinctTypes} distinct types)`,
          nodeId: node.id,
        },
      }
    },
  }
}
