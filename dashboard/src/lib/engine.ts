/**
 * Engine adapter layer — D02
 * Isolates all spatial engine calls. Components must import from here, never from @engine directly.
 */
import type { ComponentNode, PerformanceMetrics, PerformanceResult, PerformanceIssue } from '@engine/types'
import { analyze } from '@engine/engine'
import { formatReport as _formatReport } from '@engine/report-summary'
import { createRegistry } from '@engine/rule-registry'
import { createChildCountRule } from '@engine/rules/child-count'
import { createFpsDropRule } from '@engine/rules/fps-drop'
import { createInlineStyleCountRule } from '@engine/rules/inline-style-count'
import { createLayoutShiftRule } from '@engine/rules/layout-shift'
import { createMemoryUsageRule } from '@engine/rules/memory-usage'
import { createNestingDepthRule } from '@engine/rules/nesting-depth'
import { createPropCountRule } from '@engine/rules/prop-count'
import { createRenderCountRule } from '@engine/rules/render-count'
import { createStyleComplexityRule } from '@engine/rules/style-complexity'
import { createTotalNodeCountRule } from '@engine/rules/total-node-count'

// Re-export engine types for components to use
export type { ComponentNode, PerformanceResult, PerformanceIssue, PerformanceMetrics } from '@engine/types'

/**
 * Formats a PerformanceResult as a human-readable text block.
 * Re-exports the engine's formatReport — components must not import from @engine directly.
 */
export function formatReport(result: PerformanceResult): string {
  return _formatReport(result)
}

export type RuleMetadata = {
  name: string
  description: string
  severity: 'warning' | 'error'
  defaultThreshold: number
}

export type RuleOptions = {
  renderCountThreshold?: number
  layoutShiftThreshold?: number
  fpsDropThreshold?: number
  memoryUsageThreshold?: number
  childCountThreshold?: number
  nestingDepthThreshold?: number
  propCountThreshold?: number
  inlineStyleCountThreshold?: number
  totalNodeCountThreshold?: number
}

const RULE_CATALOG: RuleMetadata[] = [
  {
    name: 'child-count',
    description: 'Flags nodes with too many direct children — may cause long list re-renders without virtualization.',
    severity: 'warning',
    defaultThreshold: 20,
  },
  {
    name: 'fps-drop',
    description: 'Flags when measured FPS drop exceeds threshold — indicates rendering jank.',
    severity: 'error',
    defaultThreshold: 10,
  },
  {
    name: 'inline-style-count',
    description: 'Flags nodes with too many inline styles — inline styles bypass CSS optimizations.',
    severity: 'warning',
    defaultThreshold: 15,
  },
  {
    name: 'layout-shift',
    description: 'Flags excessive layout shifts — causes visual instability (CLS).',
    severity: 'warning',
    defaultThreshold: 3,
  },
  {
    name: 'memory-usage',
    description: 'Flags memory usage above threshold — may cause slowdowns or crashes.',
    severity: 'error',
    defaultThreshold: 100,
  },
  {
    name: 'nesting-depth',
    description: 'Flags deeply nested component trees — deep nesting degrades reconciliation performance.',
    severity: 'warning',
    defaultThreshold: 10,
  },
  {
    name: 'prop-count',
    description: 'Flags components with too many props — high prop count increases diffing cost.',
    severity: 'warning',
    defaultThreshold: 15,
  },
  {
    name: 'render-count',
    description: 'Flags components that re-render too many times — indicates missing memoization.',
    severity: 'warning',
    defaultThreshold: 5,
  },
  {
    name: 'style-complexity',
    description: 'Flags use of GPU-expensive CSS properties (transform, filter, animation, etc.).',
    severity: 'warning',
    defaultThreshold: 0,
  },
  {
    name: 'total-node-count',
    description: 'Flags trees with too many total nodes — large trees slow reconciliation.',
    severity: 'warning',
    defaultThreshold: 200,
  },
]

/**
 * Returns metadata for all 10 registered rules.
 * Pure — same output every call.
 */
export function getRuleCatalog(): RuleMetadata[] {
  return RULE_CATALOG
}

/**
 * Runs the spatial engine against the given component tree and metrics.
 * Node-level rules run via the registry; tree-level rules (nesting-depth,
 * total-node-count) run separately against the root and are merged in.
 */
export function runAnalysis(
  root: ComponentNode,
  metrics: PerformanceMetrics,
  options: RuleOptions = {},
): PerformanceResult {
  // Node-level rules use the standard registry
  const registry = createRegistry()
  registry.register(createRenderCountRule(options.renderCountThreshold))
  registry.register(createLayoutShiftRule(options.layoutShiftThreshold))
  registry.register(createFpsDropRule(options.fpsDropThreshold))
  registry.register(createMemoryUsageRule(options.memoryUsageThreshold))
  registry.register(createChildCountRule(options.childCountThreshold))
  registry.register(createPropCountRule(options.propCountThreshold))
  registry.register(createInlineStyleCountRule(options.inlineStyleCountThreshold))
  registry.register(createStyleComplexityRule())

  const baseResult = analyze(root, metrics, registry)

  // Tree-level rules run against the root directly
  const treeIssues: PerformanceIssue[] = []
  const nestingIssue = createNestingDepthRule(options.nestingDepthThreshold).check(root)
  if (nestingIssue !== null) treeIssues.push(nestingIssue)

  const nodeCountIssue = createTotalNodeCountRule(options.totalNodeCountThreshold).check(root)
  if (nodeCountIssue !== null) treeIssues.push(nodeCountIssue)

  if (treeIssues.length === 0) return baseResult

  const allIssues = [...baseResult.issues, ...treeIssues]
  return {
    ...baseResult,
    status: baseResult.status === 'unknown' ? 'unknown' : 'fail',
    issues: allIssues,
  }
}
