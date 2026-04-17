/**
 * 040: index-as-key rule
 * Flags same-type sibling groups where all children have key props
 * and all key values are non-negative integer strings (suggesting key={index}).
 */
import { describe, it, expect } from 'vitest'
import { createIndexAsKeyRule } from '../../../src/rules/index-as-key'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const metrics: PerformanceMetrics = {
  renderCount: 1,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

const rule = createIndexAsKeyRule()

// ── Happy path ────────────────────────────────────────────────────────────────

describe('index-as-key — happy path', () => {
  it('fires when same-type children all have numeric string keys ("0","1","2")', () => {
    const node: ComponentNode = {
      id: 'list',
      type: 'List',
      children: [
        { id: 'a', type: 'Item', props: { key: '0', label: 'first' } },
        { id: 'b', type: 'Item', props: { key: '1', label: 'second' } },
        { id: 'c', type: 'Item', props: { key: '2', label: 'third' } },
      ],
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('index-as-key')
    expect(result.issue?.severity).toBe('warning')
    expect(result.issue?.nodeId).toBe('list')
  })

  it('fires for numeric keys even when they are not consecutive (0, 5, 10)', () => {
    const node: ComponentNode = {
      id: 'grid',
      type: 'Grid',
      children: [
        { id: 'x', type: 'Cell', props: { key: '0' } },
        { id: 'y', type: 'Cell', props: { key: '5' } },
        { id: 'z', type: 'Cell', props: { key: '10' } },
      ],
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(true)
  })
})

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('index-as-key — edge cases', () => {
  it('does NOT fire when keys are stable string IDs (non-numeric)', () => {
    const node: ComponentNode = {
      id: 'list',
      type: 'List',
      children: [
        { id: 'a', type: 'Item', props: { key: 'user-1', label: 'Alice' } },
        { id: 'b', type: 'Item', props: { key: 'user-2', label: 'Bob' } },
        { id: 'c', type: 'Item', props: { key: 'user-3', label: 'Carol' } },
      ],
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire when children lack key props (that is missing-key-prop territory)', () => {
    const node: ComponentNode = {
      id: 'list',
      type: 'List',
      children: [
        { id: 'a', type: 'Item', props: { label: 'first' } },
        { id: 'b', type: 'Item', props: { label: 'second' } },
      ],
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire when children are different types', () => {
    const node: ComponentNode = {
      id: 'mixed',
      type: 'Container',
      children: [
        { id: 'a', type: 'Header', props: { key: '0' } },
        { id: 'b', type: 'Body', props: { key: '1' } },
        { id: 'c', type: 'Footer', props: { key: '2' } },
      ],
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire when only one child of a type exists', () => {
    const node: ComponentNode = {
      id: 'single',
      type: 'Wrapper',
      children: [
        { id: 'a', type: 'Card', props: { key: '0' } },
      ],
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire when SOME keys are numeric and some are not (mixed group)', () => {
    const node: ComponentNode = {
      id: 'mixed-keys',
      type: 'List',
      children: [
        { id: 'a', type: 'Item', props: { key: '0' } },
        { id: 'b', type: 'Item', props: { key: 'item-stable' } },
        { id: 'c', type: 'Item', props: { key: '2' } },
      ],
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })
})

// ── Failure case ──────────────────────────────────────────────────────────────

describe('index-as-key — failure case', () => {
  it('does NOT fire on a node with no children', () => {
    const node: ComponentNode = { id: 'leaf', type: 'Leaf' }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })

  it('does NOT fire when key values are negative integers', () => {
    // Negative integers are not valid React keys from index — skip
    const node: ComponentNode = {
      id: 'list',
      type: 'List',
      children: [
        { id: 'a', type: 'Item', props: { key: '-1' } },
        { id: 'b', type: 'Item', props: { key: '-2' } },
      ],
    }
    const result = rule.detect(node, metrics)
    expect(result.triggered).toBe(false)
  })
})
