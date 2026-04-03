import { useState } from 'react'
import { runAnalysis } from '../lib/engine'
import type { ComponentNode, PerformanceMetrics, PerformanceResult } from '../lib/engine'
import { NodeTreeInput } from '../components/NodeTreeInput'
import { MetricsInput } from '../components/MetricsInput'
import { AnalysisResult } from '../components/AnalysisResult'

const EXAMPLE_TREE: ComponentNode = {
  id: 'app',
  type: 'App',
  children: [
    {
      id: 'header',
      type: 'Header',
      props: { title: 'My App', subtitle: 'Subtitle' },
    },
    {
      id: 'list',
      type: 'List',
      children: Array.from({ length: 5 }, (_, i) => ({
        id: `item-${i}`,
        type: 'ListItem',
        props: { label: `Item ${i}` },
      })),
    },
  ],
}

const DEFAULT_METRICS: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

export function AnalysisPlaygroundPage() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(EXAMPLE_TREE, null, 2))
  const [metrics, setMetrics] = useState<PerformanceMetrics>(DEFAULT_METRICS)
  const [result, setResult] = useState<PerformanceResult | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  function handleRun() {
    let node: ComponentNode
    try {
      node = JSON.parse(jsonInput) as ComponentNode
      setParseError(null)
    } catch {
      setParseError('Invalid JSON — cannot run analysis.')
      return
    }
    const analysisResult = runAnalysis(node, metrics)
    setResult(analysisResult)
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Analysis Playground</h1>
      <p className="text-sm text-gray-400">
        Paste a component tree, set metrics, and run the spatial engine.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <NodeTreeInput value={jsonInput} onChange={setJsonInput} />
          <MetricsInput metrics={metrics} onChange={setMetrics} />
          {parseError && (
            <p className="text-xs text-red-400">{parseError}</p>
          )}
          <button
            onClick={handleRun}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Run Analysis"
          >
            Run Analysis
          </button>
        </div>

        <div>
          {result !== null && <AnalysisResult result={result} />}
          {result === null && (
            <div className="flex items-center justify-center h-full min-h-32 rounded-lg border border-dashed border-gray-700 text-gray-600 text-sm">
              Results will appear here
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
