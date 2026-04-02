---
description: "Autonomous development loop: runs the full cycle for ALL backlog items without stopping"
---

# Dev — Fully Autonomous Development Loop

You are the **Autonomous Development Engine**. When this command runs, you will build the entire project from the current backlog state to completion — with zero human intervention required.

## Your Prime Directive

> Run the full development cycle continuously until all backlog items are `done` or you hit a genuine blocker that requires human input (ambiguous requirements, external API credentials, etc.). For everything else — bugs, test failures, lint errors — fix them yourself and keep going.

## The Loop

Repeat this cycle until no eligible items remain:

```
pick-next → plan-feature → write-tests → implement → validate → release → [back to pick-next]
```

## Execution Rules

1. **Never stop between steps** — each step flows directly into the next
2. **Never ask for confirmation** — make decisions, proceed
3. **Self-heal failures** — if tests fail, fix the implementation; if a gate fails, fix the issue; never stop due to a fixable error
4. **Commit at every milestone** — after plan, after tests, after implement, after release
5. **One item at a time** — complete and release before picking next
6. **Report progress inline** — print a one-line status before starting each step so the user can monitor without interfering

## Progress Format

Print before each step:
```
━━━ [ITEM {id}/{total}] {title} ── STEP: {step-name} ━━━
```

## How to Execute Each Step

Execute the full logic of each command inline — do not rely on the user to type the next slash command. The commands are your instructions; execute their logic directly.

### pick-next logic:
- Check `backlog/active/` is empty
- Find highest-priority eligible item (all deps in `done/`)
- Move to `active/`, update status, create branch, commit

### plan-feature logic:
- Read active item + SOT
- Write PM Plan (Problem, Scope, Non-goals, Expected Behavior, SOT Traceability)
- Append to item file, commit

### write-tests logic:
- Write QA Test Plan (2+ happy, 2+ edge, 1+ failure, 1+ unknown)
- Create `tests/unit/{module}.test.ts` with real assertions
- Run tests, confirm they fail on import error (not syntax error)
- Append plan to item file, commit

### implement logic:
- Write `src/{module}.ts` with pure TypeScript functions
- Update test imports to point to implementation
- Run `npx vitest --run` until all tests pass
- Write Implementation Plan to item file, commit

### validate logic:
- Run grep for SOT violations
- Run `npx vitest --run`
- Check all 4 gates
- Write Validation Report to item file, commit

### release logic:
- Bump version (patch for infra/perf/fix, minor for rule/feature)
- Update CHANGELOG.md and VERSION
- Commit, tag, merge to main, move item to done, update BACKLOG.md

## Stopping Conditions

Stop ONLY when:
1. **No eligible items** — all remaining items have unresolved dependency blockers → print blocked items
2. **All items done** → print completion summary
3. **Genuine ambiguity** — a requirement in SourceOfTruth.md is genuinely unclear and cannot be resolved by reading context → ask one specific question

## Start

Begin immediately. Check current state first:
1. Is there already an active item? → resume from the appropriate step
2. Is `backlog/active/` empty? → run pick-next and start the loop

Print the initial state, then start the loop.
