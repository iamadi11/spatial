import { useState } from 'react'
import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// All 500 items mounted in the DOM at once
function ProductList({ products }) {
  // products.length === 500
  return (
    <ul className="product-list">
      {products.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  )
}
// 500 DOM nodes created immediately
// Scroll is janky — every item is laid out`

const GOOD_CODE = `// Only visible items are rendered
import { FixedSizeList } from 'react-window'

function ProductList({ products }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={products.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <ProductItem
          key={products[index].id}
          product={products[index]}
          style={style}
        />
      )}
    </FixedSizeList>
  )
}
// ~10 DOM nodes at any time regardless of list size`

// ── Demo components ───────────────────────────────────────────────────────────

function ProductRow({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex items-center gap-3 rounded bg-gray-800 px-3 py-1.5 text-xs">
      <span className="text-gray-500 w-6 tabular-nums">{index + 1}</span>
      <span className="text-gray-200">{name}</span>
    </div>
  )
}

function BadDemo() {
  const [count, setCount] = useState(200)

  const tree: ComponentNode = {
    id: 'ProductList',
    type: 'ProductList',
    children: Array.from({ length: count }, (_, i) => ({
      id: `product-${i}`,
      type: 'ProductItem',
      props: { name: `Product ${i + 1}`, key: `product-${i}` },
    })),
  }
  const metrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={tree} metrics={metrics} label="Unvirtualized list" />
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label htmlFor="count-slider" className="text-xs text-gray-400 whitespace-nowrap">
            Item count: <span className="text-gray-200 font-mono">{count}</span>
          </label>
          <input
            id="count-slider"
            type="range"
            min={5}
            max={300}
            step={5}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
            aria-label="Item count"
          />
        </div>
        <p className="text-xs text-gray-500">
          child-count fires at &gt; 20 · unvirtualized-list fires at &gt; 50 same-type children
        </p>
      </div>
      <div className="h-36 overflow-y-auto space-y-1 pr-1">
        {Array.from({ length: Math.min(count, 20) }, (_, i) => (
          <ProductRow key={i} name={`Product ${i + 1}`} index={i} />
        ))}
        {count > 20 && (
          <div className="text-center text-xs text-gray-500 py-1">
            … {count - 20} more items rendered (not shown)
          </div>
        )}
      </div>
    </div>
  )
}

const GOOD_TREE: ComponentNode = {
  id: 'ProductList',
  type: 'ProductList',
  children: Array.from({ length: 10 }, (_, i) => ({
    id: `product-${i}`,
    type: 'ProductItem',
    props: { name: `Product ${i + 1}`, key: `product-${i}` },
  })),
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

const PAGE_SIZE = 10
const ALL_ITEMS = Array.from({ length: 200 }, (_, i) => `Product ${i + 1}`)

function GoodDemo() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(ALL_ITEMS.length / PAGE_SIZE)
  const visible = ALL_ITEMS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={GOOD_TREE} metrics={GOOD_METRICS} label="Virtualized list" />
      <p className="text-xs text-gray-500">
        Only {PAGE_SIZE} nodes rendered — paginated to simulate virtualization
      </p>
      <div className="space-y-1">
        {visible.map((name, i) => (
          <ProductRow key={page * PAGE_SIZE + i} name={name} index={page * PAGE_SIZE + i} />
        ))}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 disabled:opacity-40 hover:bg-gray-600"
        >
          ←
        </button>
        <span className="text-xs text-gray-400">Page {page + 1} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 disabled:opacity-40 hover:bg-gray-600"
        >
          →
        </button>
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function UnvirtualizedListSection() {
  return (
    <ExampleSection
      title="Unvirtualized List"
      description="Rendering hundreds of list items at once creates hundreds of DOM nodes — even items the user can't see. Drag the slider to increase item count and watch the engine flag child-count (>20) then unvirtualized-list (>50 same-type children)."
      ruleNames={['unvirtualized-list', 'child-count']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
