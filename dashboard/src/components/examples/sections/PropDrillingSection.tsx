import { useState } from 'react'
import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// userId drilled through 5 component levels
function App({ userId }) {
  return <Page userId={userId} />
}
function Page({ userId }) {
  return <Section userId={userId} />
}
function Section({ userId }) {
  return <Panel userId={userId} />
}
function Panel({ userId }) {
  return <Widget userId={userId} />  // depth 5 — engine fires
}
function Widget({ userId }) {
  return <span>{userId}</span>
}`

const GOOD_CODE = `// userId provided once via context — no drilling
const UserContext = createContext(null)

function App({ userId }) {
  return (
    <UserContext.Provider value={userId}>
      <Page />
    </UserContext.Provider>
  )
}
function Widget() {
  const userId = useContext(UserContext)  // consumed directly
  return <span>{userId}</span>
}`

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Builds a linear chain of `depth` nodes, each with the same `userId` prop. */
function buildDrilledTree(depth: number): ComponentNode {
  let node: ComponentNode = {
    id: `level-${depth - 1}`,
    type: `Level${depth - 1}`,
    props: { userId: 'u-001' },
  }
  for (let i = depth - 2; i >= 0; i--) {
    node = {
      id: `level-${i}`,
      type: `Level${i}`,
      props: { userId: 'u-001' },
      children: [node],
    }
  }
  return node
}

const SAFE_METRICS: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

// ── Demo components ───────────────────────────────────────────────────────────

function BadDemo() {
  const [depth, setDepth] = useState(5)

  const tree = buildDrilledTree(depth)

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={tree} metrics={SAFE_METRICS} label="Bad: prop drilling" />
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label
            htmlFor="depth-slider"
            className="text-xs text-gray-400 whitespace-nowrap"
          >
            Drilling Depth: <span className="font-mono text-gray-200">{depth}</span>
          </label>
          <input
            id="depth-slider"
            type="range"
            min={1}
            max={6}
            value={depth}
            onChange={e => setDepth(Number(e.target.value))}
            aria-label="Drilling depth"
            className="w-full accent-indigo-500"
          />
        </div>
        <p className="text-xs text-gray-500">
          Engine fires when the same prop key appears in &gt; 3 consecutive levels.
          Slide below 4 to see it pass.
        </p>
      </div>
    </div>
  )
}

function GoodDemo() {
  // Flat tree: userId provided at App level only; Dashboard reads it once.
  // No drilling — userId does not propagate through child-of-child chains.
  const tree: ComponentNode = {
    id: 'App',
    type: 'App',
    children: [
      {
        id: 'Dashboard',
        type: 'Dashboard',
        props: { userId: 'u-001' },
      },
    ],
  }

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={tree} metrics={SAFE_METRICS} label="Good: context access" />
      <p className="text-xs text-gray-500">
        userId is consumed at the component that needs it — no intermediate
        forwarding. Engine shows pass at any depth.
      </p>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function PropDrillingSection() {
  return (
    <ExampleSection
      title="Prop Drilling"
      description="Prop drilling happens when a value is passed down through many component levels that don't use it — only the leaf does. This creates tight coupling and makes refactoring painful. The engine flags any prop key that propagates through more than 3 consecutive ancestor-descendant levels."
      ruleNames={['prop-drilling-depth']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
