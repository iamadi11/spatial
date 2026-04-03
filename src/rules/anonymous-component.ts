import type { Rule } from '../rule-registry'

/**
 * Rule: anonymous-component
 * SOT Section 4.2.2, 7, 12
 *
 * Flags components whose `type` string is empty, equals a known anonymous
 * placeholder ("Anonymous", "Component"), or is ≤ 2 characters — patterns
 * that indicate unnamed or minified component names that cannot be debugged
 * or profiled meaningfully.
 *
 * HTML elements (lowercase type) are never flagged — they are valid and
 * expected.
 *
 * Metrics are not used (structural check only).
 */

const ANONYMOUS_NAMES = new Set(['Anonymous', 'Component'])

export function createAnonymousComponentRule(): Rule {
  return {
    name: 'anonymous-component',
    detect: (node, _metrics) => {
      const type = node.type

      // HTML elements start with a lowercase letter — never flag them
      if (type.length > 0 && type[0] === type[0].toLowerCase() && type[0] !== type[0].toUpperCase()) {
        return { triggered: false }
      }

      // Flag: empty type
      // Flag: known anonymous placeholder names
      // Flag: type with ≤ 2 characters (minified, e.g. "A", "_c", "C0")
      const isAnonymous =
        type === '' ||
        ANONYMOUS_NAMES.has(type) ||
        type.length <= 2

      if (!isAnonymous) {
        return { triggered: false }
      }

      return {
        triggered: true,
        issue: {
          rule: 'anonymous-component',
          severity: 'warning',
          message: `Component type "${type}" appears unnamed or minified — add a displayName for better debuggability`,
          nodeId: node.id,
        },
      }
    },
  }
}
