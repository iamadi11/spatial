import type { ComponentNode, PerformanceMetrics } from '../types'
import type { Rule, RuleResult } from '../rule-registry'

/**
 * Counts function-valued props (event handlers) on a component node.
 * Excessive event handler bindings create re-render pressure because
 * every parent re-render passes new function references.
 *
 * SOT Section 4.2.2 (props analysis), 7 (rule template)
 */
export function createEventHandlerCountRule(threshold = 5): Rule {
  return {
    name: 'event-handler-count',
    detect(node: ComponentNode, _metrics: PerformanceMetrics): RuleResult {
      const props = node.props
      if (!props) return { triggered: false }

      let count = 0
      for (const key of Object.keys(props)) {
        if (typeof props[key] === 'function') count++
      }

      if (count <= threshold) return { triggered: false }

      return {
        triggered: true,
        issue: {
          rule: 'event-handler-count',
          severity: 'warning',
          message: `Component has ${count} event handlers (threshold: ${threshold})`,
          nodeId: node.id,
        },
      }
    },
  }
}
