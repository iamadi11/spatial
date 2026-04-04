import { useState } from 'react'
import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { ExampleSection } from '../ExampleSection'

// ── Engine trees ──────────────────────────────────────────────────────────────

const BAD_TREE: ComponentNode = {
  id: 'product-list',
  type: 'ProductList',
  children: Array.from({ length: 200 }, (_, i) => ({
    id: `product-${i}`,
    type: 'ProductItem',
    props: { name: `Product ${i + 1}`, price: i * 10 },
  })),
}
const BAD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

const GOOD_TREE: ComponentNode = {
  id: 'product-list',
  type: 'ProductList',
  children: Array.from({ length: 10 }, (_, i) => ({
    id: `product-${i}`,
    type: 'ProductItem',
    props: { name: `Product ${i + 1}`, price: i * 10 },
  })),
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

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

const ALL_ITEMS = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  name: `Product ${i + 1}`,
  price: `$${((i + 1) * 9.99).toFixed(2)}`,
}))

const PAGE_SIZE = 10

function ProductRow({ name, price, index }: { name: string; price: string; index: number }) {
  return (
    <div className="flex items-center justify-between rounded bg-gray-800 px-3 py-1.5 text-xs">
      <span className="text-gray-400 w-6">{index + 1}</span>
      <span className="flex-1 text-gray-200">{name}</span>
      <span className="text-gray-400">{price}</span>
    </div>
  )
}

function BadDemo() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-red-400/80">
        {ALL_ITEMS.length} items mounted — showing first 8 (scroll to see all)
      </p>
      <div className="h-40 overflow-y-auto space-y-1 pr-1">
        {ALL_ITEMS.map((item, i) => (
          <ProductRow key={item.id} name={item.name} price={item.price} index={i} />
        ))}
      </div>
      <p className="text-xs text-gray-500">{ALL_ITEMS.length} DOM nodes rendered</p>
    </div>
  )
}

function GoodDemo() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(ALL_ITEMS.length / PAGE_SIZE)
  const visible = ALL_ITEMS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="space-y-2">
      <p className="text-xs text-emerald-400/80">
        Showing {PAGE_SIZE} of {ALL_ITEMS.length} — paginated (simulates virtualization)
      </p>
      <div className="space-y-1">
        {visible.map((item, i) => (
          <ProductRow key={item.id} name={item.name} price={item.price} index={page * PAGE_SIZE + i} />
        ))}
      </div>
      <div className="flex items-center gap-2">
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
        <span className="text-xs text-gray-500 ml-auto">{PAGE_SIZE} DOM nodes rendered</span>
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function UnvirtualizedListSection() {
  return (
    <ExampleSection
      title="Unvirtualized List"
      description="Rendering hundreds of list items at once creates hundreds of DOM nodes immediately — even items the user can't see. This causes slow initial render, jank on scroll, and high memory usage. Virtualization (react-window, TanStack Virtual) only renders the visible slice."
      ruleNames={['unvirtualized-list', 'child-count']}
      bad={{ code: BAD_CODE, tree: BAD_TREE, metrics: BAD_METRICS, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, tree: GOOD_TREE, metrics: GOOD_METRICS, demo: <GoodDemo /> }}
    />
  )
}
