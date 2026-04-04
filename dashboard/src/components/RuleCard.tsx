import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { RuleMetadata } from '../lib/engine'

type Props = {
  rule: RuleMetadata
}

const SEVERITY_EXPLANATION: Record<string, string> = {
  warning: 'warning = investigate — this pattern may degrade performance',
  error: 'error = critical — this pattern is likely causing performance issues',
}

export function RuleCard({ rule }: Props) {
  const [expanded, setExpanded] = useState(false)

  const severityClass =
    rule.severity === 'error'
      ? 'bg-red-900 text-red-300'
      : 'bg-yellow-900 text-yellow-300'

  return (
    <article
      className="rounded-lg border border-gray-800 bg-gray-900 p-4 space-y-2"
      aria-label={`Rule: ${rule.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm font-semibold text-gray-100">{rule.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${severityClass}`}
          aria-label={`Severity: ${rule.severity}`}
        >
          {rule.severity}
        </span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{rule.description}</p>
      {rule.defaultThreshold > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Threshold:</span>
          <span className="font-mono text-gray-300">{rule.defaultThreshold}</span>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Hide details' : 'Show details'}
        className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 focus:outline-none focus:underline"
      >
        {expanded ? 'Hide details' : 'Show details'}
      </button>

      {/* Expandable detail panel */}
      {expanded && (
        <div className="border-t border-gray-800 pt-2 space-y-2">
          <p className="text-xs text-gray-500 italic">
            {SEVERITY_EXPLANATION[rule.severity] ?? `severity: ${rule.severity}`}
          </p>
          <Link
            to="/analyze"
            aria-label="Try in Playground"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            Try in Playground →
          </Link>
        </div>
      )}
    </article>
  )
}
