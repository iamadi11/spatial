import { useMemo } from 'react'
import { runAnalysis } from '../../lib/engine'
import type { ComponentNode, PerformanceMetrics } from '../../lib/engine'
import { PerformanceResultJsonActions } from '../PerformanceResultJsonActions'

type Props = {
  tree: ComponentNode
  metrics: PerformanceMetrics
  label: string
}

export function LiveAnalysisCard({ tree, metrics, label }: Props) {
  const result = useMemo(() => runAnalysis(tree, metrics), [tree, metrics])

  const statusStyles = {
    pass: { banner: 'border-emerald-800 bg-emerald-950', badge: 'bg-emerald-900 text-emerald-300' },
    fail: { banner: 'border-red-800 bg-red-950', badge: 'bg-red-900 text-red-300' },
    unknown: { banner: 'border-gray-700 bg-gray-900', badge: 'bg-gray-800 text-gray-400' },
  }
  const styles = statusStyles[result.status] ?? statusStyles.unknown

  return (
    <section
      className={`rounded-lg border p-3 space-y-2 ${styles.banner}`}
      aria-label={`Engine analysis: ${label}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Engine</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles.badge}`}>
          {result.status}
        </span>
        {result.status === 'fail' && (
          <span className="text-xs text-gray-400">
            {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {result.issues.length > 0 && (
        <ul className="space-y-1.5" aria-label="Detected issues">
          {result.issues.map((issue, i) => (
            <li key={i} className="rounded bg-gray-900/60 px-2 py-1.5 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-xs font-mono font-semibold ${issue.severity === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {issue.rule}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{issue.message}</p>
            </li>
          ))}
        </ul>
      )}

      {result.status === 'pass' && (
        <p className="text-xs text-emerald-400">No issues detected — this pattern is clean.</p>
      )}

      <PerformanceResultJsonActions result={result} />
    </section>
  )
}
