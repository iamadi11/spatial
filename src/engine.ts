import type { ComponentNode, PerformanceMetrics, PerformanceResult } from './types'
import type { Registry } from './rule-registry'
import { collectNodes } from './traversal'

/**
 * Validates that provided metrics are structurally valid.
 * SOT 2.3: if cannot compute reliably → return UNKNOWN.
 */
function isValidMetrics(metrics: PerformanceMetrics): boolean {
  return (
    metrics.renderCount >= 0 &&
    metrics.layoutShifts >= 0 &&
    metrics.fpsDrop >= 0 &&
    metrics.memoryUsage >= 0
  )
}

/**
 * Core analysis function.
 * Walks the component tree, runs all registered rules against each node,
 * aggregates issues, and returns a deterministic PerformanceResult.
 *
 * SOT Section 4 Step 4 — metrics pipeline + anomaly detection.
 * SOT Section 5.2 — output contract.
 * SOT Section 6.2 — all computations based on provided data only.
 */
export function analyze(
  root: ComponentNode,
  metrics: PerformanceMetrics,
  registry: Registry,
): PerformanceResult {
  // SOT 2.3 / 6.1: invalid metrics → UNKNOWN
  if (!isValidMetrics(metrics)) {
    return {
      status: 'unknown',
      metrics,
      issues: [],
      reason: 'metrics contain invalid values (negative numbers not allowed)',
    }
  }

  const nodes = collectNodes(root)
  const allIssues = nodes.flatMap((node) => registry.runAll(node, metrics))

  return {
    status: allIssues.length > 0 ? 'fail' : 'pass',
    metrics,
    issues: allIssues,
  }
}
