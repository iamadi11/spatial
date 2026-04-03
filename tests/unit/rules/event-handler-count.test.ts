import { describe, it, expect } from 'vitest'
import { createEventHandlerCountRule } from '../../../src/rules/event-handler-count'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 10 }

describe('Event Handler Count Rule', () => {
  describe('Happy Path', () => {
    // H1: node with more function props than threshold → triggers
    it('H1: node with 6 function props exceeds default threshold (5) → triggers', () => {
      const rule = createEventHandlerCountRule()
      const node: ComponentNode = {
        id: 'form',
        type: 'Form',
        props: {
          onClick: () => {},
          onChange: () => {},
          onSubmit: () => {},
          onFocus: () => {},
          onBlur: () => {},
          onKeyDown: () => {},
        },
      }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(true)
      expect(result.issue).toBeDefined()
      expect(result.issue?.rule).toBe('event-handler-count')
      expect(result.issue?.severity).toBe('warning')
      expect(result.issue?.nodeId).toBe('form')
      expect(result.issue?.message).toContain('6')
    })

    // H2: node with fewer function props than threshold → does not trigger
    it('H2: node with 2 function props below default threshold → does not trigger', () => {
      const rule = createEventHandlerCountRule()
      const node: ComponentNode = {
        id: 'btn',
        type: 'Button',
        props: { onClick: () => {}, onFocus: () => {}, label: 'Save' },
      }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(false)
      expect(result.issue).toBeUndefined()
    })
  })

  describe('Edge Cases', () => {
    // E1: exactly at threshold → does not trigger (> not >=)
    it('E1: exactly at threshold → does not trigger', () => {
      const rule = createEventHandlerCountRule(5)
      const node: ComponentNode = {
        id: 'n',
        type: 'C',
        props: {
          onClick: () => {},
          onChange: () => {},
          onSubmit: () => {},
          onFocus: () => {},
          onBlur: () => {},
        },
      }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(false)
    })

    // E2: custom threshold respected
    it('E2: custom threshold of 2 triggers with 3 handlers', () => {
      const rule = createEventHandlerCountRule(2)
      const node: ComponentNode = {
        id: 'n',
        type: 'C',
        props: { onClick: () => {}, onChange: () => {}, onBlur: () => {} },
      }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(true)
    })

    // E3: non-function props are not counted
    it('E3: non-function props do not count toward handler total', () => {
      const rule = createEventHandlerCountRule(2)
      const node: ComponentNode = {
        id: 'n',
        type: 'C',
        props: { label: 'text', count: 5, active: true, onClick: () => {} },
      }
      const result = rule.detect(node, baseMetrics)
      // only 1 function prop — below threshold of 2
      expect(result.triggered).toBe(false)
    })
  })

  describe('Failure Cases', () => {
    // F1: node with no props → does not trigger
    it('F1: node with no props → does not trigger', () => {
      const rule = createEventHandlerCountRule()
      const node: ComponentNode = { id: 'n', type: 'div' }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(false)
    })

    // F2: node with empty props object → does not trigger
    it('F2: node with empty props object → does not trigger', () => {
      const rule = createEventHandlerCountRule()
      const node: ComponentNode = { id: 'n', type: 'div', props: {} }
      const result = rule.detect(node, baseMetrics)
      expect(result.triggered).toBe(false)
    })
  })

  describe('Unknown Cases', () => {
    // U1: rule name is always 'event-handler-count'
    it('U1: rule name is event-handler-count', () => {
      const rule = createEventHandlerCountRule()
      expect(rule.name).toBe('event-handler-count')
    })
  })
})
