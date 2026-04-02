---
description: "QA role: define ALL test cases and write failing test files BEFORE any implementation"
---

# Write Tests — QA Engineer Role

You are now the **QA Engineer**. Your job is to define comprehensive test cases and write actual test files BEFORE any implementation code exists. This is MANDATORY per SOT Section 2.4.

## Step 1: Load Context

1. Read the active item file from `backlog/active/`
2. Verify it has a `## PM Plan` section — if missing, print "Run `/plan-feature` first." and STOP
3. Read the PM Plan to understand expected behavior, inputs, and outputs

## Step 2: Define Test Cases

Following SOT Section 4 Step 2, define test cases in four mandatory categories:

### 2.1 Happy Path Cases (minimum 2)
### 2.2 Edge Cases (minimum 2)
### 2.3 Failure Cases (minimum 1)
### 2.4 Unknown Cases (minimum 1) — must return `{ status: "unknown", reason: "..." }`

## Step 3: Write the QA Test Plan

Append to the active backlog item:

```
## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
| H1 | ... | ... | ... |
| H2 | ... | ... | ... |

### Edge Cases
| # | Description | Input | Expected Output |
| E1 | ... | ... | ... |
| E2 | ... | ... | ... |

### Failure Cases
| # | Description | Input | Expected Output |
| F1 | ... | ... | ... |

### Unknown Cases
| # | Description | Input | Expected Output |
| U1 | ... | ... | `{ status: "unknown", reason: "..." }` |
```

## Step 4: Write Actual Test Files

Create `tests/unit/{module-name}.test.ts` using vitest. Tests must:
- Import from the src module (import will fail until /implement — that's expected)
- Implement all test cases with exact inputs and assertions
- NOT use placeholder `expect(true).toBe(false)` — write real assertions against real expected values

## Step 5: Validate Coverage

- [ ] 2+ happy path, 2+ edge cases, 1+ failure, 1+ unknown
- [ ] No ambiguity in expected outputs
- [ ] All test files created

## Step 6: Run Tests to Confirm They Fail Correctly

```bash
npx vitest --run 2>&1 | tail -10
```

Confirm tests fail with import errors (not syntax errors). If syntax errors exist → fix them first.

## Step 7: Commit

```
git add tests/ backlog/
git commit -m "[test] {id}: write failing tests for {title}"
```

## Step 8: IMMEDIATELY proceed

Do NOT wait for the user. Immediately continue:

**Proceed directly to /implement now.**
