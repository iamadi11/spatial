import type { Rule, RuleResult } from '../rule-registry'
import type { ComponentNode, PerformanceMetrics } from '../types'

/**
 * Default number of non-event function props allowed before firing.
 * Props whose keys start with 'on' are excluded (handled by event-handler-count).
 */
const RENDER_PROP_THRESHOLD = 3

/**
 * Rule: render-prop-overload
 * SOT Section 12, 7
 *
 * Flags component nodes where the count of non-event-handler function props
 * exceeds the threshold (default: 3). A "non-event function prop" is any prop
 * whose value is a function AND whose key does NOT start with 'on'.
 *
 * Examples of render props: renderHeader, getLabel, formatRow, transformData
 * Examples of event handlers (excluded): onClick, onChange, onFocus, onBlur
 *
 * Why this matters: Components with many render props are doing too many
 * things (responsibility creep). Each function prop creates a new reference
 * on every parent render, defeating memoization even when React.memo or
 * useMemo is applied to the child.
 *
 * Detection logic (O(1) per node):
 *   - Iterate over props entries
 *   - Count entries where `typeof value === 'function'` AND `!key.startsWith('on')`
 *   - Fire when count > threshold
 *
 * Node-level rule. O(1) per node (single pass over props). Pure function.
 */
export function createRenderPropOverloadRule(): Rule {
  return {
    name: 'render-prop-overload',
    detect: (node: ComponentNode, _metrics: PerformanceMetrics): RuleResult => {
      const props = node.props
      if (!props) return { triggered: false }

      let nonEventFnCount = 0
      for (const [key, value] of Object.entries(props)) {
        if (typeof value === 'function' && !key.startsWith('on')) {
          nonEventFnCount++
        }
      }

      if (nonEventFnCount > RENDER_PROP_THRESHOLD) {
        return {
          triggered: true,
          issue: {
            rule: 'render-prop-overload',
            severity: 'warning',
            message: `"${node.type}" (id: "${node.id}") has ${nonEventFnCount} non-event function props — exceeds the recommended limit of ${RENDER_PROP_THRESHOLD}. Consider splitting this component or using a configuration object pattern instead of multiple render props.`,
            nodeId: node.id,
          },
        }
      }

      return { triggered: false }
    },
  }
}
