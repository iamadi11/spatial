type Props = {
  code: string
  label?: string
}

export function CodeBlock({ code, label }: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      )}
      <pre className="overflow-x-auto rounded-lg bg-gray-950 border border-gray-800 p-4 text-xs text-gray-300 leading-relaxed whitespace-pre">
        <code>{code.trim()}</code>
      </pre>
    </div>
  )
}
