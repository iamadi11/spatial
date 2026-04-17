/**
 * LiveHealthScore — D27
 * Displays a pass-ratio health score above LiveSessionStats on /live.
 * Pure component — accepts snapshots prop, returns null when empty.
 * Color-coded: green ≥ 80%, yellow 50–79%, red < 50%.
 */
import type { Snapshot } from './IssueHistoryTimeline'

type Props = {
  snapshots: Snapshot[]
}

function getScoreColor(pct: number): { bar: string; label: string } {
  if (pct >= 80) return { bar: 'bg-emerald-500', label: 'text-emerald-400' }
  if (pct >= 50) return { bar: 'bg-yellow-500', label: 'text-yellow-400' }
  return { bar: 'bg-red-500', label: 'text-red-400' }
}

export function LiveHealthScore({ snapshots }: Props) {
  if (snapshots.length === 0) return null

  const passCount = snapshots.filter(s => s.result.status === 'pass').length
  const pct = Math.round((passCount / snapshots.length) * 100)
  const { bar, label } = getScoreColor(pct)

  return (
    <section
      aria-label="Health score"
      role="region"
      className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Session health</span>
        <span className={`text-lg font-mono font-bold ${label}`} aria-label={`${pct}% healthy`}>
          {pct}%
        </span>
      </div>
      {/* Progress bar */}
      <div
        className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Health bar"
      >
        <div
          className={`h-full rounded-full transition-all ${bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">
        {passCount} of {snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''} passed
      </p>
    </section>
  )
}
