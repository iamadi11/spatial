type Severity = 'all' | 'error' | 'warning'

type Counts = {
  all: number
  error: number
  warning: number
}

type Props = {
  active: Severity
  onChange: (severity: Severity) => void
  counts: Counts
}

const FILTERS: { value: Severity; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'error', label: 'Errors' },
  { value: 'warning', label: 'Warnings' },
]

export function SeverityFilter({ active, onChange, counts }: Props) {
  return (
    <div className="flex gap-2" role="group" aria-label="Filter by severity">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          aria-pressed={active === value}
          className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors ${
            active === value
              ? 'bg-gray-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {label}
          <span className="rounded bg-gray-700 px-1 py-0.5 text-xs tabular-nums">
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  )
}
