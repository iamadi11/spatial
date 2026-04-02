---
id: "012"
title: "Issue formatting (structured issue output with rule name + reason)"
type: "feature"
priority: 5
status: "active"
created: "2026-04-02"
sot-section: "Section 5.2, 9"
depends-on: ["007", "008", "009", "010"]
---

# Issue formatting (structured issue output with rule name + reason)

> SOT Reference: Section 5.2 — '"issues": []'; Section 9 — '"reason": "unsupported input or environment"'; Section 14 — "no ambiguity remains."

## PM Plan

### Problem Definition
**Feature**: Issue formatter — transforms raw `PerformanceIssue[]` into a human-readable, structured summary string
**Goal**: Provide a deterministic, pure function that formats issues for display without ambiguity
**Why needed**: SOT Section 5.2 defines the `issues` array output contract; Section 9 defines the `reason` field; Section 14 requires "no ambiguity remains" — callers need a stable text representation of issues

### Scope
- `src/issue-formatter.ts` — exports `formatIssue(issue: PerformanceIssue) => string` and `formatIssues(issues: PerformanceIssue[]) => string`
- `formatIssue`: single issue → `"[severity] rule: message (node: nodeId)"`
- `formatIssues`: array → newline-joined formatted issues, or `"No issues found."` if empty

### Non-goals
- No colorization, HTML, or UI rendering
- No filtering, sorting, or grouping of issues
- No changes to the `PerformanceIssue` type itself

### Expected Behavior

**Input**:
```ts
[{ rule: 'render-count', severity: 'warning', message: 'Too many renders', nodeId: 'btn-1' }]
```

**Expected Output**:
```ts
formatIssue(issue) // → "[warning] render-count: Too many renders (node: btn-1)"
formatIssues([issue]) // → "[warning] render-count: Too many renders (node: btn-1)"
formatIssues([]) // → "No issues found."
```

### SOT Traceability
- Implements: Section 5.2 — `issues` output contract (rule, severity, message, nodeId)
- Implements: Section 9 — structured output without ambiguity
- Constrained by: Section 14 — "no ambiguity remains"
- Constrained by: Section 2.2 — pure functions, deterministic

## QA Test Plan

### Happy Path
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| H1 | formatIssue with warning severity | `{ rule: 'render-count', severity: 'warning', message: 'Too many renders', nodeId: 'btn' }` | `"[warning] render-count: Too many renders (node: btn)"` |
| H2 | formatIssue with error severity | `{ rule: 'fps-drop', severity: 'error', message: 'FPS drop of 20', nodeId: 'list' }` | `"[error] fps-drop: FPS drop of 20 (node: list)"` |
| H3 | formatIssues with multiple issues | 2-issue array | newline-joined string of both formatted issues |

### Edge Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| E1 | formatIssues with empty array | `[]` | `"No issues found."` |
| E2 | formatIssues with single issue | 1-issue array | single formatted string (no trailing newline) |

### Failure Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| F1 | formatIssue preserves exact message text | issue with special chars in message | message appears verbatim in output |

### Unknown Cases
| # | Description | Input | Expected Output |
|---|-------------|-------|-----------------|
| U1 | formatIssues with issues from unknown result | issues array that is empty (unknown status has no issues) | `"No issues found."` |

## Implementation Plan

### Functions
| Function | Signature | Purpose |
|----------|-----------|---------|
| formatIssue | `(issue: PerformanceIssue) => string` | `"[severity] rule: message (node: nodeId)"` |
| formatIssues | `(issues: PerformanceIssue[]) => string` | Newline-joined list, or `"No issues found."` |

### Module Structure
- `src/issue-formatter.ts` — exports `formatIssue`, `formatIssues`

### Data Flow
`PerformanceIssue` → `formatIssue` → string
`PerformanceIssue[]` → `formatIssues` → joined string or empty message

## Validation Report

Date: 2026-04-02

| Gate | Status | Notes |
|------|--------|-------|
| PM Validation | PASS | Problem defined, scope limited, SOT traced |
| QA Validation | PASS | 3 happy, 2 edge, 1 failure, 1 unknown |
| Dev Validation | PASS | No DOM, no randomness, no `any`, pure functions |
| Test Coverage | PASS | 74/74 tests pass, 0 skipped |

Overall: PASS
