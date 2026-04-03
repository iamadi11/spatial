/**
 * Structured metadata describing a single built-in detection rule.
 * SOT Section 5.2 — output contract; Section 7 — rule development template.
 */
export type RuleMetadata = {
  name: string
  description: string
  severity: 'warning' | 'error'
  /** Present for threshold-based rules. Absent for set-based rules (e.g. style-complexity). */
  defaultThreshold?: number
}

/**
 * Returns metadata for every built-in rule in the spatial engine.
 * Pure function — same output every call, no computation, no side effects.
 * SOT Section 5.2: engine must be able to describe its output contract.
 */
export function createRuleCatalog(): RuleMetadata[] {
  return [
    {
      name: 'render-count',
      description: 'Flags components that re-render more times than the threshold per analysis window.',
      severity: 'warning',
      defaultThreshold: 5,
    },
    {
      name: 'layout-shift',
      description: 'Flags components that cause more layout shifts than the threshold, indicating layout instability.',
      severity: 'warning',
      defaultThreshold: 3,
    },
    {
      name: 'fps-drop',
      description: 'Flags components associated with a frame rate drop exceeding the threshold. Never assumes a baseline FPS.',
      severity: 'error',
      defaultThreshold: 10,
    },
    {
      name: 'memory-usage',
      description: 'Flags components associated with memory usage (MB) above the threshold.',
      severity: 'error',
      defaultThreshold: 100,
    },
    {
      name: 'child-count',
      description: 'Flags components with more direct children than the threshold — a signal of unvirtualized lists or overly wide trees.',
      severity: 'warning',
      defaultThreshold: 20,
    },
    {
      name: 'prop-count',
      description: 'Flags components with more props than the threshold — excessive props increase re-render surface area.',
      severity: 'warning',
      defaultThreshold: 15,
    },
    {
      name: 'style-complexity',
      description: 'Flags components using GPU-compositing expensive CSS properties: boxShadow, filter, backdropFilter, transform, clipPath, animation, transition, willChange.',
      severity: 'warning',
      // No defaultThreshold — detection is based on a fixed set of property names, not a count.
    },
    {
      name: 'inline-style-count',
      description: 'Flags components with more inline style declarations than the threshold — excessive inline styles incur per-render parsing overhead.',
      severity: 'warning',
      defaultThreshold: 15,
    },
    {
      name: 'nesting-depth',
      description: 'Flags component trees whose maximum nesting depth exceeds the threshold. Operates at the tree level in a single O(n) pass.',
      severity: 'warning',
      defaultThreshold: 10,
    },
    {
      name: 'total-node-count',
      description: 'Flags component trees whose total node count exceeds the threshold — catches large trees that are neither too wide nor too deep individually.',
      severity: 'warning',
      defaultThreshold: 200,
    },
  ]
}
