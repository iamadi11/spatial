import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// Same-type children with no key props
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        // No key — React can't match elements across renders
        <ListItem text={item.text} />
      ))}
    </ul>
  )
}`

const GOOD_CODE = `// Same-type children with stable key props
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        // key lets React reconcile the list cheaply
        <ListItem key={item.id} text={item.text} />
      ))}
    </ul>
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

/** 4 ListItem children, none with a key prop → missing-key-prop fires */
const BAD_TREE: ComponentNode = {
  id: 'ItemList',
  type: 'ItemList',
  children: [
    { id: 'item-1', type: 'ListItem', props: { text: 'Item 1' } },
    { id: 'item-2', type: 'ListItem', props: { text: 'Item 2' } },
    { id: 'item-3', type: 'ListItem', props: { text: 'Item 3' } },
    { id: 'item-4', type: 'ListItem', props: { text: 'Item 4' } },
  ],
}

/** Same 4 ListItem children, each with a unique key prop → no issue */
const GOOD_TREE: ComponentNode = {
  id: 'ItemList',
  type: 'ItemList',
  children: [
    { id: 'item-1', type: 'ListItem', props: { text: 'Item 1', key: 'item-1' } },
    { id: 'item-2', type: 'ListItem', props: { text: 'Item 2', key: 'item-2' } },
    { id: 'item-3', type: 'ListItem', props: { text: 'Item 3', key: 'item-3' } },
    { id: 'item-4', type: 'ListItem', props: { text: 'Item 4', key: 'item-4' } },
  ],
}

// ── Demo components ───────────────────────────────────────────────────────────

function BadDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={BAD_TREE} metrics={SAFE_METRICS} label="Bad: no key props" />
      <p className="text-xs text-gray-500">
        4 <code className="font-mono">ListItem</code> children with no{' '}
        <code className="font-mono">key</code> prop — engine flags the parent.
      </p>
    </div>
  )
}

function GoodDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={GOOD_TREE} metrics={SAFE_METRICS} label="Good: with key props" />
      <p className="text-xs text-gray-500">
        Same children, each with a stable <code className="font-mono">key</code>{' '}
        — React can reconcile the list efficiently. Engine shows pass.
      </p>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function MissingKeySection() {
  return (
    <ExampleSection
      title="Missing Key Props"
      description="When rendering a list of same-type children, React needs a stable key prop to match elements across renders. Without keys, React falls back to index-based reconciliation — unmounting and remounting components unnecessarily. The engine flags any parent node with 2+ same-type children that all lack key props."
      ruleNames={['missing-key-prop']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
