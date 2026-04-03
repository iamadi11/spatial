import type { ComponentNode, PerformanceMetrics } from '../types'
import type { Rule, RuleResult } from '../rule-registry'

/**
 * Estimates the serialised byte size of non-function props and flags
 * nodes where the total payload exceeds the threshold.
 *
 * Function props are excluded (not serialisable).
 * Circular references are handled safely via try/catch (returns 0 bytes).
 *
 * SOT Section 4.2.2 (props analysis), 12 (measurement accuracy)
 */
export function createLargeDataPropRule(thresholdBytes = 10_000): Rule {
  return {
    name: 'large-data-prop',
    detect(node: ComponentNode, _metrics: PerformanceMetrics): RuleResult {
      const props = node.props
      if (!props) return { triggered: false }

      let totalBytes = 0
      for (const key of Object.keys(props)) {
        const val = props[key]
        if (typeof val === 'function') continue
        try {
          totalBytes += JSON.stringify(val)?.length ?? 0
        } catch {
          // circular reference or non-serialisable — skip
        }
      }

      if (totalBytes <= thresholdBytes) return { triggered: false }

      return {
        triggered: true,
        issue: {
          rule: 'large-data-prop',
          severity: 'warning',
          message: `Props serialise to ~${totalBytes} bytes (threshold: ${thresholdBytes} bytes)`,
          nodeId: node.id,
        },
      }
    },
  }
}
