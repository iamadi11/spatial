import type { RuleOptions } from '../lib/engine'

type Props = {
  options: RuleOptions
  onChange: (options: RuleOptions) => void
}

type ThresholdField = {
  key: keyof RuleOptions
  label: string
  ariaLabel: string
}

const THRESHOLD_FIELDS: ThresholdField[] = [
  { key: 'renderCountThreshold', label: 'Render count', ariaLabel: 'renderCountThreshold' },
  { key: 'layoutShiftThreshold', label: 'Layout shift', ariaLabel: 'layoutShiftThreshold' },
  { key: 'fpsDropThreshold', label: 'FPS drop', ariaLabel: 'fpsDropThreshold' },
  { key: 'memoryUsageThreshold', label: 'Memory usage (MB)', ariaLabel: 'memoryUsageThreshold' },
  { key: 'childCountThreshold', label: 'Child count', ariaLabel: 'childCountThreshold' },
  { key: 'nestingDepthThreshold', label: 'Nesting depth', ariaLabel: 'nestingDepthThreshold' },
  { key: 'propCountThreshold', label: 'Prop count', ariaLabel: 'propCountThreshold' },
  { key: 'inlineStyleCountThreshold', label: 'Inline style count', ariaLabel: 'inlineStyleCountThreshold' },
  { key: 'totalNodeCountThreshold', label: 'Total node count', ariaLabel: 'totalNodeCountThreshold' },
  { key: 'eventHandlerCountThreshold', label: 'Event handler count', ariaLabel: 'eventHandlerCountThreshold' },
  { key: 'largeDataPropThreshold', label: 'Large data prop (bytes)', ariaLabel: 'largeDataPropThreshold' },
  { key: 'unvirtualizedListThreshold', label: 'Unvirtualized list size', ariaLabel: 'unvirtualizedListThreshold' },
  { key: 'duplicateComponentTypeThreshold', label: 'Duplicate component type count', ariaLabel: 'duplicateComponentTypeThreshold' },
]

/**
 * ThresholdEditor — D15
 * Collapsible panel for overriding per-rule thresholds in the analysis playground.
 * Empty inputs revert the threshold to undefined (engine default).
 */
export function ThresholdEditor({ options, onChange }: Props) {
  function handleChange(key: keyof RuleOptions, raw: string) {
    const next: RuleOptions = { ...options }
    if (raw === '') {
      delete next[key]
    } else {
      const parsed = parseInt(raw, 10)
      if (!isNaN(parsed)) {
        next[key] = parsed
      }
    }
    onChange(next)
  }

  return (
    <details className="rounded border border-gray-700 bg-gray-900 text-sm">
      <summary className="cursor-pointer select-none px-3 py-2 text-gray-400 hover:text-gray-200 font-medium">
        Advanced: Rule Thresholds
      </summary>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-3 pb-3 pt-2">
        {THRESHOLD_FIELDS.map(({ key, label, ariaLabel }) => (
          <label key={key} className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-500">{label}</span>
            <input
              type="number"
              aria-label={ariaLabel}
              value={options[key] !== undefined ? String(options[key]) : ''}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder="default"
              min={0}
              className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
            />
          </label>
        ))}
      </div>
    </details>
  )
}
