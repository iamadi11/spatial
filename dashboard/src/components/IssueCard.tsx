import type { PerformanceIssue } from '../lib/engine'

type Props = {
  issue: PerformanceIssue
}

export function IssueCard({ issue }: Props) {
  const severityClass =
    issue.severity === 'error'
      ? 'bg-red-900 text-red-300'
      : 'bg-yellow-900 text-yellow-300'

  return (
    <article
      className="rounded border border-gray-800 bg-gray-900 px-3 py-2 space-y-1"
      aria-label={`Issue: ${issue.rule}`}
    >
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityClass}`}>
          {issue.severity}
        </span>
        <span className="font-mono text-xs font-semibold text-gray-200">{issue.rule}</span>
      </div>
      <p className="text-xs text-gray-300">{issue.message}</p>
      <p className="text-xs text-gray-500">Node: {issue.nodeId}</p>
    </article>
  )
}
