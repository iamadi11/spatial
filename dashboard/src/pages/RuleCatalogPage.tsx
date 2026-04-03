import { getRuleCatalog } from '../lib/engine'
import { RuleCard } from '../components/RuleCard'

export function RuleCatalogPage() {
  const rules = getRuleCatalog()

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Rule Catalog</h1>
      <p className="text-sm text-gray-400">
        All {rules.length} performance rules registered in the spatial engine.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <RuleCard key={rule.name} rule={rule} />
        ))}
      </div>
    </main>
  )
}
