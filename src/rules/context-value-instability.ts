import type { Rule, RuleResult } from '../rule-registry'
import type { ComponentNode, PerformanceMetrics } from '../types'

/**
 * Rule: context-value-instability
 * SOT Section 12, 7
 *
 * Flags React Context.Provider nodes whose `value` prop is a non-primitive
 * (object, array, or function). Non-primitive values create a new reference on
 * every parent render, causing ALL context consumers to re-render even when the
 * underlying data is unchanged.
 *
 * Detection logic (O(1) per node):
 *   - Check if node.type ends with `.Provider` (covers `Foo.Provider`,
 *     `Context.Provider`, `ReactContext.Provider`, etc.)
 *   - If `props.value` is present and `typeof value` is `'object'` (non-null)
 *     or `'function'` → fire warning
 *   - Primitives (string, number, boolean, null, undefined) are stable → skip
 *
 * Node-level rule. O(1). Pure function, no DOM, deterministic.
 */
export function createContextValueInstabilityRule(): Rule {
  return {
    name: 'context-value-instability',
    detect: (node: ComponentNode, _metrics: PerformanceMetrics): RuleResult => {
      // Only inspect nodes whose type ends with '.Provider'
      if (!node.type.endsWith('.Provider')) {
        return { triggered: false }
      }

      // No props at all — no value prop → safe
      if (!node.props || !('value' in node.props)) {
        return { triggered: false }
      }

      const value = node.props['value']

      // null is typeof 'object' but is a primitive — explicitly skip
      if (value === null || value === undefined) {
        return { triggered: false }
      }

      const kind = typeof value
      if (kind !== 'object' && kind !== 'function') {
        return { triggered: false }
      }

      return {
        triggered: true,
        issue: {
          rule: 'context-value-instability',
          severity: 'warning',
          message: `Provider "${node.id}" passes a ${Array.isArray(value) ? 'array' : kind} as context value — a new reference is created on every render, causing all consumers to re-render. Wrap with useMemo or useState.`,
          nodeId: node.id,
        },
      }
    },
  }
}
