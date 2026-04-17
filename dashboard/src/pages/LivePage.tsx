/**
 * LivePage — D20
 * Polls window.__SPATIAL__ every 500ms, maintains a ring buffer of the last
 * 50 snapshots, and renders them in IssueHistoryTimeline.
 *
 * window.__SPATIAL__ is read exclusively here (via the lib layer guard in lib/engine.ts).
 * No detection logic lives here — only display.
 */
import { useState, useEffect, useRef } from 'react'
import type { PerformanceResult } from '../lib/engine'
import { IssueHistoryTimeline } from '../components/IssueHistoryTimeline'
import { IssueGroupedList } from '../components/IssueGroupedList'
import type { Snapshot } from '../components/IssueHistoryTimeline'

const POLL_INTERVAL_MS = 500
const RING_BUFFER_MAX = 50

type SpatialGlobal = {
  __SPATIAL__?: { result: PerformanceResult; timestamp: number }
}

function readSpatialBridge(): { result: PerformanceResult; timestamp: number } | null {
  return (globalThis as SpatialGlobal).__SPATIAL__ ?? null
}

export function LivePage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const lastTimestampRef = useRef<number | null>(null)

  useEffect(() => {
    function poll() {
      const data = readSpatialBridge()
      if (!data) return
      if (data.timestamp === lastTimestampRef.current) return // same data — skip

      lastTimestampRef.current = data.timestamp
      setSnapshots(prev => {
        const next = [{ result: data.result, timestamp: data.timestamp }, ...prev]
        return next.slice(0, RING_BUFFER_MAX)
      })
    }

    const id = setInterval(poll, POLL_INTERVAL_MS)
    poll() // run immediately on mount
    return () => clearInterval(id)
  }, [])

  const latest = snapshots[0] ?? null

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-100">Live</h1>
        {latest && (
          <span className="text-xs text-gray-500 font-mono">
            last updated: {new Date(latest.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {snapshots.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <p className="text-sm text-gray-400 italic">
            Waiting for data — add{' '}
            <code className="text-indigo-400">&lt;SpatialProvider&gt;</code> to your React app and open
            it in another tab.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Current status banner */}
          <div
            className={`rounded-lg border px-4 py-3 ${
              latest?.result.status === 'pass'
                ? 'border-emerald-800 bg-emerald-950'
                : latest?.result.status === 'fail'
                  ? 'border-red-800 bg-red-950'
                  : 'border-gray-800 bg-gray-900'
            }`}
          >
            <p className="text-sm font-medium text-gray-200">
              Current status:{' '}
              <span
                className={`font-mono font-semibold ${
                  latest?.result.status === 'pass'
                    ? 'text-emerald-400'
                    : latest?.result.status === 'fail'
                      ? 'text-red-400'
                      : 'text-gray-400'
                }`}
              >
                {latest?.result.status}
              </span>
              {latest && latest.result.issues.length > 0 && (
                <span className="text-gray-400 ml-2">— {latest.result.issues.length} issue(s)</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Current issues grouped by rule */}
      {latest && latest.result.issues.length > 0 && (
        <section aria-label="Current issues by rule" role="region">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Current issues
          </h2>
          <IssueGroupedList issues={latest.result.issues} />
        </section>
      )}

      {/* History timeline */}
      <section aria-label="Issue history" role="region">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          History ({snapshots.length} / {RING_BUFFER_MAX})
        </h2>
        <IssueHistoryTimeline snapshots={snapshots} />
      </section>
    </main>
  )
}
