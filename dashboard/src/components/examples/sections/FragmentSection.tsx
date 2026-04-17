import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// Fragment wraps a single child — no grouping benefit
function UserProfile() {
  return (
    <>
      <ProfileCard userId="u-001" />
    </>
  )
}`

const GOOD_CODE = `// Child rendered directly — Fragment removed
function UserProfile() {
  return <ProfileCard userId="u-001" />
}`

// ── Shared metrics ────────────────────────────────────────────────────────────

const SAFE_METRICS: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

// ── Demo trees ────────────────────────────────────────────────────────────────

/** Fragment wrapping exactly 1 child → fragment-single-child fires */
const BAD_TREE: ComponentNode = {
  id: 'wrapper-fragment',
  type: 'Fragment',
  children: [
    { id: 'profile-card', type: 'ProfileCard', props: { userId: 'u-001' } },
  ],
}

/** Single component rendered directly — no Fragment → no issue */
const GOOD_TREE: ComponentNode = {
  id: 'profile-card',
  type: 'ProfileCard',
  props: { userId: 'u-001' },
}

// ── Demo components ───────────────────────────────────────────────────────────

function BadDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard
        tree={BAD_TREE}
        metrics={SAFE_METRICS}
        label="Bad: Fragment with single child"
      />
      <p className="text-xs text-gray-500">
        <code className="font-mono">{'<>'}</code> wraps only one child — adds a
        reconciliation node without grouping anything. Engine flags the Fragment.
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
        label="Good: child rendered directly"
      />
      <p className="text-xs text-gray-500">
        <code className="font-mono">ProfileCard</code> rendered directly — no
        wrapper needed. Engine shows pass.
      </p>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function FragmentSection() {
  return (
    <ExampleSection
      title="Unnecessary Fragment"
      description="React Fragments let you group multiple children without adding a DOM node. But a Fragment wrapping only one child serves no purpose — it adds a reconciliation step with zero benefit. The engine flags any Fragment node that has exactly one child."
      ruleNames={['fragment-single-child']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
