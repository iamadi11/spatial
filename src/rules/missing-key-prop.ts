import type { Rule, RuleResult } from '../rule-registry'
import type { ComponentNode, PerformanceMetrics } from '../types'

/**
 * Rule: missing-key-prop
 * SOT Section 12, 7
 *
 * Flags parent nodes that have 2+ children of the same component type where
 * NONE of the children in that group have a `props.key` value.
 *
 * Rationale: React uses `key` to match elements across renders in a list.
 * Missing keys cause unnecessary unmount/remount cycles and can produce subtle
 * state bugs. This is the most common React list anti-pattern.
 *
 * Detection logic:
 * - Group children by `type`
 * - For any group with 2+ members: if every member lacks `props.key`, fire
 * - Returns one issue for the first offending group (per parent node)
 *
 * Node-level rule: `detect(node, metrics)` inspects node.children only.
 * O(n) — one pass over children. Pure function, no DOM, deterministic.
 */
export function createMissingKeyPropRule(): Rule {
  return {
    name: 'missing-key-prop',
    detect: (node: ComponentNode, _metrics: PerformanceMetrics): RuleResult => {
      const children = node.children
      if (!children || children.length < 2) {
        return { triggered: false }
      }

      // Group children by type
      const byType = new Map<string, ComponentNode[]>()
      for (const child of children) {
        const existing = byType.get(child.type)
        if (existing) {
          existing.push(child)
        } else {
          byType.set(child.type, [child])
        }
      }

      // Check each group of 2+ same-type children
      for (const [type, group] of byType) {
        if (group.length < 2) continue

        // Fire if ALL children in the group lack a key prop
        const allLackKey = group.every(
          child => !child.props || child.props['key'] === undefined || child.props['key'] === null,
        )

        if (allLackKey) {
          return {
            triggered: true,
            issue: {
              rule: 'missing-key-prop',
              severity: 'warning',
              message: `${group.length} "${type}" children in "${node.id}" have no key prop — add unique keys to help React reconcile the list efficiently`,
              nodeId: node.id,
            },
          }
        }
      }

      return { triggered: false }
    },
  }
}
