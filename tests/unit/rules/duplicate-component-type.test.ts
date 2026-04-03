import { describe, it, expect } from 'vitest'
import { createDuplicateComponentTypeRule } from '../../../src/rules/duplicate-component-type'
import type { ComponentNode } from '../../../src/types'

/** Build a flat tree: root with N children all of the same type */
function makeFlat(type: string, count: number, rootId = 'root'): ComponentNode {
  return {
    id: rootId,
    type: 'Container',
    children: Array.from({ length: count }, (_, i) => ({
      id: `${type}-${i}`,
      type,
      props: {},
    })),
  }
}

describe('Duplicate Component Type Rule', () => {
  describe('Happy Path', () => {
    // H1: 31 ListItem nodes exceed default threshold (30) → triggers
    it('H1: 31 identical component types exceed threshold → triggers with warning', () => {
      const rule = createDuplicateComponentTypeRule()
      const root = makeFlat('ListItem', 31)
      const result = rule.check(root)
      expect(result).not.toBeNull()
      expect(result!.rule).toBe('duplicate-component-type')
      expect(result!.severity).toBe('warning')
      expect(result!.message).toContain('ListItem')
      expect(result!.message).toContain('31')
    })

    // H2: 5 identical nodes below default threshold → does not trigger
    it('H2: 5 identical component types below threshold → returns null', () => {
      const rule = createDuplicateComponentTypeRule()
      const root = makeFlat('ListItem', 5)
      expect(rule.check(root)).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    // E1: exactly at threshold → does not trigger (> not >=)
    it('E1: exactly at threshold → returns null (> not >=)', () => {
      const rule = createDuplicateComponentTypeRule(10)
      const root = makeFlat('Card', 10)
      expect(rule.check(root)).toBeNull()
    })

    // E2: custom threshold respected
    it('E2: custom threshold=5 triggers with 6 identical types', () => {
      const rule = createDuplicateComponentTypeRule(5)
      const root = makeFlat('Row', 6)
      const result = rule.check(root)
      expect(result).not.toBeNull()
      expect(result!.message).toContain('Row')
    })

    // E3: HTML tag types (lowercase first char) are ignored
    it('E3: HTML tag types (lowercase) are not flagged even at high count', () => {
      const rule = createDuplicateComponentTypeRule(5)
      const root = makeFlat('div', 100)
      expect(rule.check(root)).toBeNull()
    })

    // E4: mixed tree — only the over-threshold component type is flagged
    it('E4: mixed tree flags only the type that exceeds threshold', () => {
      const rule = createDuplicateComponentTypeRule(5)
      const root: ComponentNode = {
        id: 'root',
        type: 'App',
        children: [
          // 6 Row nodes — should be flagged
          ...Array.from({ length: 6 }, (_, i) => ({ id: `r${i}`, type: 'Row' })),
          // 3 Card nodes — below threshold
          ...Array.from({ length: 3 }, (_, i) => ({ id: `c${i}`, type: 'Card' })),
        ],
      }
      const result = rule.check(root)
      expect(result).not.toBeNull()
      expect(result!.message).toContain('Row')
      expect(result!.message).not.toContain('Card')
    })
  })

  describe('Failure Cases', () => {
    // F1: empty tree (no children) → returns null
    it('F1: root with no children → returns null', () => {
      const rule = createDuplicateComponentTypeRule()
      const root: ComponentNode = { id: 'root', type: 'App' }
      expect(rule.check(root)).toBeNull()
    })

    // F2: all different component types → returns null
    it('F2: all unique component types → returns null', () => {
      const rule = createDuplicateComponentTypeRule(2)
      const root: ComponentNode = {
        id: 'root',
        type: 'App',
        children: [
          { id: 'a', type: 'Header' },
          { id: 'b', type: 'Sidebar' },
          { id: 'c', type: 'Content' },
          { id: 'd', type: 'Footer' },
        ],
      }
      expect(rule.check(root)).toBeNull()
    })
  })

  describe('Unknown Cases', () => {
    // U1: rule name is always 'duplicate-component-type'
    it('U1: rule.name is duplicate-component-type', () => {
      const rule = createDuplicateComponentTypeRule()
      expect(rule.name).toBe('duplicate-component-type')
    })

    // U2: deeply nested duplicates are still counted (O(n) full traversal)
    it('U2: nested duplicates across multiple levels are counted', () => {
      const rule = createDuplicateComponentTypeRule(5)
      // Build 6 Row nodes at different nesting levels
      const root: ComponentNode = {
        id: 'root',
        type: 'App',
        children: [
          {
            id: 'level1',
            type: 'Row',
            children: [
              {
                id: 'level2',
                type: 'Row',
                children: [
                  { id: 'r1', type: 'Row' },
                  { id: 'r2', type: 'Row' },
                  { id: 'r3', type: 'Row' },
                  { id: 'r4', type: 'Row' },
                ],
              },
            ],
          },
        ],
      }
      const result = rule.check(root)
      expect(result).not.toBeNull()
      expect(result!.message).toContain('Row')
      expect(result!.message).toContain('6')
    })
  })
})
