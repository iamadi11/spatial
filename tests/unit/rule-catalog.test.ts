import { describe, it, expect } from 'vitest'
import { createRuleCatalog } from '../../src/rule-catalog'

describe('createRuleCatalog', () => {
  // Happy path 1: returns an array
  it('returns a non-empty array', () => {
    const catalog = createRuleCatalog()
    expect(Array.isArray(catalog)).toBe(true)
    expect(catalog.length).toBeGreaterThan(0)
  })

  // Happy path 2: covers all 10 rules
  it('contains exactly 10 entries — one per built-in rule', () => {
    const catalog = createRuleCatalog()
    expect(catalog).toHaveLength(10)
  })

  // Happy path 3: each entry has required fields
  it('every entry has name, description, and severity', () => {
    const catalog = createRuleCatalog()
    for (const entry of catalog) {
      expect(typeof entry.name).toBe('string')
      expect(entry.name.length).toBeGreaterThan(0)
      expect(typeof entry.description).toBe('string')
      expect(entry.description.length).toBeGreaterThan(0)
      expect(['warning', 'error']).toContain(entry.severity)
    }
  })

  // Happy path 4: all known rule names are present
  it('includes all expected rule names', () => {
    const catalog = createRuleCatalog()
    const names = catalog.map((e) => e.name)
    expect(names).toContain('render-count')
    expect(names).toContain('layout-shift')
    expect(names).toContain('fps-drop')
    expect(names).toContain('memory-usage')
    expect(names).toContain('child-count')
    expect(names).toContain('prop-count')
    expect(names).toContain('style-complexity')
    expect(names).toContain('inline-style-count')
    expect(names).toContain('nesting-depth')
    expect(names).toContain('total-node-count')
  })

  // Edge case 1: rules with thresholds have numeric defaultThreshold
  it('threshold rules have a numeric defaultThreshold', () => {
    const catalog = createRuleCatalog()
    const thresholdRules = ['render-count', 'layout-shift', 'fps-drop', 'memory-usage',
      'child-count', 'prop-count', 'inline-style-count', 'nesting-depth', 'total-node-count']
    for (const name of thresholdRules) {
      const entry = catalog.find((e) => e.name === name)
      expect(entry).toBeDefined()
      expect(typeof entry?.defaultThreshold).toBe('number')
      expect((entry?.defaultThreshold ?? -1)).toBeGreaterThan(0)
    }
  })

  // Edge case 2: style-complexity has no numeric threshold (uses a property set instead)
  it('style-complexity has no defaultThreshold (uses a property set)', () => {
    const catalog = createRuleCatalog()
    const entry = catalog.find((e) => e.name === 'style-complexity')
    expect(entry).toBeDefined()
    expect(entry?.defaultThreshold).toBeUndefined()
  })

  // Edge case 3: no duplicate names
  it('has no duplicate rule names', () => {
    const catalog = createRuleCatalog()
    const names = catalog.map((e) => e.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })

  // Failure case: returns the same value on repeated calls (pure/deterministic)
  it('is deterministic — same output on every call', () => {
    const a = createRuleCatalog()
    const b = createRuleCatalog()
    expect(a.length).toBe(b.length)
    for (let i = 0; i < a.length; i++) {
      expect(a[i].name).toBe(b[i].name)
      expect(a[i].severity).toBe(b[i].severity)
      expect(a[i].defaultThreshold).toBe(b[i].defaultThreshold)
    }
  })

  // Unknown: catalog entries do not contain any computed/dynamic values
  it('catalog entries are plain objects — no functions or undefined required fields', () => {
    const catalog = createRuleCatalog()
    for (const entry of catalog) {
      expect(typeof entry).toBe('object')
      expect(typeof entry.name).not.toBe('function')
      expect(typeof entry.description).not.toBe('function')
    }
  })
})
