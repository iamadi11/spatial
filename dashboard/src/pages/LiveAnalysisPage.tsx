/**
 * Live Analysis Page — D07 + D14
 * Polls window.__SPATIAL__ bridge every 500ms and displays the latest PerformanceResult.
 * Shows setup instructions when disconnected.
 * D14: tracks lastUpdatedAt, shows relative "Xs ago" label, pulses on new data.
 *
 * dashboard/SourceOfTruth.md Section 3.4
 */
import { useState, useEffect, useRef } from 'react'
import { ResultDetailView } from '../components/ResultDetailView'
import { readBridge } from '../lib/live'
import type { BridgeData } from '../lib/live'

const SETUP_CODE = `import { createSpatialHandler } from 'spatial/adapters'
const handler = createSpatialHandler()
<React.Profiler id="spatial" onRender={handler}>
  <App />
</React.Profiler>`

function formatSecondsAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  return `${seconds}s ago`
}

export function LiveAnalysisPage() {
  const [bridge, setBridge] = useState<BridgeData>(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const [, setTick] = useState(0) // forces re-render every second for "ago" label
  const [isPulsing, setIsPulsing] = useState(false)
  const lastTimestampRef = useRef<number | null>(null)

  // Poll bridge every 500ms; track when new data arrives
  useEffect(() => {
    const updateBridge = () => {
      const data = readBridge()
      setBridge(data)

      if (data !== null) {
        const isNew = lastTimestampRef.current !== data.timestamp
        if (isNew) {
          lastTimestampRef.current = data.timestamp
          setLastUpdatedAt(new Date())
          setIsPulsing(true)
          setTimeout(() => setIsPulsing(false), 600)
        }
      }
    }

    updateBridge()
    const pollId = setInterval(updateBridge, 500)
    return () => clearInterval(pollId)
  }, [])

  // Update the "Xs ago" label every second
  useEffect(() => {
    const tickId = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(tickId)
  }, [])

  const isConnected = bridge !== null

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-100">Live Analysis</h1>
        <p className="mt-1 text-sm text-gray-400">
          Real-time performance results from your instrumented React app.
        </p>
      </div>

      {/* Connection status banner */}
      {isConnected ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-800 bg-emerald-950 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="text-sm font-medium text-emerald-300">Live — connected</span>
          <span className="ml-auto text-xs text-gray-500">
            {lastUpdatedAt !== null
              ? `Last updated ${formatSecondsAgo(lastUpdatedAt)}`
              : 'Last updated just now'}
          </span>
        </div>
      ) : (
        <div
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-5 space-y-4"
          aria-label="Disconnected state"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gray-500" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-400">
              Waiting for data…
            </span>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Add <code className="text-gray-300">SpatialProvider</code> to your React app to start
              receiving live results:
            </p>
            <pre className="rounded bg-gray-800 p-3 text-xs text-gray-300 overflow-x-auto">
              {SETUP_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* Result */}
      {isConnected && (
        <div className={isPulsing ? 'animate-pulse' : ''}>
          <ResultDetailView result={bridge.result} />
        </div>
      )}
    </div>
  )
}
