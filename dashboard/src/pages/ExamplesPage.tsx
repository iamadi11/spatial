import { useState } from 'react'
import { RerenderSection } from '../components/examples/sections/RerenderSection'
import { WrapperHellSection } from '../components/examples/sections/WrapperHellSection'
import { PropExplosionSection } from '../components/examples/sections/PropExplosionSection'
import { UnvirtualizedListSection } from '../components/examples/sections/UnvirtualizedListSection'
import { DeepNestingSection } from '../components/examples/sections/DeepNestingSection'

type SectionId = 'rerender' | 'wrapper' | 'props' | 'list' | 'nesting'

type Section = {
  id: SectionId
  label: string
  emoji: string
  component: React.ReactNode
}

const SECTIONS: Section[] = [
  { id: 'rerender', label: 'Excessive Re-renders', emoji: '🔁', component: <RerenderSection /> },
  { id: 'wrapper', label: 'Wrapper Hell', emoji: '📦', component: <WrapperHellSection /> },
  { id: 'props', label: 'Prop Explosion', emoji: '💣', component: <PropExplosionSection /> },
  { id: 'list', label: 'Unvirtualized List', emoji: '📜', component: <UnvirtualizedListSection /> },
  { id: 'nesting', label: 'Deep Nesting', emoji: '🪆', component: <DeepNestingSection /> },
]

export function ExamplesPage() {
  const [activeId, setActiveId] = useState<SectionId>('rerender')

  const activeSection = SECTIONS.find(s => s.id === activeId)

  return (
    <div className="flex h-full" aria-label="Examples page">
      {/* Section navigation */}
      <aside
        className="w-56 shrink-0 border-r border-gray-800 bg-gray-900/50 overflow-y-auto"
        aria-label="Example sections"
      >
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Performance Patterns
          </h2>
        </div>
        <nav className="p-2 space-y-1">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveId(section.id)}
              aria-label={`Show ${section.label} example`}
              aria-current={activeId === section.id ? 'page' : undefined}
              className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors ${
                activeId === section.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              <span className="mr-2">{section.emoji}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Section content */}
      <main className="flex-1 overflow-y-auto p-8" aria-label="Example content">
        {activeSection && (
          <div key={activeId}>
            {activeSection.component}
          </div>
        )}
      </main>
    </div>
  )
}
