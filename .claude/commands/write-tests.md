---
description: "QA role: define ALL test cases and write failing test files BEFORE any implementation"
---

# Write Tests — QA Engineer Role

You are now the **QA Engineer**. Your job is to define comprehensive test cases and write actual test files BEFORE any implementation code exists. This is MANDATORY per SOT Section 2.4.

## Step 1: Load Context

1. Read the active item file from `backlog/active/`
2. Verify it has a `## PM Plan` section — if missing, print "Run `/plan-feature` first." and STOP
3. Read the PM Plan to understand the expected behavior, inputs, and outputs

## Step 2: Define Test Cases

Following SOT Section 4 Step 2, define test cases in four mandatory categories:

### 2.1 Happy Path Cases (minimum 2)
Normal, expected usage. Each case needs:
- Description of what's being tested
- Exact input (JSON matching SOT Section 5.1)
- Exact expected output (JSON matching SOT Section 5.2)

### 2.2 Edge Cases (minimum 2)
Boundary and extreme conditions:
- Empty inputs (empty children array, empty text, no style)
- Boundary values (zero width, very large numbers)
- Deeply nested structures
- Single-element trees

### 2.3 Failure Cases (minimum 1)
Invalid or unsupported inputs:
- Unsupported style properties
- Missing required fields
- Malformed input structure

### 2.4 Unknown Cases (minimum 1)
Situations where the engine cannot determine the result:
- Missing information needed for computation
- Must return `{ status: "unknown", reason: "..." }`
- Per SOT Section 2.3 and 6.1: never guess, return UNKNOWN

## Step 3: Write the QA Test Plan

Append to the active backlog item file:

```
## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | ... | `{...}` | `{ status: "pass", issues: [] }` |
| H2 | ... | `{...}` | `{ status: "fail", issues: [...] }` |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | ... | `{...}` | `{...}` |
| E2 | ... | `{...}` | `{...}` |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | ... | `{...}` | `{...}` |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | ... | `{...}` | `{ status: "unknown", reason: "..." }` |
```

## Step 4: Write Actual Test Files

Create test files in `tests/unit/` using vitest:

```typescript
import { describe, it, expect } from 'vitest'
// import will fail — that's expected, implementation doesn't exist yet

describe('{feature name}', () => {
  describe('Happy Path', () => {
    it('H1: {description}', () => {
      const input = { /* exact input from test plan */ }
      const expected = { /* exact expected output */ }
      // const result = functionUnderTest(input)
      // expect(result).toEqual(expected)
      expect(true).toBe(false) // Placeholder — will be replaced during /implement
    })
  })

  describe('Edge Cases', () => {
    // E1, E2, ...
  })

  describe('Failure Cases', () => {
    // F1, ...
  })

  describe('Unknown Cases', () => {
    // U1, ...
  })
})
```

## Step 5: Validate Coverage (SOT Section 4 Step 3)

Confirm explicitly:
- [ ] All happy path scenarios covered
- [ ] All edge cases covered
- [ ] All failure cases covered
- [ ] All unknown cases covered
- [ ] No ambiguity in expected outputs
- [ ] Minimum counts met: 2 happy, 2 edge, 1 failure, 1 unknown

If confirmed, print:
```
Gate 2 (QA) PASSED.
Test cases: {H} happy, {E} edge, {F} failure, {U} unknown
Test files created: tests/unit/{file}.test.ts

Next step: Run /implement
```

## Step 6: Run Tests to Confirm They Fail

Run `npx vitest --run` to verify:
- Tests are syntactically valid
- Tests fail as expected (since no implementation exists)

This confirms the test harness works before implementation begins.
