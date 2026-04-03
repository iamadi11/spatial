import type { PerformanceMetrics } from '../lib/engine'

interface MetricsBarDisplayProps {
  metrics: PerformanceMetrics
}

type MetricConfig = {
  key: keyof PerformanceMetrics
  max: number
}

const METRIC_CONFIGS: MetricConfig[] = [
  { key: 'renderCount',   max: 50  },
  { key: 'layoutShifts',  max: 10  },
  { key: 'fpsDrop',       max: 30  },
  { key: 'memoryUsage',   max: 200 },
]

function getColorClass(ratio: number): string {
  if (ratio > 0.8) return 'bg-red-500'
  if (ratio > 0.5) return 'bg-amber-400'
  return 'bg-green-500'
}

export function MetricsBarDisplay({ metrics }: MetricsBarDisplayProps) {
  return (
    <div
      role="region"
      aria-label="Metrics"
      className="space-y-3"
    >
      {METRIC_CONFIGS.map(({ key, max }) => {
        const raw = metrics[key]
        const value = Math.max(0, raw)
        const ratio = Math.min(1, value / max)
        const pct = Math.round(ratio * 100)
        const colorClass = getColorClass(ratio)

        return (
          <div
            key={key}
            aria-label={key}
            className="space-y-1"
          >
            <div className="flex justify-between text-xs text-gray-400">
              <span>{key}</span>
              <span className="tabular-nums text-gray-200">{raw}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-700 overflow-hidden">
              <div
                data-testid="bar-fill"
                className={`h-full rounded-full transition-all ${colorClass}`}
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
