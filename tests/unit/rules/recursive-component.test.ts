/**
 * 039: recursive-component rule
 * Flags a PascalCase component type that appears in its own ancestor chain.
 */
import { describe, it, expect } from 'vitest'
import { createRecursiveComponentRule } from '../../../src/rules/recursive-component'
import type { ComponentNode } from '../../../src/types'

const rule = createRecursiveComponentRule()

// ── Happy path ────────────────────────────────────────────────────────────────

describe('recursive-component — happy path', () => {
  it('fires when a PascalCase type appears as its own direct child', () => {
    const tree: ComponentNode = {
      id: 'tree-root',
      type: 'TreeNode',
      children: [
        { id: 'tree-child', type: 'TreeNode' },
      ],
    }
    const result = rule.check(tree)
    expect(result).not.toBeNull()
    expect(result?.rule).toBe('recursive-component')
    expect(result?.nodeId).toBe('tree-child')
    expect(result?.severity).toBe('warning')
  })

  it('fires when the same type appears two levels deep (A → B → A)', () => {
    const tree: ComponentNode = {
      id: 'a-outer',
      type: 'ComponentA',
      children: [
        {
          id: 'b-middle',
          type: 'ComponentB',
          children: [
            { id: 'a-inner', type: 'ComponentA' },
          ],
        },
      ],
    }
    const result = rule.check(tree)
    expect(result).not.toBeNull()
    expect(result?.nodeId).toBe('a-inner')
  })
})

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('recursive-component — edge cases', () => {
  it('returns null for a non-recursive tree with unique PascalCase types', () => {
    const tree: ComponentNode = {
      id: 'app',
      type: 'App',
      children: [
        {
          id: 'header',
          type: 'Header',
          children: [{ id: 'nav', type: 'Nav' }],
        },
      ],
    }
    expect(rule.check(tree)).toBeNull()
  })

  it('returns null for a tree with only lowercase (DOM) types, even if repeated', () => {
    const tree: ComponentNode = {
      id: 'div-1',
      type: 'div',
      children: [
        {
          id: 'div-2',
          type: 'div',
          children: [
            { id: 'div-3', type: 'div' },
          ],
        },
      ],
    }
    expect(rule.check(tree)).toBeNull()
  })

  it('returns null when same PascalCase type appears as siblings (not ancestor)', () => {
    const tree: ComponentNode = {
      id: 'parent',
      type: 'Parent',
      children: [
        { id: 'card-1', type: 'Card' },
        { id: 'card-2', type: 'Card' },
        { id: 'card-3', type: 'Card' },
      ],
    }
    expect(rule.check(tree)).toBeNull()
  })

  it('returns null for a single root node with no children', () => {
    const tree: ComponentNode = { id: 'root', type: 'App' }
    expect(rule.check(tree)).toBeNull()
  })
})

// ── Failure case ──────────────────────────────────────────────────────────────

describe('recursive-component — failure case', () => {
  it('returns null when only lowercase types repeat (not PascalCase)', () => {
    const tree: ComponentNode = {
      id: 'wrapper',
      type: 'Wrapper',
      children: [
        {
          id: 'p-1',
          type: 'p',
          children: [
            { id: 'span-1', type: 'span' },
          ],
        },
      ],
    }
    // 'Wrapper' doesn't repeat, only DOM elements do
    expect(rule.check(tree)).toBeNull()
  })

  it('does not fire on the root node type itself (only checks descendants)', () => {
    // The root can't be "inside itself" — only a descendant can be recursive
    const tree: ComponentNode = { id: 'node', type: 'TreeNode' }
    expect(rule.check(tree)).toBeNull()
  })
})
