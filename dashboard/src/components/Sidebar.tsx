import { NavLink } from 'react-router-dom'

const ENGINE_VERSION = '0.20.0'

const NAV_LINKS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/live', label: 'Live' },
  { to: '/rules', label: 'Rules' },
  { to: '/examples', label: 'Examples' },
]

export function Sidebar() {
  return (
    <nav
      className="flex flex-col h-full w-52 shrink-0 bg-gray-900 border-r border-gray-800 px-3 py-4"
      aria-label="Main navigation"
    >
      <div className="mb-6 px-2">
        <span className="text-sm font-bold text-gray-100 tracking-tight">Spatial Dashboard</span>
      </div>

      <ul className="flex-1 space-y-1">
        {NAV_LINKS.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end === true}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="px-2 pt-4 border-t border-gray-800">
        <span className="text-xs text-gray-600">engine v{ENGINE_VERSION}</span>
      </div>
    </nav>
  )
}
