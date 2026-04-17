/**
 * IssueGroupedList — D21
 * Groups a flat PerformanceIssue[] by rule name into collapsible sections.
 * Each section shows: rule name header + count badge. Clicking toggles visibility.
 * Used on /live to make dense issue lists scannable.
 */
import { useState } from 'react'
import type { PerformanceIssue } from '../lib/engine'

type Props = {
  issues: PerformanceIssue[]
}

type IssueGroup = {
  rule: string
  issues: PerformanceIssue[]
}

function groupByRule(issues: PerformanceIssue[]): IssueGroup[] {
  const map = new Map<string, PerformanceIssue[]>()
  for (const issue of issues) {
    const existing = map.get(issue.rule)
    if (existing) {
      existing.push(issue)
    } else {
      map.set(issue.rule, [issue])
    }
  }
  return Array.from(map.entries()).map(([rule, iss]) => ({ rule, issues: iss }))
}

export function IssueGroupedList({ issues }: Props) {
  const groups = groupByRule(issues)

  // Track collapsed groups by rule name; default all expanded
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  if (groups.length === 0) {
    return <p className="text-sm text-gray-500 italic py-2">No issues detected.</p>
  }

  function toggle(rule: string) {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(rule)) {
        next.delete(rule)
      } else {
        next.add(rule)
      }
      return next
    })
  }

  return (
    <ul className="space-y-2" role="list">
      {groups.map(group => {
        const isCollapsed = collapsed.has(group.rule)
        const hasErrors = group.issues.some(i => i.severity === 'error')
        return (
          <li key={group.rule} className="rounded-lg border border-gray-800 overflow-hidden">
            {/* Group header — collapsible toggle */}
            <button
              aria-label={`${group.rule} — ${group.issues.length} issue${group.issues.length === 1 ? '' : 's'}`}
              aria-expanded={!isCollapsed}
              onClick={() => toggle(group.rule)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm font-mono font-medium transition-colors ${
                hasErrors
                  ? 'bg-red-950 text-red-300 hover:bg-red-900'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{group.rule}</span>
              <span className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
                    hasErrors ? 'bg-red-800 text-red-200' : 'bg-indigo-900 text-indigo-300'
                  }`}
                >
                  {group.issues.length}
                </span>
                <span className="text-gray-600 text-xs">{isCollapsed ? '▶' : '▼'}</span>
              </span>
            </button>

            {/* Issue list — shown when expanded */}
            {!isCollapsed && (
              <ul className="divide-y divide-gray-800/50">
                {group.issues.map((issue, idx) => (
                  <li key={idx} className="px-3 py-2 text-xs font-mono text-gray-400">
                    <span className="text-gray-600 mr-2">{issue.nodeId}</span>
                    {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
