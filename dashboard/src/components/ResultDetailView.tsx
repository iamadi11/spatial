import { useState } from 'react'
import type { PerformanceResult, PerformanceMetrics } from '../lib/engine'
import { IssueCard } from './IssueCard'
import { SeverityFilter } from './SeverityFilter'

type Severity = 'all' | 'error' | 'warning'

type Props = {
  result: PerformanceResult
}

const STATUS_STYLES: Record<string, { banner: string; label: string }> = {
  pass: { banner: 'border-emerald-800 bg-emerald-950', label: 'text-emerald-300' },
  fail: { banner: 'border-red-800 bg-red-950', label: 'text-red-300' },
  unknown: { banner: 'border-gray-700 bg-gray-900', label: 'text-gray-400' },
}

type MetricRow = {
  key: keyof PerformanceMetrics
  label: string
  unit: string
}

const METRIC_ROWS: MetricRow[] = [
  { key: 'renderCount', label: 'renderCount', unit: '' },
  { key: 'layoutShifts', label: 'layoutShifts', unit: '' },
  { key: 'fpsDrop', label: 'fpsDrop', unit: ' fps' },
  { key: 'memoryUsage', label: 'memoryUsage', unit: ' MB' },
]

export function ResultDetailView({ result }: Props) {
  const [filter, setFilter] = useState<Severity>('all')
  const style = STATUS_STYLES[result.status] ?? STATUS_STYLES['unknown']

  const hasIssues = result.issues.length > 0
  const filteredIssues =
    filter === 'all' ? result.issues : result.issues.filter((i) => i.severity === filter)

  const counts = {
    all: result.issues.length,
    error: result.issues.filter((i) => i.severity === 'error').length,
    warning: result.issues.filter((i) => i.severity === 'warning').length,
  }

  return (
    <section className="space-y-4" aria-label="Result detail">
      {/* Status banner */}
      <div className={`rounded-lg border p-4 ${style.banner}`}>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold uppercase ${style.label}`}>{result.status}</span>
          {result.status === 'fail' && (
            <span className="text-sm text-gray-400">
              — {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {'reason' in result && typeof result.reason === 'string' && (
          <p className="mt-1 text-xs text-gray-400">{result.reason}</p>
        )}
      </div>

      {/* Metrics table */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Metrics</h3>
        <table className="w-full text-xs" aria-label="Performance metrics">
          <tbody>
            {METRIC_ROWS.map(({ key, label, unit }) => (
              <tr key={key} className="border-b border-gray-800">
                <td className="py-1.5 pr-4 font-mono text-gray-400">{label}</td>
                <td className="py-1.5 text-right font-mono text-gray-200">
                  {result.metrics[key]}{unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue list with filter */}
      {hasIssues && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {filteredIssues.length} of {result.issues.length} issues
            </h3>
            <SeverityFilter active={filter} onChange={setFilter} counts={counts} />
          </div>
          <ul className="space-y-2" aria-label="Issue list">
            {filteredIssues.map((issue, i) => (
              <li key={i}>
                <IssueCard issue={issue} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
