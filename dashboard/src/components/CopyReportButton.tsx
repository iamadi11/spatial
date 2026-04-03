import { useState } from 'react'
import type { PerformanceResult } from '../lib/engine'
import { formatReport } from '../lib/engine'

type Props = {
  result: PerformanceResult
}

export function CopyReportButton({ result }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatReport(result))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard access denied — silently ignore
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy report to clipboard'}
      className="rounded px-3 py-1 text-xs font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy report'}
    </button>
  )
}
