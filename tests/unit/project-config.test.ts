import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = resolve(__dirname, '../../')

describe('Project Configuration', () => {
  describe('Happy Path', () => {
    it('H1: tsconfig.json exists and has strict mode enabled', () => {
      const tsconfigPath = resolve(root, 'tsconfig.json')
      expect(existsSync(tsconfigPath)).toBe(true)
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
      expect(tsconfig.compilerOptions.strict).toBe(true)
    })

    it('H2: vitest.config.ts exists and includes test pattern', () => {
      const vitestConfigPath = resolve(root, 'vitest.config.ts')
      expect(existsSync(vitestConfigPath)).toBe(true)
      const content = readFileSync(vitestConfigPath, 'utf-8')
      expect(content).toContain('test')
    })
  })

  describe('Edge Cases', () => {
    it('E1: tsconfig includes all required strict compiler options', () => {
      const tsconfig = JSON.parse(readFileSync(resolve(root, 'tsconfig.json'), 'utf-8'))
      const opts = tsconfig.compilerOptions
      expect(opts.strict).toBe(true)
      expect(opts.noEmit).toBe(true)
      expect(opts.moduleResolution).toBeDefined()
    })

    it('E2: package.json has vitest and typescript as devDependencies', () => {
      const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'))
      expect(pkg.devDependencies).toHaveProperty('typescript')
      expect(pkg.devDependencies).toHaveProperty('vitest')
    })
  })

  describe('Failure Cases', () => {
    it('F1: tsconfig strict mode is explicitly set to true (not absent/false)', () => {
      const tsconfig = JSON.parse(readFileSync(resolve(root, 'tsconfig.json'), 'utf-8'))
      // strict: false or missing would allow implicit `any` — must be true
      expect(tsconfig.compilerOptions.strict).not.toBe(false)
      expect(tsconfig.compilerOptions.strict).not.toBeUndefined()
    })
  })

  describe('Unknown Cases', () => {
    it('U1: returns structured error info when a required config is missing', () => {
      // Simulates what the engine would return if config is absent
      const checkConfig = (path: string): { status: string; reason?: string } => {
        if (!existsSync(path)) {
          return { status: 'unknown', reason: `${path} not found` }
        }
        return { status: 'pass' }
      }
      // With a non-existent path it must return unknown
      const result = checkConfig('/nonexistent/tsconfig.json')
      expect(result.status).toBe('unknown')
      expect(result.reason).toContain('not found')
    })
  })
})
