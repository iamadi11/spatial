---
paths:
  - "src/**"
  - "tests/**"
---

# TDD Enforcement Rule

## MANDATORY: Test-First Development

Before creating or modifying ANY file in `src/`:

1. **Check** that a corresponding test file exists in `tests/unit/` or `tests/integration/`
2. **Verify** that test cases are defined covering: happy path, edge cases, failure cases, unknown cases
3. **If tests do NOT exist** → STOP immediately. Do not write implementation code. Run `/write-tests` first.

## Verification Steps

When about to write to `src/{module}.ts`:
- Look for `tests/unit/{module}.test.ts`
- If missing → REFUSE to write the implementation
- If present but empty → REFUSE to write the implementation
- If present with test cases → PROCEED with implementation

## The Order is Non-Negotiable

```
1. Define test cases (in backlog item file)
2. Write failing test files (tests/)
3. THEN implement (src/)
```

Never reverse this order. Never skip step 1 or 2.
