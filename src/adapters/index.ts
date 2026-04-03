/**
 * SpatialProvider adapter — wires extractTree + collectMetrics + analyze together.
 * Posts PerformanceResult to window.__SPATIAL__ after each render.
 *
 * Dev-only: zero overhead in production.
 * No React internals patched — React.Profiler public API only.
 *
 * SOT: CLAUDE.md Integration Adapters; SOT Section 4
 */

import type { PerformanceResult } from '../types'
import { extractTree } from './react'
import { collectMetrics } from './metrics'
import { analyze } from '../engine'
import { createRegistry } from '../rule-registry'
import { createRenderCountRule } from '../rules/render-count'
import { createLayoutShiftRule } from '../rules/layout-shift'
import { createFpsDropRule } from '../rules/fps-drop'
import { createMemoryUsageRule } from '../rules/memory-usage'
import { createChildCountRule } from '../rules/child-count'
import { createPropCountRule } from '../rules/prop-count'
import { createStyleComplexityRule } from '../rules/style-complexity'
import { createInlineStyleCountRule } from '../rules/inline-style-count'

type SpatialGlobal = {
  __SPATIAL__?: { result: PerformanceResult; timestamp: number }
}

function buildDefaultRegistry() {
  const registry = createRegistry()
  registry.register(createRenderCountRule())
  registry.register(createLayoutShiftRule())
  registry.register(createFpsDropRule())
  registry.register(createMemoryUsageRule())
  registry.register(createChildCountRule())
  registry.register(createPropCountRule())
  registry.register(createStyleComplexityRule())
  registry.register(createInlineStyleCountRule())
  return registry
}

/**
 * Returns a render handler function.
 * Call it each time a component renders — it will collect metrics, run the
 * engine, and post the result to globalThis.__SPATIAL__.
 *
 * This is the unit-testable core; SpatialProvider is the JSX wrapper.
 */
export function createSpatialHandler() {
  if (process.env.NODE_ENV === 'production') {
    return () => undefined
  }

  const registry = buildDefaultRegistry()
  let renderCount = 0

  // Minimal stub tree when no real fiber is available (e.g. in tests)
  const stubFiber = { type: 'root', memoizedProps: {}, child: null, sibling: null }

  return function handleRender(fiberRoot?: unknown) {
    renderCount++
    const tree = extractTree(fiberRoot ?? stubFiber)
    const metrics = collectMetrics(renderCount)
    const result = analyze(tree, metrics, registry)
    ;(globalThis as SpatialGlobal).__SPATIAL__ = { result, timestamp: Date.now() }
  }
}

/**
 * Returns the latest PerformanceResult posted by SpatialProvider.
 * Returns null if no result has been posted yet, or in production.
 */
export function useSpatial(): PerformanceResult | null {
  if (process.env.NODE_ENV === 'production') {
    return null
  }
  return (globalThis as SpatialGlobal).__SPATIAL__?.result ?? null
}

/**
 * SpatialProvider React component.
 * Usage (3 lines of setup in the consumer app):
 *   import { SpatialProvider } from 'spatial/adapters'
 *   <SpatialProvider><App /></SpatialProvider>
 *
 * Note: This file is intentionally .ts (not .tsx) — the JSX string below
 * is a comment-level illustration. To use as a real React component, rename
 * to .tsx and uncomment. The engine package has no React peer dependency.
 *
 * Actual React usage:
 *   const handler = createSpatialHandler()
 *   return <React.Profiler id="spatial" onRender={handler}>{children}</React.Profiler>
 */
export const SpatialProvider = null // placeholder — see note above
