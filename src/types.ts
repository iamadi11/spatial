/**
 * Input contract — SOT Section 5.1
 * A node in the component tree provided to the performance engine.
 */
export type ComponentNode = {
  id: string
  type: string
  props?: Record<string, unknown>
  children?: ComponentNode[]
  styles?: Record<string, string>
}

/**
 * Measured performance metrics — SOT Section 5.2
 */
export type PerformanceMetrics = {
  renderCount: number
  layoutShifts: number
  fpsDrop: number
  memoryUsage: number
}

/**
 * A single detected performance issue — SOT Section 5.2 / Section 7
 */
export type PerformanceIssue = {
  rule: string
  severity: 'warning' | 'error'
  message: string
  nodeId: string
}

/**
 * Output contract — SOT Section 5.2
 * Deterministic result produced by the engine for a given component tree.
 */
export type PerformanceResult = {
  status: 'pass' | 'fail' | 'unknown'
  metrics: PerformanceMetrics
  issues: PerformanceIssue[]
  reason?: string
}
