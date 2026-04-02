---
id: "001"
title: "Project configuration (tsconfig + vitest)"
type: "infra"
priority: 1
status: "done"
created: "2026-04-02"
sot-section: "Section 5, Step 5"
depends-on: []
---

# Project configuration (tsconfig + vitest)

> SOT Reference: Step 5 — "TypeScript preferred"; Section 2.4 — "No implementation is allowed before test definitions."

## PM Plan

### Problem Definition
**Feature**: TypeScript project configuration with strict mode and vitest test framework setup
**Goal**: Establish compilation and testing infrastructure that all 11 remaining items depend on
**Why needed**: Without `tsconfig.json` (strict mode) and `vitest.config.ts`, TypeScript cannot be compiled and tests cannot be run — these are hard prerequisites for every other work item

### Scope
- `package.json` — TypeScript, vitest, @types/node as devDependencies; npm scripts for `test` and `typecheck`
- `tsconfig.json` — `"strict": true`, `"noEmit": true`, `"moduleResolution": "node"`, `"target": "ES2020"`, `"module": "ESNext"`
- `vitest.config.ts` — test include pattern pointing to `tests/**/*.test.ts`

### Non-goals
- No source implementation code in `src/`
- No linting tooling (ESLint, Prettier)
- No bundler or dev server setup
- No CI/CD pipeline configuration

### Expected Behavior

**Input**: A valid TypeScript file in `src/`
**Expected Output**: `npx tsc --noEmit` exits with code 0

**Input**: Test files in `tests/unit/`
**Expected Output**: `npx vitest --run` discovers and executes them, exits with code reflecting results

### SOT Traceability
- Implements: Step 5 — "TypeScript preferred"
- Constrained by: Section 2.4 — "No implementation allowed before test definitions"
- Constrained by: CLAUDE.md technical constraints — `"strict": true`, pure functions only

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | tsconfig.json exists and has strict mode enabled | Read `tsconfig.json` | `compilerOptions.strict === true` |
| H2 | vitest.config.ts exists and includes test pattern | Read `vitest.config.ts` | includes pattern matching `tests/**/*.test.ts` |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | tsconfig includes all required strict compiler options | Read `tsconfig.json` | `noEmit`, `strict`, `moduleResolution` all present |
| E2 | package.json has vitest and typescript as devDependencies | Read `package.json` | both `typescript` and `vitest` keys present in `devDependencies` |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | tsconfig does NOT allow `any` type (strict enforcement) | `tsconfig.json` without `strict: true` | type errors on implicit `any` usage |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | config files missing entirely | `tsconfig.json` absent | `{ status: "unknown", reason: "tsconfig.json not found" }` |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| checkConfig | `(path: string) => { status: string; reason?: string }` | Used in U1 test — returns unknown if path absent |

### Module Structure
- `package.json` — project manifest with devDependencies and npm scripts
- `tsconfig.json` — TypeScript compiler config with strict mode
- `vitest.config.ts` — vitest test runner configuration

### Data Flow
`tsconfig.json` → `tsc --noEmit` → type-checks `src/**/*.ts`
`vitest.config.ts` → `vitest --run` → discovers and runs `tests/**/*.test.ts`

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, scope limited, non-goals listed, SOT traced |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown — all with explicit inputs/outputs |
| Dev Validation | PASS | No DOM, no randomness, no `any` — config files only, no source code yet |
| Test Coverage | PASS | 6/6 tests pass, 0 skipped, test file covers all config assertions |

Overall: PASS
