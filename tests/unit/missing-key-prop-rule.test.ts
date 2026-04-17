/**
 * Tests for missing-key-prop rule (item 036)
 * Flags parent nodes with 2+ same-type children that all lack key props.
 */
import { describe, it, expect } from 'vitest'
import { createMissingKeyPropRule } from '../../src/rules/missing-key-prop'
import type { ComponentNode, PerformanceMetrics } from '../../src/types'

const METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

describe('missing-key-prop rule', () => {
  const rule = createMissingKeyPropRule()

  // Happy path 1: no issue when children have different types
  it('does not fire when children are all different types', () => {
    const node: ComponentNode = {
      id: 'parent',
      type: 'Parent',
      children: [
        { id: 'c1', type: 'Button' },
        { id: 'c2', type: 'Input' },
        { id: 'c3', type: 'Label' },
      ],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Happy path 2: no issue when same-type children have key props
  it('does not fire when same-type children have key prop', () => {
    const node: ComponentNode = {
      id: 'list',
      type: 'List',
      children: [
        { id: 'i1', type: 'ListItem', props: { key: 'item-1' } },
        { id: 'i2', type: 'ListItem', props: { key: 'item-2' } },
        { id: 'i3', type: 'ListItem', props: { key: 'item-3' } },
      ],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Edge case 1: fires when 2 same-type children have no key
  it('fires when exactly 2 same-type children both lack key prop', () => {
    const node: ComponentNode = {
      id: 'list',
      type: 'List',
      children: [
        { id: 'i1', type: 'ListItem' },
        { id: 'i2', type: 'ListItem' },
      ],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(true)
    expect(result.issue?.rule).toBe('missing-key-prop')
    expect(result.issue?.message).toMatch(/ListItem/)
    expect(result.issue?.nodeId).toBe('list')
    expect(result.issue?.severity).toBe('warning')
  })

  // Edge case 2: fires when 3+ same-type children all lack key
  it('fires when 3 same-type children all lack key prop', () => {
    const node: ComponentNode = {
      id: 'grid',
      type: 'Grid',
      children: [
        { id: 'c1', type: 'Card' },
        { id: 'c2', type: 'Card' },
        { id: 'c3', type: 'Card' },
      ],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(true)
    expect(result.issue?.message).toMatch(/Card/)
  })

  // Edge case 3: only 1 child of a given type — not a list pattern, no issue
  it('does not fire when only 1 child of each type', () => {
    const node: ComponentNode = {
      id: 'p',
      type: 'Parent',
      children: [
        { id: 'c1', type: 'Child' },
      ],
    }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Edge case 4: mixed — some same-type children have keys, some don't — only fires if group ALL lack keys
  it('does not fire when at least one sibling of a type has a key', () => {
    const node: ComponentNode = {
      id: 'list',
      type: 'List',
      children: [
        { id: 'i1', type: 'ListItem', props: { key: 'k1' } },
        { id: 'i2', type: 'ListItem' }, // no key
      ],
    }
    // Mixed — some have keys. Since not ALL lack keys, we don't flag
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Failure case: no children — no issue
  it('returns not triggered when node has no children', () => {
    const node: ComponentNode = { id: 'leaf', type: 'Leaf' }
    const result = rule.detect(node, METRICS)
    expect(result.triggered).toBe(false)
  })

  // Unknown/deterministic: same input always same output
  it('is deterministic — same node always yields same result', () => {
    const node: ComponentNode = {
      id: 'list',
      type: 'List',
      children: [
        { id: 'i1', type: 'Row' },
        { id: 'i2', type: 'Row' },
      ],
    }
    const r1 = rule.detect(node, METRICS)
    const r2 = rule.detect(node, METRICS)
    expect(r1.triggered).toBe(r2.triggered)
    expect(r1.issue?.rule).toBe(r2.issue?.rule)
  })
})
