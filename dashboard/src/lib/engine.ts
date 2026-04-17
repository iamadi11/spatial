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
import { createEventHandlerCountRule } from '@engine/rules/event-handler-count'
import { createDuplicateComponentTypeRule } from '@engine/rules/duplicate-component-type'
import { createLargeDataPropRule } from '@engine/rules/large-data-prop'
import { createUnvirtualizedListRule } from '@engine/rules/unvirtualized-list'
import { createAnonymousComponentRule } from '@engine/rules/anonymous-component'
import { createBooleanPropOverloadRule } from '@engine/rules/boolean-prop-overload'
import { createSingleChildChainRule } from '@engine/rules/single-child-chain'
import { createMemoCandidateRule } from '@engine/rules/memo-candidate'
import { createMultiTypeSiblingFanoutRule } from '@engine/rules/multi-type-sibling-fanout'
import { createClassnameTokenSprawlRule } from '@engine/rules/classname-token-sprawl'
import { createPropDrillingDepthRule } from '@engine/rules/prop-drilling-depth'
import { createMissingKeyPropRule } from '@engine/rules/missing-key-prop'
import { createFragmentSingleChildRule } from '@engine/rules/fragment-single-child'

// Re-export engine types for components to use
export type { ComponentNode, PerformanceResult, PerformanceIssue, PerformanceMetrics } from '@engine/types'

/**
 * Formats a PerformanceResult as a human-readable text block.
 * Re-exports the engine's formatReport — components must not import from @engine directly.
 */
export function formatReport(result: PerformanceResult): string {
  return _formatReport(result)
}

/**
 * Pretty-prints a PerformanceResult as JSON for copy/download (D18).
 * Pure — deterministic for the same result object.
 */
export function formatPerformanceResultJson(result: PerformanceResult): string {
  return JSON.stringify(result, null, 2)
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
  eventHandlerCountThreshold?: number
  largeDataPropThreshold?: number
  unvirtualizedListThreshold?: number
  duplicateComponentTypeThreshold?: number
  /** Minimum direct children for multi-type-sibling-fanout (default 10). */
  multiTypeSiblingFanoutMinChildren?: number
  /** Minimum distinct child types for multi-type-sibling-fanout (default 6). */
  multiTypeSiblingFanoutMinDistinctTypes?: number
  /** Max whitespace-separated tokens in `className` string before classname-token-sprawl triggers (default 30). */
  classnameTokenSprawlMaxTokens?: number
  /** Max trimmed character length of `className` before classname-token-sprawl triggers (default 400). */
  classnameTokenSprawlMaxLength?: number
  /** Max consecutive levels a prop key may be drilled before prop-drilling-depth fires (default 3). */
  propDrillingDepthThreshold?: number
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
    name: 'classname-token-sprawl',
    description:
      'Flags oversized string `className` props — many utility tokens or very long class strings increase parse cost. Non-string className values are ignored.',
    severity: 'warning',
    defaultThreshold: 30,
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
  {
    name: 'event-handler-count',
    description: 'Flags nodes with too many event handler props — each handler is a new re-render trigger.',
    severity: 'warning',
    defaultThreshold: 5,
  },
  {
    name: 'duplicate-component-type',
    description: 'Flags trees where a single component type appears too many times — indicates unvirtualized lists.',
    severity: 'warning',
    defaultThreshold: 30,
  },
  {
    name: 'large-data-prop',
    description: 'Flags components with oversized prop payloads — large props increase serialization and diffing cost.',
    severity: 'warning',
    defaultThreshold: 10000,
  },
  {
    name: 'unvirtualized-list',
    description: 'Flags nodes with many same-type children — should use a virtualizer like react-window.',
    severity: 'warning',
    defaultThreshold: 50,
  },
  {
    name: 'anonymous-component',
    description: 'Flags components with empty or generic type names — prevents meaningful profiling and debugging.',
    severity: 'warning',
    defaultThreshold: 0,
  },
  {
    name: 'boolean-prop-overload',
    description: 'Flags components with too many boolean props — indicates a component doing too many things.',
    severity: 'warning',
    defaultThreshold: 5,
  },
  {
    name: 'single-child-chain',
    description: 'Flags long chains of single-child wrapper components — wrapper hell that bloats reconciliation.',
    severity: 'warning',
    defaultThreshold: 4,
  },
  {
    name: 'memo-candidate',
    description: 'Flags components with high render counts and many children — strong candidate for React.memo.',
    severity: 'warning',
    defaultThreshold: 3,
  },
  {
    name: 'multi-type-sibling-fanout',
    description:
      'Flags parents with many direct children of many different component types — kitchen-sink renders. Requires ≥10 children and ≥6 distinct types by default.',
    severity: 'warning',
    defaultThreshold: 10,
  },
  {
    name: 'prop-drilling-depth',
    description: 'Flags props drilled through more than N consecutive component levels — signals tight coupling that should use context or co-location.',
    severity: 'warning',
    defaultThreshold: 3,
  },
  {
    name: 'missing-key-prop',
    description: 'Flags parent nodes with 2+ same-type children that all lack key props — causes unnecessary reconciliation on list updates.',
    severity: 'warning',
    defaultThreshold: 0,
  },
  {
    name: 'fragment-single-child',
    description: 'Flags Fragment nodes wrapping exactly one child — the Fragment adds a reconciliation node without grouping benefit.',
    severity: 'warning',
    defaultThreshold: 0,
  },
]

/**
 * Returns metadata for all registered node- and tree-level rules exposed by this adapter.
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
  registry.register(
    createClassnameTokenSprawlRule({
      maxTokens: options.classnameTokenSprawlMaxTokens,
      maxLength: options.classnameTokenSprawlMaxLength,
    }),
  )
  registry.register(createStyleComplexityRule())
  registry.register(createEventHandlerCountRule(options.eventHandlerCountThreshold))
  registry.register(createLargeDataPropRule(options.largeDataPropThreshold))
  registry.register(createUnvirtualizedListRule(options.unvirtualizedListThreshold))
  registry.register(createAnonymousComponentRule())
  registry.register(createBooleanPropOverloadRule())
  registry.register(createMemoCandidateRule())
  registry.register(createMissingKeyPropRule())
  registry.register(createFragmentSingleChildRule())
  registry.register(
    createMultiTypeSiblingFanoutRule({
      minDirectChildren: options.multiTypeSiblingFanoutMinChildren,
      minDistinctTypes: options.multiTypeSiblingFanoutMinDistinctTypes,
    }),
  )

  const baseResult = analyze(root, metrics, registry)

  // Tree-level rules run against the root directly
  const treeIssues: PerformanceIssue[] = []
  const nestingIssue = createNestingDepthRule(options.nestingDepthThreshold).check(root)
  if (nestingIssue !== null) treeIssues.push(nestingIssue)

  const nodeCountIssue = createTotalNodeCountRule(options.totalNodeCountThreshold).check(root)
  if (nodeCountIssue !== null) treeIssues.push(nodeCountIssue)

  const duplicateTypeIssue = createDuplicateComponentTypeRule(options.duplicateComponentTypeThreshold).check(root)
  if (duplicateTypeIssue !== null) treeIssues.push(duplicateTypeIssue)

  const singleChildChainIssue = createSingleChildChainRule().check(root)
  if (singleChildChainIssue !== null) treeIssues.push(singleChildChainIssue)

  const propDrillingIssue = createPropDrillingDepthRule(options.propDrillingDepthThreshold).check(root)
  if (propDrillingIssue !== null) treeIssues.push(propDrillingIssue)

  if (treeIssues.length === 0) return baseResult

  const allIssues = [...baseResult.issues, ...treeIssues]
  return {
    ...baseResult,
    status: baseResult.status === 'unknown' ? 'unknown' : 'fail',
    issues: allIssues,
  }
}
