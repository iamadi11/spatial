import type { PerformanceResult } from '../lib/engine'

type Props = {
  result: PerformanceResult
}

const STATUS_STYLES: Record<string, string> = {
  pass: 'bg-emerald-900 text-emerald-300',
  fail: 'bg-red-900 text-red-300',
  unknown: 'bg-gray-800 text-gray-400',
}

export function AnalysisResult({ result }: Props) {
  const statusClass = STATUS_STYLES[result.status] ?? STATUS_STYLES['unknown']

  return (
    <section aria-label="Analysis result" className="space-y-4">
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass}`}>
          {result.status}
        </span>
        {result.status === 'fail' && (
          <span className="text-xs text-gray-400">
            {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} found
          </span>
        )}
        {'reason' in result && typeof result.reason === 'string' && (
          <span className="text-xs text-gray-500">{result.reason}</span>
        )}
      </div>

      {result.issues.length > 0 && (
        <ul className="space-y-2" aria-label="Issues">
          {result.issues.map((issue, i) => (
            <li
              key={i}
              className="rounded border border-gray-800 bg-gray-900 px-3 py-2 space-y-0.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-semibold ${
                    issue.severity === 'error' ? 'text-red-400' : 'text-yellow-400'
                  }`}
                >
                  {issue.rule}
                </span>
                <span className="text-xs text-gray-500">node: {issue.nodeId}</span>
              </div>
              <p className="text-xs text-gray-300">{issue.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
