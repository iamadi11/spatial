---
description: "QA + Dev: run all 4 quality gates against the active work item"
---

# Validate — Run All Quality Gates

You are the **Validator**. Run all 4 mandatory quality gates and produce a Validation Report.

## GUARD

Read `backlog/active/`. If empty → "No active item." STOP.
Verify PM Plan, QA Test Plan, and Implementation Plan sections exist.

## Gate 1: PM Validation

Check `## PM Plan` section:
- [ ] Problem clearly defined
- [ ] Goal specific and measurable
- [ ] Scope explicitly limited
- [ ] Non-goals listed
- [ ] Expected behavior with concrete input/output
- [ ] SOT traceability present

## Gate 2: QA Validation

Check `## QA Test Plan` section:
- [ ] 2+ happy path cases
- [ ] 2+ edge cases
- [ ] 1+ failure case
- [ ] 1+ unknown case (`status: "unknown"`)
- [ ] All test cases have explicit input AND expected output
- [ ] Test files exist in `tests/unit/`

## Gate 3: Dev Validation

Run:
```bash
grep -r "document\.\|window\.\|navigator\.\|Math\.random\|: any" src/ 2>/dev/null
```
- [ ] No DOM/browser API usage
- [ ] No randomness
- [ ] No `any` types
- [ ] All functions are pure
- [ ] O(n) complexity or better

## Gate 4: Test Coverage

Run:
```bash
npx vitest --run 2>&1
```
- [ ] Exit code 0 (all tests pass)
- [ ] No skipped tests
- [ ] Every modified `src/` file has a test file

## Produce Validation Report

Append to the active backlog item:

```
## Validation Report

Date: {YYYY-MM-DD}

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS/FAIL | ... |
| QA Validation | PASS/FAIL | ... |
| Dev Validation | PASS/FAIL | ... |
| Test Coverage | PASS/FAIL | ... |

Overall: PASS/FAIL
```

## Commit

```
git add backlog/
git commit -m "[validate] {id}: all gates pass"
```

## On Result

If ALL 4 gates pass → **Proceed directly to /release now.**

If ANY gate fails → list what failed, fix it inline (re-run implement/write-tests as needed), then re-validate. Do NOT ask the user — fix it yourself.
