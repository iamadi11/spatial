import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// New object reference on every parent render
const UserContext = createContext(null)

function App({ userId, logout }) {
  return (
    // { userId, logout } is a NEW object every render —
    // all useContext(UserContext) calls re-render unnecessarily
    <UserContext.Provider value={{ userId, logout }}>
      <Dashboard />
    </UserContext.Provider>
  )
}`

const GOOD_CODE = `// Stable reference with useMemo
const UserContext = createContext(null)

function App({ userId, logout }) {
  const contextValue = useMemo(
    () => ({ userId, logout }),
    [userId, logout]       // only changes when inputs change
  )
  return (
    <UserContext.Provider value={contextValue}>
      <Dashboard />
    </UserContext.Provider>
  )
}`

// ── Shared metrics ────────────────────────────────────────────────────────────

const SAFE_METRICS: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

// ── Demo trees ────────────────────────────────────────────────────────────────

/** Provider with an object value — context-value-instability fires */
const BAD_TREE: ComponentNode = {
  id: 'user-provider',
  type: 'UserContext.Provider',
  props: { value: { userId: 'u-001', logout: () => {} } },
  children: [{ id: 'dashboard', type: 'Dashboard' }],
}

/** Provider with a stable string value — no issue */
const GOOD_TREE: ComponentNode = {
  id: 'theme-provider',
  type: 'ThemeContext.Provider',
  props: { value: 'dark' },
  children: [{ id: 'dashboard', type: 'Dashboard' }],
}

// ── Demo components ───────────────────────────────────────────────────────────

function BadDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard
        tree={BAD_TREE}
        metrics={SAFE_METRICS}
        label="Bad: object value"
      />
      <p className="text-xs text-gray-500">
        <code className="font-mono">{'{ userId, logout }'}</code> creates a new
        object on every render — all consumers re-render even when the data
        hasn't changed. Engine flags the Provider.
      </p>
    </div>
  )
}

function GoodDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard
        tree={GOOD_TREE}
        metrics={SAFE_METRICS}
        label="Good: primitive value"
      />
      <p className="text-xs text-gray-500">
        A string primitive is a stable value — same reference across renders.
        Engine shows pass. In real code, use <code className="font-mono">useMemo</code>{' '}
        when the value must be an object.
      </p>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function ContextInstabilitySection() {
  return (
    <ExampleSection
      title="Context Value Instability"
      description="Passing an object or function literal as a Context.Provider value creates a new reference on every parent render. React compares context values by reference — so all consumers re-render even when the underlying data is unchanged. Use primitives or useMemo to stabilize the reference."
      ruleNames={['context-value-instability']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
