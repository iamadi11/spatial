import { describe, it, expect } from 'vitest'
import { createClassnameTokenSprawlRule } from '../../../src/rules/classname-token-sprawl'
import type { ComponentNode, PerformanceMetrics } from '../../../src/types'

const baseMetrics: PerformanceMetrics = {
  renderCount: 0,
  layoutShifts: 0,
  fpsDrop: 0,
  memoryUsage: 0,
}

describe('classname-token-sprawl rule', () => {
  it('does not trigger when className is missing', () => {
    const rule = createClassnameTokenSprawlRule({ maxTokens: 5, maxLength: 100 })
    const node: ComponentNode = { id: 'a', type: 'div' }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  it('does not trigger when className is not a string', () => {
    const rule = createClassnameTokenSprawlRule({ maxTokens: 5, maxLength: 100 })
    const node: ComponentNode = {
      id: 'b',
      type: 'div',
      props: { className: ['a', 'b'] as unknown as string },
    }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  it('does not trigger for short string className', () => {
    const rule = createClassnameTokenSprawlRule({ maxTokens: 10, maxLength: 200 })
    const node: ComponentNode = {
      id: 'c',
      type: 'div',
      props: { className: 'flex items-center gap-2' },
    }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  it('triggers when token count exceeds threshold', () => {
    const rule = createClassnameTokenSprawlRule({ maxTokens: 5, maxLength: 10_000 })
    const tokens = Array.from({ length: 8 }, (_, i) => `c${i}`).join(' ')
    const node: ComponentNode = {
      id: 'd',
      type: 'Box',
      props: { className: tokens },
    }
    const r = rule.detect(node, baseMetrics)
    expect(r.triggered).toBe(true)
    expect(r.issue?.rule).toBe('classname-token-sprawl')
    expect(r.issue?.message).toMatch(/8 class tokens/)
    expect(r.issue?.nodeId).toBe('d')
  })

  it('triggers when trimmed length exceeds threshold', () => {
    const rule = createClassnameTokenSprawlRule({ maxTokens: 10_000, maxLength: 20 })
    const node: ComponentNode = {
      id: 'e',
      type: 'Box',
      props: { className: 'x'.repeat(25) },
    }
    const r = rule.detect(node, baseMetrics)
    expect(r.triggered).toBe(true)
    expect(r.issue?.message).toMatch(/25 characters/)
  })

  it('treats whitespace-only className as empty — no trigger', () => {
    const rule = createClassnameTokenSprawlRule({ maxTokens: 0, maxLength: 0 })
    const node: ComponentNode = {
      id: 'f',
      type: 'div',
      props: { className: '   \n\t  ' },
    }
    expect(rule.detect(node, baseMetrics).triggered).toBe(false)
  })

  it('ignores metrics (structural rule)', () => {
    const rule = createClassnameTokenSprawlRule({ maxTokens: 2, maxLength: 100 })
    const node: ComponentNode = {
      id: 'g',
      type: 'div',
      props: { className: 'a b c d' },
    }
    const bad: PerformanceMetrics = { renderCount: -1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }
    const r1 = rule.detect(node, baseMetrics)
    const r2 = rule.detect(node, bad)
    expect(r1.triggered).toBe(r2.triggered)
  })
})
