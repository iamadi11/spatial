import type { Rule } from '../rule-registry'

const DEFAULT_THRESHOLD = 5

/**
 * Rule: boolean-prop-overload
 * SOT Section 4.2.2, 7, 12
 *
 * Flags components whose props contain more boolean values than the threshold.
 * "Do-it-all" components accumulate boolean toggle flags over time — each flag
 * is a distinct re-render trigger when parent state changes.
 *
 * Only top-level props are inspected (no nested objects).
 * Metrics are not used (structural check only).
 * Pure function — no side effects, no DOM, no randomness.
 */
export function createBooleanPropOverloadRule(threshold: number = DEFAULT_THRESHOLD): Rule {
  return {
    name: 'boolean-prop-overload',
    detect: (node, _metrics) => {
      const props = node.props
      if (!props) return { triggered: false }

      let booleanCount = 0
      for (const key of Object.keys(props)) {
        if (typeof props[key] === 'boolean') {
          booleanCount++
        }
      }

      if (booleanCount > threshold) {
        return {
          triggered: true,
          issue: {
            rule: 'boolean-prop-overload',
            severity: 'warning',
            message: `Component has ${booleanCount} boolean props (threshold: ${threshold}) — consider splitting into focused components`,
            nodeId: node.id,
          },
        }
      }

      return { triggered: false }
    },
  }
}
