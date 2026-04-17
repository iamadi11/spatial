import { useRef, useState, memo } from 'react'
import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// Every parent state change re-renders ALL children
function UserList({ users }) {
  const [filter, setFilter] = useState('')
  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {users.map(user => (
        // UserCard re-renders on every keystroke — even unrelated ones
        <UserCard key={user.id} user={user} />
      ))}
    </>
  )
}

function UserCard({ user }) {
  return <div className="card">{user.name}</div>
}`

const GOOD_CODE = `// React.memo stops unnecessary re-renders
const UserCard = memo(function UserCard({ user }) {
  return <div className="card">{user.name}</div>
})

function UserList({ users }) {
  const [filter, setFilter] = useState('')
  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {users.map(user => (
        // UserCard only re-renders when its own user prop changes
        <UserCard key={user.id} user={user} />
      ))}
    </>
  )
}`

// ── Demo components ───────────────────────────────────────────────────────────

const NAMES = ['Alice', 'Bob', 'Carol', 'Dan']

function BadUserCard({ name, tick }: { name: string; tick: number }) {
  const renders = useRef(0)
  renders.current++
  // tick is used so this component re-renders every time parent state changes
  void tick
  return (
    <div className="flex items-center justify-between rounded bg-gray-800 px-3 py-2 text-xs">
      <span className="text-gray-200">{name}</span>
      <span className="font-mono text-red-400">renders: {renders.current}</span>
    </div>
  )
}

const GoodUserCard = memo(function GoodUserCard({ name }: { name: string }) {
  const renders = useRef(0)
  renders.current++
  return (
    <div className="flex items-center justify-between rounded bg-gray-800 px-3 py-2 text-xs">
      <span className="text-gray-200">{name}</span>
      <span className="font-mono text-emerald-400">renders: {renders.current}</span>
    </div>
  )
})

function BadDemo() {
  const [tick, setTick] = useState(0)
  const renderCount = useRef(0)
  renderCount.current++

  const tree: ComponentNode = {
    id: 'UserList',
    type: 'UserList',
    children: NAMES.map((name, i) => ({
      id: `card-${i}`,
      type: 'UserCard',
      props: { name, key: `card-${i}` },
    })),
  }
  const metrics: PerformanceMetrics = {
    renderCount: renderCount.current,
    layoutShifts: 0,
    fpsDrop: 0,
    memoryUsage: 0,
  }

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={tree} metrics={metrics} label="Bad: no memoization" />
      <div className="space-y-2">
        <button
          onClick={() => setTick(t => t + 1)}
          className="rounded bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-600"
          aria-label="Update parent state"
        >
          Update parent state ({tick} clicks)
        </button>
        <p className="text-xs text-gray-500">
          renderCount = {renderCount.current} — engine flags when &gt; 5
        </p>
        <div className="space-y-1">
          {NAMES.map(name => <BadUserCard key={name} name={name} tick={tick} />)}
        </div>
      </div>
    </div>
  )
}

function GoodDemo() {
  const [tick, setTick] = useState(0)

  // Memo'd children only render once — renderCount stays at 1 per component.
  // We model this with a fixed renderCount of 1, representing the steady-state
  // per-component average when React.memo is correctly applied.
  const tree: ComponentNode = {
    id: 'UserList',
    type: 'UserList',
    children: NAMES.map((name, i) => ({
      id: `card-${i}`,
      type: 'MemoUserCard',
      props: { name, key: `card-${i}` },
    })),
  }
  const metrics: PerformanceMetrics = {
    renderCount: 1,
    layoutShifts: 0,
    fpsDrop: 0,
    memoryUsage: 0,
  }

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={tree} metrics={metrics} label="Good: with React.memo" />
      <div className="space-y-2">
        <button
          onClick={() => setTick(t => t + 1)}
          className="rounded bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-600"
          aria-label="Update parent state"
        >
          Update parent state ({tick} clicks)
        </button>
        <p className="text-xs text-gray-500">
          memo() — children stay at 1 render regardless of clicks
        </p>
        <div className="space-y-1">
          {NAMES.map(name => <GoodUserCard key={name} name={name} />)}
        </div>
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function RerenderSection() {
  return (
    <ExampleSection
      title="Excessive Re-renders"
      description="Without React.memo, every parent state change forces all child components to re-render — even when their own props haven't changed. Click the button to watch the render count climb. The engine flags it once it crosses the threshold of 5."
      ruleNames={['render-count']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
