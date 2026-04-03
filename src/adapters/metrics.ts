import type { PerformanceMetrics } from '../types'

/**
 * Collects a PerformanceMetrics snapshot from live browser APIs.
 * renderCount is injected by the caller (React Profiler owns the count).
 *
 * Dev-only: returns zero metrics in production.
 * Browser APIs used: PerformanceObserver, performance.memory, requestAnimationFrame.
 *
 * SOT: CLAUDE.md Integration Adapters; SOT Section 5.2
 */

const ZERO_METRICS: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

// Module-level accumulators — reset across hot-module reloads via resetMetrics()
let _layoutShiftCount = 0
let _fpsDrop = 0
let _observerAttached = false
let _rafAttached = false

// Target frame duration at 60fps (ms)
const TARGET_FRAME_MS = 1000 / 60

function attachObserver(): void {
  if (_observerAttached) return
  if (typeof PerformanceObserver === 'undefined') return

  try {
    const observer = new PerformanceObserver((list) => {
      _layoutShiftCount += list.getEntries().length
    })
    observer.observe({ type: 'layout-shift', buffered: true } as PerformanceObserverInit)
    _observerAttached = true
  } catch {
    // PerformanceObserver may not support 'layout-shift' in all environments
  }
}

function attachRaf(): void {
  if (_rafAttached) return
  if (typeof requestAnimationFrame === 'undefined') return

  _rafAttached = true
  let lastTime = performance.now()

  const tick = (now: number) => {
    const delta = now - lastTime
    lastTime = now
    if (delta > TARGET_FRAME_MS * 2) {
      // Frame took more than 2x target — count as a drop
      _fpsDrop++
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function readMemoryMB(): number {
  const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
  if (!mem) return 0
  return mem.usedJSHeapSize / 1_048_576
}

export function collectMetrics(renderCount: number): PerformanceMetrics {
  if (process.env.NODE_ENV === 'production') {
    return { ...ZERO_METRICS }
  }

  attachObserver()
  attachRaf()

  return {
    renderCount,
    layoutShifts: _layoutShiftCount,
    fpsDrop: _fpsDrop,
    memoryUsage: readMemoryMB(),
  }
}

/** Reset accumulated counters (useful for testing). */
export function resetMetrics(): void {
  _layoutShiftCount = 0
  _fpsDrop = 0
  _observerAttached = false
  _rafAttached = false
}
