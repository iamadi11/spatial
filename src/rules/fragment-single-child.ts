import type { Rule, RuleResult } from '../rule-registry'
import type { ComponentNode, PerformanceMetrics } from '../types'

const FRAGMENT_TYPES = new Set(['Fragment', 'React.Fragment'])

/**
 * Rule: fragment-single-child
 * SOT Section 12, 7
 *
 * Flags React Fragment nodes (`<>...</>` or `<React.Fragment>`) that wrap
 * exactly one child. A single-child Fragment provides no structural benefit —
 * it adds a reconciliation node without grouping anything.
 *
 * Detection logic (O(1) per node):
 *   - Check if node.type is 'Fragment' or 'React.Fragment'
 *   - Check if it has exactly 1 child
 *   - If both: fire warning
 *
 * Valid Fragment uses that are NOT flagged:
 *   - 0 children (empty Fragment — sometimes valid as a placeholder)
 *   - 2+ children (the intended use case — group multiple siblings)
 *
 * Node-level rule. O(1) per node. Pure function, no DOM, deterministic.
 */
export function createFragmentSingleChildRule(): Rule {
  return {
    name: 'fragment-single-child',
    detect: (node: ComponentNode, _metrics: PerformanceMetrics): RuleResult => {
      if (!FRAGMENT_TYPES.has(node.type)) {
        return { triggered: false }
      }

      const childCount = node.children?.length ?? 0
      if (childCount !== 1) {
        return { triggered: false }
      }

      return {
        triggered: true,
        issue: {
          rule: 'fragment-single-child',
          severity: 'warning',
          message: `Fragment "${node.id}" wraps only 1 child — remove the Fragment and render the child directly`,
          nodeId: node.id,
        },
      }
    },
  }
}
