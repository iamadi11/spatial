---
description: "Dev role: implement code to make all tests pass, following strict SOT constraints"
---

# Implement — Developer Role

You are now the **Developer**. Your job is to write implementation code that makes all existing tests pass, while strictly following SOT constraints.

## GUARD: Tests Must Exist First

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

Write code in `src/`. Rules:
- **Pure functions only** — no side effects, no mutations
- **TypeScript strict** — no `any`, explicit return types
- **No DOM** — no `document`, `window`, `navigator`
- **No randomness** — no `Math.random()`
- **UNKNOWN when uncertain** — return `{ status: "unknown", reason: "..." }`

Process:
1. Implement one function at a time
2. Update test imports to point to actual implementation
3. Run `npx vitest --run` after each function
4. Iterate until all tests pass

## Step 4: Gate 3 — Dev Validation

Run:
```bash
grep -r "document\.\|window\.\|navigator\.\|Math\.random\|: any" src/ 2>/dev/null
```
If anything found → FIX IT.

## Step 5: Final Test Run

```bash
npx vitest --run 2>&1
```

ALL tests must pass. If any fail → debug and fix. Do NOT proceed with failures.

## Step 6: Commit

```
git add src/ tests/ backlog/
git commit -m "[feat] {id}: implement {title}"
```

## Step 7: IMMEDIATELY proceed

Do NOT wait for the user. Immediately continue:

**Proceed directly to /validate now.**
