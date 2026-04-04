import type { Rule } from '../rule-registry'

const DEFAULT_RENDER_THRESHOLD = 3
const DEFAULT_CHILDREN_THRESHOLD = 3

/**
 * Rule: memo-candidate
 * SOT Section 4.2.2, 6.3, 7
 *
 * Flags nodes that are strong React.memo candidates: they re-render frequently
 * AND have a non-trivial number of direct children, meaning each re-render
 * cascades down to all children unnecessarily.
 *
 * Both conditions must be true simultaneously:
 *   - metrics.renderCount > renderCountThreshold
 *   - node.children.length > childrenThreshold
 *
 * Pure function — no DOM, no side effects, no randomness.
 */
export function createMemoCandidateRule(
  renderCountThreshold: number = DEFAULT_RENDER_THRESHOLD,
  childrenThreshold: number = DEFAULT_CHILDREN_THRESHOLD,
): Rule {
  return {
    name: 'memo-candidate',
    detect: (node, metrics) => {
      const childCount = node.children?.length ?? 0
      const renderCount = metrics.renderCount

      if (renderCount > renderCountThreshold && childCount > childrenThreshold) {
        return {
          triggered: true,
          issue: {
            rule: 'memo-candidate',
            severity: 'warning',
            message: `Component re-renders ${renderCount} times and has ${childCount} direct children — consider wrapping with React.memo`,
            nodeId: node.id,
          },
        }
      }

      return { triggered: false }
    },
  }
}
