---
id: "034"
title: "className token sprawl detection rule (flag oversized utility-class strings)"
type: rule
priority: 4
status: done
created: 2026-04-09
sot-section: "Section 4.2.2, 7, 12"
depends-on: "005, 006"
---

## PM Plan

**Problem**: `inline-style-count` and `style-complexity` cover the `styles` object on `ComponentNode`, but many React codebases pass large Tailwind / utility strings via `props.className`. Very long class strings increase parse work and obscure which concerns apply — a structural signal similar to inline style bloat, not duplicated by `prop-count` alone.

**Goal**: Add a node-level rule that flags components whose string `className` prop exceeds configurable thresholds for **character length** and/or **whitespace-separated token count** (deterministic split, no CSS parsing).

**Scope**:
- New module `src/rules/classname-token-sprawl.ts` with `createClassnameTokenSprawlRule(options)` (defaults e.g. max tokens 30, max length 400 — tuned in implementation)
- Inspect only `props?.className` when `typeof === 'string'`; trim, split on ASCII whitespace, count tokens; compare to thresholds
- If `className` is missing or non-string → no issue (unknown-style inputs are not guessed)
- Register in dashboard `runAnalysis` + `RULE_CATALOG` + optional `RuleOptions` overrides
- Unit tests in `tests/unit/rules/classname-token-sprawl.test.ts` (happy, edge, failure, non-string className)

**Non-goals**:
- No `classList` or DOM APIs; no parsing of CSS or `@apply`
- No flagging `className` when it is not a string (arrays, objects, clsx output not visible as string — return no issue)
- Does not replace `inline-style-count` or `prop-count`

**Done when**: Rule is registered, tests pass, `npx vitest --run` green, and dashboard catalog lists the rule with documented defaults.

## QA Test Plan

- No `className`, non-string `className`, short strings — no trigger
- Token count and length thresholds exceeded — trigger with descriptive message
- Whitespace-only `className` — no trigger
- Metrics ignored for structural branch

## Implementation Plan

- `src/rules/classname-token-sprawl.ts` — defaults maxTokens 30, maxLength 400
- `dashboard/src/lib/engine.ts` — register + catalog + `RuleOptions`
- Tests: `tests/unit/rules/classname-token-sprawl.test.ts`, adapter catalog count 20

## Validation Report

Date: 2026-04-09

| Gate | Status |
|------|--------|
| PM | PASS |
| QA | PASS |
| Dev | PASS |
| Tests | PASS |

Overall: PASS
