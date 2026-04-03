# Backlog

This is the unified backlog for both the **spatial engine** (numeric IDs) and the **dashboard** (D-prefixed IDs).

## Engine Items

| ID  | Title                                                               | Type    | Priority | Status | SOT Section          | Depends On          |
|-----|---------------------------------------------------------------------|---------|----------|--------|----------------------|---------------------|
| 001 | Project configuration (tsconfig + vitest)                           | infra   | 1        | done   | Section 5, Step 5    | —                   |
| 002 | Core type definitions (ComponentNode + PerformanceResult)           | infra   | 1        | done   | Section 5            | 001                 |
| 003 | Component tree traversal (O(n) walk)                                | infra   | 2        | done   | Section 11           | 002                 |
| 004 | Rule registry (register and execute detection rules)                | infra   | 2        | done   | Section 7            | 002                 |
| 005 | Engine core (metrics pipeline + result aggregation)                 | infra   | 2        | done   | Section 4            | 003, 004            |
| 006 | Unknown/fallback handler (return UNKNOWN when cannot compute)       | infra   | 2        | done   | Section 2.3, 6.1, 9  | 002                 |
| 007 | Render count detection rule (flag excessive re-renders)             | rule    | 3        | done   | Section 6.3, 7       | 005, 006            |
| 008 | Layout shift detection rule (flag layout instability)               | rule    | 3        | done   | Section 6.3, 7       | 005, 006            |
| 009 | FPS drop detection rule (flag frame rate degradation)               | rule    | 3        | done   | Section 5.2, 7       | 005, 006            |
| 010 | Memory usage detection rule (flag memory anomalies)                 | rule    | 3        | done   | Section 5.2, 7       | 005, 006            |
| 011 | Metrics caching layer (cache per render, avoid recomputation)       | perf    | 4        | done   | Section 11           | 005                 |
| 012 | Issue formatting (structured issue output with rule name + reason)  | feature | 5        | done   | Section 5.2, 9       | 007, 008, 009, 010  |
| 013 | Child count detection rule (flag oversized component children)      | rule    | 3        | done   | Section 4.2.2, 7     | 005, 006            |
| 014 | Prop count detection rule (flag prop-heavy components)              | rule    | 3        | done   | Section 4.2.2, 7     | 005, 006            |
| 015 | Style complexity detection rule (flag expensive CSS properties)     | rule    | 3        | done   | Section 4.2.3, 7     | 005, 006            |
| 016 | Nesting depth detection rule (flag deeply nested trees)             | rule    | 4        | done   | Section 4.2.2, 7     | 005, 006            |
| 017 | Total node count detection rule (flag oversized component trees)    | rule    | 3        | done   | Section 4.2.2, 7     | 005, 006            |
| 018 | Inline style count detection rule (flag excessive inline styles)    | rule    | 3        | done   | Section 4.2.2, 7     | 005, 006            |
| 019 | Expand style-complexity property set (accuracy improvement)        | perf    | 4        | done   | Section 12, 4.2.3    | 015                 |
| 020 | Rule catalog (structured metadata export for all built-in rules)   | infra   | 3        | done   | Section 5.2, 7       | 004                 |
| 021 | Report summary formatter (human-readable PerformanceResult text)   | feature | 4        | done   | Section 5.2, 9       | 012                 |
| 022 | React fiber adapter (src/adapters/react.ts)                        | infra   | 1        | done   | Adapters section     | 004, 017            |
| 023 | Metrics adapter (src/adapters/metrics.ts)                          | infra   | 1        | done   | Adapters section     | 022                 |
| 024 | SpatialProvider (src/adapters/index.ts)                            | infra   | 1        | done   | Adapters section     | 022, 023            |
| 025 | Event handler count detection rule (flag excessive event bindings) | rule    | 3        | done   | Section 4.2.2, 7    | 005, 006            |
| 026 | Duplicate component type detection rule (flag repeated types)      | rule    | 3        | done    | Section 4.2.2, 7    | 005, 006            |
| 027 | Large data prop detection rule (flag oversized prop payloads)      | rule    | 3        | done    | Section 4.2.2, 12   | 005, 006            |
| 028 | Unvirtualized list detection rule (flag large same-type sibling groups) | rule | 3    | done   | Section 4.2.2, 7, 12 | 005, 006           |
| 029 | Anonymous component detection rule (flag unnamed component types)  | rule    | 4        | ready  | Section 4.2.2, 7, 12 | 005, 006           |

## Dashboard Items

| ID  | Title                                                              | Type    | Priority | Status | SOT Section    | Depends On |
|-----|--------------------------------------------------------------------|---------|----------|--------|----------------|------------|
| D01 | Project setup (Vite + React + TS + Tailwind)                       | infra   | 1        | done   | Section 16     | —          |
| D02 | Engine adapter layer (dashboard/src/lib/engine.ts)                 | infra   | 1        | done   | Section 16.2   | D01        |
| D03 | Rule catalog page (/rules — list all rules with metadata)          | feature | 2        | done   | Section 16.3   | D02        |
| D04 | Analysis playground page (/analyze — JSON input → engine result)   | feature | 2        | done   | Section 16.3   | D02        |
| D05 | Result detail view (status badge + metrics table + issue cards)    | feature | 3        | done   | Section 16.3   | D04        |
| D06 | Navigation shell (sidebar linking all pages)                       | feature | 3        | done   | Section 16.3   | D03, D05   |
| D07 | Live analysis page (/live — reads window.__SPATIAL__ bridge)       | feature | 2        | done   | Section 16.3   | D06        |
| D08 | Issue severity filter on Analysis Playground page                  | feature | 3        | done   | Section 16.6   | D05        |
| D09 | Report text export (copy formatReport output to clipboard)         | feature | 4        | done   | Section 16.6   | D05        |
| D10 | Rule catalog search and filter (filter rules by name or severity)  | feature | 3        | done   | Section 16.6   | D03        |
| D11 | Metrics bar display (visual metric bars for PerformanceResult)     | feature | 4        | ready  | Section 16.6   | D05        |
