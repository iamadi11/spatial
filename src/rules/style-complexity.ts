import type { Rule } from '../rule-registry'

/**
 * CSS properties that are GPU-compositing expensive and can trigger layout or paint cycles.
 * SOT Section 4.2.3 — "dynamic CSS" as a risk case.
 * Static set — deterministic, no DOM, no external lookup.
 */
const EXPENSIVE_PROPERTIES = new Set([
  'boxShadow',
  'filter',
  'backdropFilter',
  'transform',
  'clipPath',
  // [019] Expanded for improved measurement accuracy — SOT Section 12
  'animation',
  'transition',
  'willChange',
])

/**
 * Rule: style-complexity
 * SOT Section 4.2.3 — flags components using known expensive CSS properties.
 * Pure function — key-match only, does not evaluate CSS values.
 */
export function createStyleComplexityRule(): Rule {
  return {
    name: 'style-complexity',
    detect: (node, _metrics) => {
      const styleKeys = Object.keys(node.styles ?? {})
      const expensiveFound = styleKeys.filter((k) => EXPENSIVE_PROPERTIES.has(k))
      if (expensiveFound.length > 0) {
        return {
          triggered: true,
          issue: {
            rule: 'style-complexity',
            severity: 'warning',
            message: `Component uses expensive CSS properties: ${expensiveFound.join(', ')}`,
            nodeId: node.id,
          },
        }
      }
      return { triggered: false }
    },
  }
}
