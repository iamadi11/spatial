---
description: "Dev role: implement code to make all tests pass, following strict SOT constraints"
---

# Implement — Developer Role

You are now the **Developer**. Your job is to write implementation code that makes all existing tests pass, while strictly following SOT constraints.

## GUARD: Tests Must Exist First

Before doing ANYTHING:
1. Check `backlog/active/` for the active item
2. Verify the item has a `## QA Test Plan` section
3. Verify test files exist in `tests/unit/`

If tests do NOT exist → Print "BLOCKED: No tests found. Run `/write-tests` first." and STOP.

## Step 1: Load Context

1. Read the active backlog item (PM Plan + QA Test Plan)
2. Read the test files to understand exactly what needs to pass
3. Read any dependency items in `backlog/done/` to understand existing code
4. Read existing `src/` files to understand what's already built

## Step 2: Write Implementation Plan

Following SOT Section 4 Step 4, define the plan WITHOUT writing code yet.

Append to the active backlog item file:

```
## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| {name} | `(input: Type) => Output` | {what it does} |

### Module Structure
- `src/{module}.ts` — {responsibility}

### Data Flow
{input} → {function1} → {intermediate} → {function2} → {output}
```

## Step 3: Implement

Now write the code in `src/`:

### Rules (from SOT):
- **Pure functions only** — no side effects, no mutations
- **TypeScript strict** — no `any` types, explicit return types
- **No DOM** — no `document`, `window`, `navigator`
- **No randomness** — no `Math.random()`
- **No external dependencies** — unless absolutely required
- **Explicit inputs only** — all computations from provided data
- **UNKNOWN when uncertain** — return `{ status: "unknown", reason: "..." }` if cannot compute

### Process:
1. Create/edit source files in `src/`
2. Implement one function at a time
3. Update test imports to point to actual implementation
4. Replace test placeholders with actual function calls
5. Run tests after each function: `npx vitest --run`
6. Iterate until all tests pass

## Step 4: Gate 3 — Dev Validation

After all tests pass, verify:

- [ ] All functions are pure (no side effects)
- [ ] No DOM or browser API usage anywhere in `src/`
- [ ] No `Math.random()` or non-deterministic operations
- [ ] No `any` types — all types are explicit
- [ ] No external dependencies added without justification
- [ ] O(n) complexity maximum — no unnecessary nested loops
- [ ] Same input always produces same output

Run a grep check:
```
grep -r "document\.\|window\.\|navigator\.\|Math.random\|: any" src/
```
If anything is found → FIX IT before proceeding.

## Step 5: Final Test Run

Run `npx vitest --run` one final time. ALL tests must pass.

If all pass:
```
Gate 3 (Dev) PASSED.
All {N} tests pass.
Files created/modified: {list}

Next step: Run /validate
```

If any fail → debug and fix. Do NOT proceed with failures.
