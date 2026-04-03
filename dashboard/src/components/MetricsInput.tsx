import type { PerformanceMetrics } from '../lib/engine'

type Props = {
  metrics: PerformanceMetrics
  onChange: (metrics: PerformanceMetrics) => void
}

type MetricField = {
  key: keyof PerformanceMetrics
  label: string
}

const FIELDS: MetricField[] = [
  { key: 'renderCount', label: 'Render Count' },
  { key: 'layoutShifts', label: 'Layout Shifts' },
  { key: 'fpsDrop', label: 'FPS Drop' },
  { key: 'memoryUsage', label: 'Memory Usage (MB)' },
]

export function MetricsInput({ metrics, onChange }: Props) {
  function handleChange(key: keyof PerformanceMetrics, raw: string) {
    const value = parseInt(raw, 10)
    if (!isNaN(value)) {
      onChange({ ...metrics, [key]: value })
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-400">Performance Metrics</p>
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <label className="block text-xs text-gray-500" htmlFor={`metric-${key}`}>
              {label}
            </label>
            <input
              id={`metric-${key}`}
              type="number"
              min={0}
              value={metrics[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-950 px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label={label}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
