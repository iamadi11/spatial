import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// TreeNode renders another TreeNode — recursive!
function TreeNode({ node }) {
  return (
    <div className="tree-node">
      <span>{node.label}</span>
      {node.children?.map(child => (
        // Same component type inside itself — engine flags it
        <TreeNode key={child.id} node={child} />
      ))}
    </div>
  )
}
// Risk: unbounded recursion if data has cycles`

const GOOD_CODE = `// Separate types per level — no self-reference
function TreeRoot({ node }) {
  return (
    <div className="tree-root">
      <span>{node.label}</span>
      {node.children?.map(child => (
        <TreeBranch key={child.id} node={child} />
      ))}
    </div>
  )
}

function TreeBranch({ node }) {
  return (
    <div className="tree-branch">
      <span>{node.label}</span>
      {node.children?.map(child => (
        <TreeLeaf key={child.id} node={child} />
      ))}
    </div>
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

/** TreeNode containing another TreeNode — recursive-component fires */
const BAD_TREE: ComponentNode = {
  id: 'tree-root',
  type: 'TreeNode',
  children: [
    {
      id: 'tree-child',
      type: 'TreeNode',
      children: [
        { id: 'tree-grandchild', type: 'TreeNode' },
      ],
    },
  ],
}

/** Unique component types at each depth — no recursion */
const GOOD_TREE: ComponentNode = {
  id: 'tree-root',
  type: 'TreeRoot',
  children: [
    {
      id: 'tree-branch',
      type: 'TreeBranch',
      children: [
        { id: 'tree-leaf', type: 'TreeLeaf' },
      ],
    },
  ],
}

// ── Demo components ───────────────────────────────────────────────────────────

function BadDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard
        tree={BAD_TREE}
        metrics={SAFE_METRICS}
        label="Bad: recursive component type"
      />
      <p className="text-xs text-gray-500">
        <code className="font-mono">TreeNode</code> appears inside another{' '}
        <code className="font-mono">TreeNode</code> — the same component type
        renders within its own ancestor chain. Engine flags the first
        descendant instance.
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
        label="Good: unique types per level"
      />
      <p className="text-xs text-gray-500">
        <code className="font-mono">TreeRoot → TreeBranch → TreeLeaf</code> —
        each level uses a distinct component type. Engine shows pass.
        If recursion is genuinely needed, ensure a base-case guard and
        bound the depth.
      </p>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function RecursiveComponentSection() {
  return (
    <ExampleSection
      title="Recursive Component"
      description="When a component renders an instance of itself, React must walk deep into potentially unbounded trees. Even without an infinite loop, recursive patterns add reconciliation cost and can cause stack overflows on large datasets. The engine flags any component whose type already appears in its ancestor chain."
      ruleNames={['recursive-component']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
