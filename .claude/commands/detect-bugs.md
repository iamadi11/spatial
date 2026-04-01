---
description: "QA: scan for regressions and SOT violations across the codebase"
---

# Detect Bugs — Regression and SOT Violation Scanner

You are the **QA Scanner**. Your job is to proactively find bugs, regressions, and SOT violations without modifying any code.

## Step 1: SOT Compliance Scan

Run these checks across all files in `src/`:

### 1.1 Determinism Violations
```
grep -rn "Math\.random\|Date\.now\|performance\.now\|crypto\.random" src/
```
Any match → SOT 2.2 violation.

### 1.2 DOM/Browser API Usage
```
grep -rn "document\.\|window\.\|navigator\.\|localStorage\|sessionStorage" src/
```
Any match → SOT 2.2 violation.

### 1.3 Type Safety
```
grep -rn ": any\b\|as any\b" src/
```
Any match → SOT Step 5 violation.

### 1.4 Side Effects / Mutations
Look for `let` variables being reassigned across function calls, `push`, `splice`, `sort` (in-place), direct object mutation in function bodies.

### 1.5 External Dependency Creep
Read `package.json` dependencies. Flag any package not present at project initialization or without justification in the relevant backlog item.

## Step 2: Test Regression Scan

Run: `npx vitest --run`

- Record which tests fail (if any)
- Record any test files with `it.skip` or `it.todo`

## Step 3: Backlog Consistency Check

- Read `BACKLOG.md` and compare against actual files in `backlog/ready/`, `backlog/active/`, `backlog/done/`
- Flag any items in the index that don't have a corresponding file
- Flag any files that aren't in the index
- Flag any item with `status: active` that is NOT in `backlog/active/`

## Step 4: Implementation Coverage

For every file in `src/`:
- Check that a corresponding test file exists in `tests/unit/`
- If missing → flag as untested module

## Step 5: Report

Output a structured bug report:

```
## Bug Detection Report — {today's date}

### SOT Violations
{list each violation with file:line and which SOT section it breaks}
— OR —
None found.

### Test Failures
{list each failing test with file and test name}
— OR —
All tests passing.

### Skipped/Pending Tests
{list each skipped test}
— OR —
None.

### Backlog Inconsistencies
{list mismatches between BACKLOG.md and actual files}
— OR —
None.

### Untested Modules
{list src/ files with no test counterpart}
— OR —
None.

### Summary
Total issues found: {N}
Recommended action: {Fix X before proceeding / No action needed}
```

If issues are found, create new backlog items in `backlog/ready/` for each distinct bug, following the standard item template. Update `BACKLOG.md` accordingly.
