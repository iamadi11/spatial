import { useRef, useState, memo } from 'react'
import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { ExampleSection } from '../ExampleSection'

// ── Engine trees ──────────────────────────────────────────────────────────────

const BAD_TREE: ComponentNode = {
  id: 'user-list',
  type: 'UserList',
  children: [
    { id: 'u1', type: 'UserCard', props: { name: 'Alice' } },
    { id: 'u2', type: 'UserCard', props: { name: 'Bob' } },
    { id: 'u3', type: 'UserCard', props: { name: 'Carol' } },
    { id: 'u4', type: 'UserCard', props: { name: 'Dan' } },
  ],
}
const BAD_METRICS: PerformanceMetrics = { renderCount: 24, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

const GOOD_TREE: ComponentNode = {
  id: 'user-list',
  type: 'UserList',
  children: [
    { id: 'u1', type: 'UserCard', props: { name: 'Alice' } },
    { id: 'u2', type: 'UserCard', props: { name: 'Bob' } },
    { id: 'u3', type: 'UserCard', props: { name: 'Carol' } },
    { id: 'u4', type: 'UserCard', props: { name: 'Dan' } },
  ],
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 3, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// Every parent state change re-renders ALL children
function UserList({ users }) {
  const [filter, setFilter] = useState('')

  return (
    <>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter..."
      />
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
function UserList({ users }) {
  const [filter, setFilter] = useState('')

  return (
    <>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      {users.map(user => (
        // UserCard only re-renders when its own user prop changes
        <UserCard key={user.id} user={user} />
      ))}
    </>
  )
}

const UserCard = memo(function UserCard({ user }) {
  return <div className="card">{user.name}</div>
})`

// ── Demo components ───────────────────────────────────────────────────────────

const NAMES = ['Alice', 'Bob', 'Carol', 'Dan']

function BadUserCard({ name }: { name: string; tick: number }) {
  const renders = useRef(0)
  renders.current++
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
  return (
    <div className="space-y-2">
      <button
        onClick={() => setTick(t => t + 1)}
        className="rounded bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-600"
      >
        Update parent state ({tick} clicks)
      </button>
      <p className="text-xs text-gray-500">Every click re-renders all cards ↓</p>
      <div className="space-y-1">
        {NAMES.map(name => <BadUserCard key={name} name={name} tick={tick} />)}
      </div>
    </div>
  )
}

function GoodDemo() {
  const [tick, setTick] = useState(0)
  return (
    <div className="space-y-2">
      <button
        onClick={() => setTick(t => t + 1)}
        className="rounded bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-600"
      >
        Update parent state ({tick} clicks)
      </button>
      <p className="text-xs text-gray-500">memo() — cards stay at 1 render ↓</p>
      <div className="space-y-1">
        {NAMES.map(name => <GoodUserCard key={name} name={name} />)}
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function RerenderSection() {
  return (
    <ExampleSection
      title="Excessive Re-renders"
      description="Without React.memo, every parent state change forces all child components to re-render — even when their own props haven't changed. This wastes CPU and causes jank in complex UIs. Click the button in each demo to watch the render counts accumulate."
      ruleNames={['render-count']}
      bad={{ code: BAD_CODE, tree: BAD_TREE, metrics: BAD_METRICS, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, tree: GOOD_TREE, metrics: GOOD_METRICS, demo: <GoodDemo /> }}
    />
  )
}
