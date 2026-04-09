import { useState } from 'react'
import type { PerformanceResult } from '../lib/engine'
import { formatPerformanceResultJson } from '../lib/engine'

type Props = {
  result: PerformanceResult
}

export function PerformanceResultJsonActions({ result }: Props) {
  const [copied, setCopied] = useState(false)
  const json = formatPerformanceResultJson(result)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard access denied — silently ignore
    }
  }

  function handleDownload() {
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spatial-result.json'
    a.rel = 'noopener'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Analysis JSON export">
      <button
        type="button"
        onClick={() => void handleCopy()}
        aria-label={copied ? 'Copied analysis JSON to clipboard' : 'Copy analysis JSON to clipboard'}
        className="rounded px-2 py-1 text-xs font-medium bg-gray-800/80 text-gray-300 hover:bg-gray-700 transition-colors"
      >
        {copied ? 'JSON copied!' : 'Copy analysis JSON'}
      </button>
      <button
        type="button"
        onClick={handleDownload}
        aria-label="Download analysis JSON as a file"
        className="rounded px-2 py-1 text-xs font-medium bg-gray-800/80 text-gray-300 hover:bg-gray-700 transition-colors"
      >
        Download JSON
      </button>
    </div>
  )
}
