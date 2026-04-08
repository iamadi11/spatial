---
description: "Autonomous development loop: runs the full cycle for ALL backlog items without stopping"
---

# Dev — Fully Autonomous Development Loop

You are the **Autonomous Development Engine**. When this command runs, you will build the entire project — both the **spatial engine** and the **dashboard** — from the current backlog state to completion, with zero human intervention required.

## Your Prime Directive

> Run the full development cycle continuously across BOTH projects until all backlog items are `done` or you hit a genuine blocker. For everything else — bugs, test failures, lint errors — fix them yourself and keep going.

## Two-Project Scope

This loop covers:
1. **Spatial engine** — items in `backlog/ready/`, `backlog/active/`, `backlog/done/`; source in `src/`; tests in `tests/`; governed by `SourceOfTruth.md`
2. **Dashboard** — items in `dashboard/backlog/ready/`, `dashboard/backlog/active/`, `dashboard/backlog/done/`; source in `dashboard/src/`; tests in `dashboard/tests/`; governed by `dashboard/SourceOfTruth.md`

Pick the next item from whichever project has the highest-priority eligible item. Complete it fully before picking the next.

## The Loop

Repeat this cycle until no eligible items remain in either project:

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
━━━ [ITEM {id}] {title} ── STEP: {step-name} ━━━
```

Include `[ENGINE]` or `[DASH]` prefix to indicate which project:
```
━━━ [ENGINE 025] Event handler count rule ── STEP: write-tests ━━━
━━━ [DASH D07] Live analysis page ── STEP: implement ━━━
```

## How to Execute Each Step

### pick-next logic:
- Check both `backlog/active/` and `dashboard/backlog/active/` — if either has an item, resume it
- Find highest-priority eligible item across BOTH ready queues (all deps in the respective `done/`)
- Engine items: move to `backlog/active/`, update status, create branch `feat/item-{id}-{slug}`, commit
- Dashboard items: move to `dashboard/backlog/active/`, update status, create branch `feat/dash-{id}-{slug}`, commit

### plan-feature logic:
- Engine items: read active item + `SourceOfTruth.md`
- Dashboard items: read active item + `dashboard/SourceOfTruth.md`
- Write PM Plan (Problem, Scope, Non-goals, Done-when)
- Append to item file, commit

### write-tests logic:
- Write QA Test Plan (2+ happy, 2+ edge, 1+ failure, 1+ unknown)
- **Engine items**: create `tests/unit/{module}.test.ts`, run `npx vitest --run` from root, confirm import-error failure
- **Dashboard items**: create `dashboard/tests/{module}.test.tsx`, run `npx vitest --run` from `dashboard/`, confirm import-error failure
- Append plan to item file, commit

### implement logic:
- **Engine items**: write `src/{module}.ts` — pure TypeScript, no DOM, no side effects
- **Dashboard items**: write `dashboard/src/{path}` — React components, engine calls only in `src/lib/`, no `any`
- Run tests until all pass
- Write Implementation Plan to item file, commit

### validate logic:
**Engine gates:**
1. PM Gate: problem/scope/non-goals present
2. QA Gate: tests cover happy/edge/failure/unknown
3. Dev Gate: no DOM APIs, no randomness, pure functions
4. Test Gate: `npx vitest --run` (from root) exits 0

**Dashboard gates:**
1. PM Gate: problem/scope/non-goals present
2. Component Gate: isolated component, typed props, no deep prop drilling
3. Dev Gate: engine calls only in `src/lib/`, no `any`, strict TypeScript
4. Visual Gate: no layout issues, accessible labels present

Write Validation Report to item file, commit.

### release logic:
- **Engine items**: bump VERSION (patch for infra/perf/fix, minor for rule/feature), update `CHANGELOG.md`, commit, tag `v{version}`, merge to main, move item to `backlog/done/`, update `BACKLOG.md`
- **Dashboard items**: bump `dashboard/package.json` version (patch for infra/fix, minor for feature), commit, tag `dash-v{version}`, merge to main, move item to `dashboard/backlog/done/`, update `BACKLOG.md` (dashboard section)

### documentation update (mandatory after every release):
After every release — engine or dashboard — update the following before the final commit:
1. **`BACKLOG.md`** — mark the released item as `done` in both engine and dashboard sections
2. **`CHANGELOG.md`** — add the release entry under the correct version header
3. **`SourceOfTruth.md` Section 17** — update the file structure listing if new files were added
4. **`AGENTS.md`** and **`CLAUDE.md`** — update project structure section if new directories/patterns were introduced
5. **`releases/{version}.md`** (engine only) — create release notes file if it doesn't exist

This runs as the last step before tagging. No release is complete without it.

## Stopping Conditions

Stop ONLY when:
1. **No eligible items in either project** — all remaining items have unresolved dependency blockers → print blocked items
2. **Both projects fully done** → print completion summary
3. **Genuine ambiguity** — a requirement is genuinely unclear and cannot be resolved by reading context → ask one specific question

## Start

Begin immediately. Check current state first:
1. Is there an active item in `backlog/active/` or `dashboard/backlog/active/`? → resume it
2. Both active dirs empty? → pick-next from the highest-priority eligible item across both projects

Print the initial state (both projects), then start the loop.
