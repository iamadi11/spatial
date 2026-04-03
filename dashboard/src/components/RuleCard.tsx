import type { RuleMetadata } from '../lib/engine'

type Props = {
  rule: RuleMetadata
}

export function RuleCard({ rule }: Props) {
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
    </article>
  )
}
