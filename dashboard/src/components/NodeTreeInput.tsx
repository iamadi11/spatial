type Props = {
  value: string
  onChange: (value: string) => void
}

function isValidJson(s: string): boolean {
  try {
    JSON.parse(s)
    return true
  } catch {
    return false
  }
}

export function NodeTreeInput({ value, onChange }: Props) {
  const hasError = value.trim().length > 0 && !isValidJson(value)

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-400" htmlFor="node-tree-input">
        Component Tree (JSON)
      </label>
      <textarea
        id="node-tree-input"
        className={`w-full h-40 rounded-md border bg-gray-950 p-3 font-mono text-xs text-gray-100 resize-y focus:outline-none focus:ring-1 ${
          hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-indigo-500'
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Component Tree JSON input"
        spellCheck={false}
      />
      {hasError && (
        <p role="alert" className="text-xs text-red-400">
          Invalid JSON — please enter a valid ComponentNode object.
        </p>
      )}
    </div>
  )
}
