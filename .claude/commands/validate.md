---
description: "QA + Dev: run all 4 quality gates against the active work item"
---

# Validate — Run All Quality Gates

You are the **Validator**. Your job is to run all 4 mandatory quality gates against the active work item and produce a Validation Report.

## GUARD: Active Item Must Exist

1. Read `backlog/active/` — if empty, print "No active item. Run `/pick-next` first." and STOP.
2. Read the active item file and verify it has PM Plan, QA Test Plan, and Implementation Plan sections.
   - If PM Plan missing → "Run `/plan-feature` first." STOP.
   - If QA Test Plan missing → "Run `/write-tests` first." STOP.
   - If Implementation Plan missing → "Run `/implement` first." STOP.

## Gate 1: PM Validation

Check the `## PM Plan` section:

- [ ] Problem is clearly defined
- [ ] Goal is specific and measurable
- [ ] Scope is explicitly limited
- [ ] Non-goals are listed
- [ ] Expected behavior has concrete input/output examples
- [ ] SOT section traceability is present

## Gate 2: QA Validation

Check the `## QA Test Plan` section:

- [ ] At least 2 happy path test cases defined
- [ ] At least 2 edge case test cases defined
- [ ] At least 1 failure case test case defined
- [ ] At least 1 unknown case (returns `status: "unknown"`) defined
- [ ] All test cases have explicit input AND expected output
- [ ] Test files exist in `tests/unit/`

## Gate 3: Dev Validation

Inspect `src/` files created/modified by this item:

- [ ] All functions are pure (no side effects, no mutations)
- [ ] No DOM or browser API usage (`document`, `window`, `navigator`)
- [ ] No randomness (`Math.random`, `crypto.random`)
- [ ] All types are explicit (no `any`)
- [ ] No unjustified external dependencies
- [ ] O(n) complexity or better
- [ ] Deterministic: same input always produces same output

Run the grep check:
```
grep -r "document\.\|window\.\|navigator\.\|Math\.random\|: any" src/
```
If anything is found → list violations and STOP.

## Gate 4: Test Coverage

Run: `npx vitest --run`

- [ ] Exit code 0 (all tests pass)
- [ ] No skipped or pending tests (`it.skip`, `it.todo`)
- [ ] Every `src/` file modified has at least one corresponding test

## Produce Validation Report

Append to the active backlog item file:

```
## Validation Report

Date: {today's date YYYY-MM-DD}

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS/FAIL | ... |
| QA Validation | PASS/FAIL | ... |
| Dev Validation | PASS/FAIL | ... |
| Test Coverage | PASS/FAIL | ... |

Overall: PASS/FAIL
```

## On Result

If ALL 4 gates pass:
```
All 4 quality gates PASSED.
Item: [{id}] {title}

Next step: Run /release
```

If ANY gate fails:
- List which gates failed with specific reasons
- Print the corrective action (e.g., "Fix: run /implement to address DOM usage in src/engine.ts:42")
- STOP — do NOT proceed to release
