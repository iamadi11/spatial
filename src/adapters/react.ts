import type { ComponentNode } from '../types'

/**
 * Reads a React fiber node (read-only) and returns a ComponentNode tree
 * the core engine can consume.
 *
 * Dev-only: returns a stub in production to avoid any runtime overhead.
 * Never mutates the fiber tree. No React internals are patched.
 *
 * SOT: CLAUDE.md Integration Adapters; SOT Section 5.1
 */

type Fiber = {
  type?: unknown
  memoizedProps?: Record<string, unknown> | null
  child?: Fiber | null
  sibling?: Fiber | null
}

function resolveName(type: unknown): string {
  if (typeof type === 'string') return type
  if (typeof type === 'function' && type.name) return type.name
  return 'unknown'
}

function filterProps(raw: Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (!raw) return {}
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(raw)) {
    if (typeof raw[key] !== 'function') {
      result[key] = raw[key]
    }
  }
  return result
}

function walkFiber(fiber: Fiber, indexPath: string): ComponentNode {
  const children: ComponentNode[] = []

  // Walk child/sibling chain to collect children
  let cursor = fiber.child ?? null
  let siblingIndex = 0
  while (cursor) {
    children.push(walkFiber(cursor, `${indexPath}.${siblingIndex}`))
    cursor = cursor.sibling ?? null
    siblingIndex++
  }

  return {
    id: indexPath,
    type: resolveName(fiber.type),
    props: filterProps(fiber.memoizedProps),
    children,
  }
}

export function extractTree(fiber: unknown): ComponentNode {
  if (process.env.NODE_ENV === 'production') {
    return { id: 'root', type: 'unknown' }
  }

  const f = fiber as Fiber
  // Unknown/malformed fiber — return safe stub
  if (typeof f !== 'object' || f === null) {
    return { id: '0', type: 'unknown', props: {}, children: [] }
  }

  return walkFiber(f, '0')
}
