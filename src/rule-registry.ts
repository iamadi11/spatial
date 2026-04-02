import type { ComponentNode, PerformanceMetrics, PerformanceIssue } from './types'

export type RuleResult = {
  triggered: boolean
  issue?: PerformanceIssue
}

export type Rule = {
  name: string
  detect: (node: ComponentNode, metrics: PerformanceMetrics) => RuleResult
}

export type Registry = {
  register: (rule: Rule) => void
  runAll: (node: ComponentNode, metrics: PerformanceMetrics) => PerformanceIssue[]
}

/**
 * Creates a new rule registry.
 * Pure factory — each call returns an independent registry instance.
 * SOT Section 7: rules follow name/detect contract.
 */
export function createRegistry(): Registry {
  const rules: Rule[] = []

  function register(rule: Rule): void {
    rules.push(rule)
  }

  function runAll(node: ComponentNode, metrics: PerformanceMetrics): PerformanceIssue[] {
    const issues: PerformanceIssue[] = []
    for (const rule of rules) {
      const result = rule.detect(node, metrics)
      if (result.triggered && result.issue !== undefined) {
        issues.push(result.issue)
      }
    }
    return issues
  }

  return { register, runAll }
}
