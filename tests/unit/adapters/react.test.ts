import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { ComponentNode } from '../../../src/types'

// Mock fiber shapes for testing — no actual React dependency
type MockFiber = {
  type?: unknown
  memoizedProps?: Record<string, unknown>
  child?: MockFiber | null
  sibling?: MockFiber | null
}

describe('extractTree', () => {
  let extractTree: (fiber: unknown) => ComponentNode

  beforeEach(async () => {
    // Reset module to allow NODE_ENV manipulation
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // Happy path 1: single leaf fiber with a named function component
  it('extracts a single fiber node with type name and props', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')
    extractTree = fn

    const fiber: MockFiber = {
      type: function MyButton() {},
      memoizedProps: { label: 'Click me', disabled: false },
      child: null,
      sibling: null,
    }

    const result = extractTree(fiber)

    expect(result.type).toBe('MyButton')
    expect(result.props).toEqual({ label: 'Click me', disabled: false })
    expect(result.children).toEqual([])
  })

  // Happy path 2: parent with one child via fiber.child
  it('recursively extracts child fibers via fiber.child', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')
    extractTree = fn

    const child: MockFiber = {
      type: 'span',
      memoizedProps: { className: 'text' },
      child: null,
      sibling: null,
    }
    const parent: MockFiber = {
      type: 'div',
      memoizedProps: {},
      child,
      sibling: null,
    }

    const result = extractTree(parent)

    expect(result.type).toBe('div')
    expect(result.children).toHaveLength(1)
    expect(result.children![0].type).toBe('span')
    expect(result.children![0].props).toEqual({ className: 'text' })
  })

  // Happy path 3: siblings are collected as children of their parent
  it('collects siblings as children of the parent node', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')
    extractTree = fn

    const sibling2: MockFiber = { type: 'li', memoizedProps: { key: '2' }, child: null, sibling: null }
    const sibling1: MockFiber = { type: 'li', memoizedProps: { key: '1' }, child: null, sibling: sibling2 }
    const parent: MockFiber = {
      type: 'ul',
      memoizedProps: {},
      child: sibling1,
      sibling: null,
    }

    const result = extractTree(parent)

    expect(result.type).toBe('ul')
    expect(result.children).toHaveLength(2)
    expect(result.children![0].type).toBe('li')
    expect(result.children![1].type).toBe('li')
  })

  // Happy path 4: function props are omitted from extracted props
  it('omits function values from memoizedProps', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')
    extractTree = fn

    const fiber: MockFiber = {
      type: 'button',
      memoizedProps: { onClick: () => {}, label: 'Save', count: 5 },
      child: null,
      sibling: null,
    }

    const result = extractTree(fiber)

    expect(result.props).not.toHaveProperty('onClick')
    expect(result.props).toHaveProperty('label', 'Save')
    expect(result.props).toHaveProperty('count', 5)
  })

  // Edge case 1: HTML tag string type
  it('uses the string directly for HTML tag types', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')
    extractTree = fn

    const fiber: MockFiber = {
      type: 'section',
      memoizedProps: {},
      child: null,
      sibling: null,
    }

    const result = extractTree(fiber)
    expect(result.type).toBe('section')
  })

  // Edge case 2: null or missing type falls back to 'unknown'
  it('falls back to "unknown" when fiber.type is null or undefined', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')
    extractTree = fn

    const fiber: MockFiber = {
      type: undefined,
      memoizedProps: {},
      child: null,
      sibling: null,
    }

    const result = extractTree(fiber)
    expect(result.type).toBe('unknown')
  })

  // Edge case 3: deeply nested tree produces correct ids
  it('generates unique ids for every node in a nested tree', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')
    extractTree = fn

    const grandchild: MockFiber = { type: 'em', memoizedProps: {}, child: null, sibling: null }
    const child: MockFiber = { type: 'p', memoizedProps: {}, child: grandchild, sibling: null }
    const root: MockFiber = { type: 'article', memoizedProps: {}, child, sibling: null }

    const result = extractTree(root)
    const grandchildNode = result.children![0].children![0]

    // ids should all be unique strings
    const ids = [result.id, result.children![0].id, grandchildNode.id]
    expect(new Set(ids).size).toBe(3)
  })

  // Edge case 4: no children / no memoizedProps yields empty arrays/objects
  it('returns empty children and props when fiber has no child and no memoizedProps', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')
    extractTree = fn

    const fiber: MockFiber = { type: 'div', memoizedProps: undefined, child: null, sibling: null }

    const result = extractTree(fiber)
    expect(result.props).toEqual({})
    expect(result.children).toEqual([])
  })

  // Failure case: production guard returns minimal safe node
  it('returns a stub node in production without reading the fiber', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { extractTree: fn } = await import('../../../src/adapters/react')

    const fiber: MockFiber = {
      type: 'div',
      memoizedProps: { secret: 'data' },
      child: null,
      sibling: null,
    }

    const result = fn(fiber)
    expect(result.id).toBe('root')
    expect(result.type).toBe('unknown')
    // should NOT expose any props from the real fiber
    expect(result.props ?? {}).toEqual({})
    expect(result.children ?? []).toEqual([])
  })

  // Unknown case: object fiber with unknown shape still returns ComponentNode
  it('returns a valid ComponentNode even for an unexpected fiber shape', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { extractTree: fn } = await import('../../../src/adapters/react')

    const result = fn({ totally: 'wrong', shape: true })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('type')
    expect(result).toHaveProperty('children')
    expect(Array.isArray(result.children)).toBe(true)
  })
})
