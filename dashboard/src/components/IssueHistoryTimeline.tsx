/**
 * IssueHistoryTimeline — D20
 * Renders a ring-buffer of past PerformanceResult snapshots as a scrollable table.
 * Each row shows: timestamp, status badge, issue count. Clicking a row expands inline detail.
 */
import { useState, Fragment } from 'react'
import type { PerformanceResult } from '../lib/engine'

export type Snapshot = {
  result: PerformanceResult
  timestamp: number
}

type Props = {
  snapshots: Snapshot[]
}

function StatusBadge({ status }: { status: PerformanceResult['status'] }) {
  const color =
    status === 'pass'
      ? 'bg-emerald-900 text-emerald-300'
      : status === 'fail'
        ? 'bg-red-900 text-red-300'
        : 'bg-gray-800 text-gray-400'
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-mono font-semibold ${color}`}>
      {status}
    </span>
  )
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function IssueHistoryTimeline({ snapshots }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  if (snapshots.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic py-4">No snapshots yet.</p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse" role="table">
        <thead>
          <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wide">
            <th className="text-left py-2 pr-4 font-medium">Time</th>
            <th className="text-left py-2 pr-4 font-medium">Status</th>
            <th className="text-right py-2 pr-4 font-medium">Issues</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {snapshots.map((snap, idx) => {
            const isExpanded = expandedIdx === idx
            return (
              <Fragment key={idx}>
                <tr
                  className={`border-b border-gray-800/50 transition-colors ${isExpanded ? 'bg-gray-900' : 'hover:bg-gray-900/50'}`}
                  role="row"
                >
                  <td className="py-2 pr-4 font-mono text-gray-400 text-xs whitespace-nowrap">
                    {formatTime(snap.timestamp)}
                  </td>
                  <td className="py-2 pr-4">
                    <StatusBadge status={snap.result.status} />
                  </td>
                  <td className="py-2 pr-4 text-right font-mono text-gray-300">
                    {snap.result.issues.length}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      aria-label={`expand snapshot at ${formatTime(snap.timestamp)}`}
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                      className="text-xs text-gray-500 hover:text-gray-200 transition-colors px-2 py-1 rounded"
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr role="row">
                    <td colSpan={4} className="pb-3 pt-1 px-2 bg-gray-900">
                      {snap.result.issues.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No issues detected.</p>
                      ) : (
                        <ul className="space-y-1">
                          {snap.result.issues.map((issue, iIdx) => (
                            <li key={iIdx} className="text-xs font-mono text-gray-300">
                              <span className="text-indigo-400 mr-2">[{issue.rule}]</span>
                              {issue.message}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
