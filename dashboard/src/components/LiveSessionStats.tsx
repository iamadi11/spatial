/**
 * LiveSessionStats — D25
 * Compact stats panel above IssueHistoryTimeline on the /live page.
 * Pure component — accepts snapshots prop, computes all stats inline.
 * Shows: total count, pass/fail/unknown breakdown, top-3 rules by fire frequency.
 */
import type { Snapshot } from './IssueHistoryTimeline'

type Props = {
  snapshots: Snapshot[]
}

type RuleFreq = { rule: string; count: number }

function computeTopRules(snapshots: Snapshot[], limit = 3): RuleFreq[] {
  const freq = new Map<string, number>()
  for (const snap of snapshots) {
    for (const issue of snap.result.issues) {
      freq.set(issue.rule, (freq.get(issue.rule) ?? 0) + 1)
    }
  }
  return Array.from(freq.entries())
    .map(([rule, count]) => ({ rule, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function LiveSessionStats({ snapshots }: Props) {
  if (snapshots.length === 0) {
    return (
      <section aria-label="Session stats" role="region" className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
        <p className="text-xs text-gray-500 italic">No snapshots yet — waiting for live data.</p>
      </section>
    )
  }

  const total = snapshots.length
  const passCount = snapshots.filter(s => s.result.status === 'pass').length
  const failCount = snapshots.filter(s => s.result.status === 'fail').length
  const unknownCount = snapshots.filter(s => s.result.status === 'unknown').length
  const topRules = computeTopRules(snapshots)

  return (
    <section aria-label="Session stats" role="region" className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 space-y-3">
      {/* Counts row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Snapshots</span>
          <span className="text-sm font-mono font-semibold text-gray-100">{total}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span
            className="text-sm font-mono font-semibold text-emerald-400"
            aria-label="Pass count"
          >
            {passCount}
          </span>
          <span className="text-xs text-gray-500">pass</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
          <span
            className="text-sm font-mono font-semibold text-red-400"
            aria-label="Fail count"
          >
            {failCount}
          </span>
          <span className="text-xs text-gray-500">fail</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gray-500" aria-hidden="true" />
          <span
            className="text-sm font-mono font-semibold text-gray-400"
            aria-label="Unknown count"
          >
            {unknownCount}
          </span>
          <span className="text-xs text-gray-500">unknown</span>
        </div>
      </div>

      {/* Top rules */}
      {topRules.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Top rules:</span>
          {topRules.map(({ rule, count }) => (
            <span
              key={rule}
              aria-label="Top rule"
              className="inline-flex items-center gap-1 rounded-full bg-indigo-900/50 border border-indigo-800 px-2 py-0.5"
            >
              <span className="text-xs font-mono text-indigo-300">{rule}</span>
              <span className="text-xs text-indigo-400 font-semibold">{count}×</span>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
