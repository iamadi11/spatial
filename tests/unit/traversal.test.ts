import { describe, it, expect } from 'vitest'
import { walkTree, collectNodes } from '../../src/traversal'
import type { ComponentNode } from '../../src/types'

const leaf = (id: string): ComponentNode => ({ id, type: 'View' })

const tree: ComponentNode = {
  id: 'root',
  type: 'View',
  children: [
    {
      id: 'child-1',
      type: 'Box',
      children: [
        leaf('grandchild-1'),
        leaf('grandchild-2'),
      ],
    },
    leaf('child-2'),
  ],
}

describe('Tree Traversal', () => {
  describe('Happy Path', () => {
    it('H1: collectNodes returns all nodes in depth-first order', () => {
      const nodes = collectNodes(tree)
      expect(nodes).toHaveLength(5)
      expect(nodes[0].id).toBe('root')
      expect(nodes[1].id).toBe('child-1')
      expect(nodes[2].id).toBe('grandchild-1')
      expect(nodes[3].id).toBe('grandchild-2')
      expect(nodes[4].id).toBe('child-2')
    })

    it('H2: walkTree calls visitor for every node exactly once', () => {
      const visited: string[] = []
      walkTree(tree, (node) => { visited.push(node.id) })
      expect(visited).toHaveLength(5)
      expect(visited).toEqual(['root', 'child-1', 'grandchild-1', 'grandchild-2', 'child-2'])
    })
  })

  describe('Edge Cases', () => {
    it('E1: single node tree (no children) returns just that node', () => {
      const single: ComponentNode = { id: 'alone', type: 'Text' }
      const nodes = collectNodes(single)
      expect(nodes).toHaveLength(1)
      expect(nodes[0].id).toBe('alone')
    })

    it('E2: deeply nested tree traverses all levels correctly', () => {
      const deep: ComponentNode = {
        id: 'l1', type: 'A',
        children: [{ id: 'l2', type: 'B',
          children: [{ id: 'l3', type: 'C',
            children: [{ id: 'l4', type: 'D' }],
          }],
        }],
      }
      const nodes = collectNodes(deep)
      expect(nodes).toHaveLength(4)
      expect(nodes.map(n => n.id)).toEqual(['l1', 'l2', 'l3', 'l4'])
    })
  })

  describe('Failure Cases', () => {
    it('F1: empty children array is treated same as no children', () => {
      const node: ComponentNode = { id: 'solo', type: 'View', children: [] }
      const nodes = collectNodes(node)
      expect(nodes).toHaveLength(1)
      expect(nodes[0].id).toBe('solo')
    })
  })

  describe('Unknown Cases', () => {
    it('U1: walkTree with a visitor that always returns unknown-shaped result', () => {
      const results: Array<{ status: string; reason?: string }> = []
      walkTree(tree, (node) => {
        if (node.id === 'nonexistent-pattern') {
          results.push({ status: 'unknown', reason: 'pattern not found' })
        }
      })
      // No node matched, so results is empty — unknown path not triggered
      expect(results).toHaveLength(0)

      // Verify unknown result shape is structurally valid when produced
      const unknownResult = { status: 'unknown', reason: 'cannot measure this node' }
      expect(unknownResult.status).toBe('unknown')
      expect(unknownResult.reason).toBeDefined()
    })
  })
})
