import type { ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'

type Side = {
  code: string
  demo: ReactNode
}

type Props = {
  title: string
  description: string
  ruleNames: string[]
  bad: Side
  good: Side
}

export function ExampleSection({ title, description, ruleNames, bad, good }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
        <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {ruleNames.map(r => (
            <span key={r} className="rounded-full bg-indigo-900/50 border border-indigo-800 px-2 py-0.5 text-xs font-mono text-indigo-300">
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Bad vs Good columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bad */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-base">❌</span>
            <h3 className="text-sm font-semibold text-red-400">Bad Pattern</h3>
          </div>
          <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-4 space-y-4">
            <div aria-label="Bad pattern demo">
              {bad.demo}
            </div>
            <CodeBlock code={bad.code} label="Code" />
          </div>
        </div>

        {/* Good */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-base">✅</span>
            <h3 className="text-sm font-semibold text-emerald-400">Good Pattern</h3>
          </div>
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-4 space-y-4">
            <div aria-label="Good pattern demo">
              {good.demo}
            </div>
            <CodeBlock code={good.code} label="Code" />
          </div>
        </div>
      </div>
    </div>
  )
}
