---
id: D01
title: "Project setup (Vite + React + TypeScript + Tailwind)"
type: infra
priority: 1
status: done
depends-on: —
---

## PM Plan

**Problem**: The dashboard has no project scaffold. Nothing can be built until Vite, React, TypeScript strict mode, and Tailwind are configured and wiring to the spatial engine is verified.

**Goal**: Scaffold a working Vite + React + TS + Tailwind project inside `dashboard/`. Verify the engine can be imported from `../src/`.

**Scope**: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`.

**Non-goals**: No pages, no components, no logic — just the shell.

**Done when**: `npm run dev` starts without errors and a blank page renders.

## QA Test Plan

| # | Type | Input | Expected Output |
|---|------|-------|-----------------|
| 1 | Happy | `analyze` imported from `@engine/engine` | Is a function |
| 2 | Happy | minimal `ComponentNode` passed to `analyze` | Returns `PerformanceResult` with valid status |
| 3 | Edge | node with `children: []` | Returns result with `issues` array |
| 4 | Edge | node with nested children | Does not crash, returns status |
| 5 | Failure | same input called twice | Deterministic — same status and issue count |
| 6 | Unknown | arbitrary node type | Result has `metrics` object |

Test file: `tests/unit/setup.test.ts` — 6 tests, all passing.

## Implementation Plan

- Project scaffold pre-existed: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/main.tsx`, `src/App.tsx`
- Added `test` block to `vite.config.ts` with `@engine` alias for vitest
- Created `tests/unit/setup.test.ts` with 6 smoke tests verifying engine import and basic analysis

## Validation Report

Date: 2026-04-03

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem, scope, non-goals, done-when all defined |
| QA Validation | PASS | 2 happy, 2 edge, 1 failure, 1 unknown — all passing |
| Dev Validation | PASS | No DOM, no any, pure functions, strict TS |
| Test Coverage | PASS | 6/6 tests pass, no skipped tests |

Overall: PASS
