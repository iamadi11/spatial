import { useState } from 'react'
import { getRuleCatalog } from '../lib/engine'
import { RuleCard } from '../components/RuleCard'

type SeverityFilter = 'all' | 'warning' | 'error'

export function RuleCatalogPage() {
  const rules = getRuleCatalog()
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')

  const filtered = rules.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || rule.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  const isFiltered = search !== '' || severityFilter !== 'all'

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Rule Catalog</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          aria-label="Search rules"
          placeholder="Search rules…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2" role="group" aria-label="Filter by severity">
          {(['all', 'warning', 'error'] as SeverityFilter[]).map((sev) => (
            <button
              key={sev}
              aria-pressed={severityFilter === sev ? 'true' : 'false'}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                severityFilter === sev
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-400">
        {isFiltered
          ? `Showing ${filtered.length} of ${rules.length} rules`
          : `All ${rules.length} performance rules registered in the spatial engine.`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((rule) => (
          <RuleCard key={rule.name} rule={rule} />
        ))}
      </div>
    </main>
  )
}
