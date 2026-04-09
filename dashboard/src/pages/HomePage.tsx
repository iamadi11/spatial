import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8" aria-label="Spatial product overview">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-100">Spatial</h1>
      <p className="text-sm leading-relaxed text-gray-400">
        Dev-time UI performance signals for React component trees. Browse every detection rule in the catalog,
        or walk through bad vs good patterns with live engine analysis — in the browser, with no backend.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/rules"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          aria-label="Open the rule catalog"
        >
          Rule catalog
        </Link>
        <Link
          to="/examples"
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-800"
          aria-label="Open pattern examples"
        >
          Examples
        </Link>
      </div>
    </main>
  )
}
