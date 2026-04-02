# Backlog

| ID  | Title                                                          | Type    | Priority | Status | SOT Section          | Depends On          |
|-----|----------------------------------------------------------------|---------|----------|--------|----------------------|---------------------|
| 001 | Project configuration (tsconfig + vitest)                      | infra   | 1        | done   | Section 5, Step 5    | —                   |
| 002 | Core type definitions (ComponentNode + PerformanceResult)      | infra   | 1        | done   | Section 5            | 001                 |
| 003 | Component tree traversal (O(n) walk)                           | infra   | 2        | active  | Section 11           | 002                 |
| 004 | Rule registry (register and execute detection rules)           | infra   | 2        | done    | Section 7            | 002                 |
| 005 | Engine core (metrics pipeline + result aggregation)            | infra   | 2        | done    | Section 4            | 003, 004            |
| 006 | Unknown/fallback handler (return UNKNOWN when cannot compute)  | infra   | 2        | done    | Section 2.3, 6.1, 9  | 002                 |
| 007 | Render count detection rule (flag excessive re-renders)        | rule    | 3        | done    | Section 6.3, 7       | 005, 006            |
| 008 | Layout shift detection rule (flag layout instability)          | rule    | 3        | done    | Section 6.3, 7       | 005, 006            |
| 009 | FPS drop detection rule (flag frame rate degradation)          | rule    | 3        | done    | Section 5.2, 7       | 005, 006            |
| 010 | Memory usage detection rule (flag memory anomalies)            | rule    | 3        | ready  | Section 5.2, 7       | 005, 006            |
| 011 | Metrics caching layer (cache per render, avoid recomputation)  | perf    | 4        | ready  | Section 11           | 005                 |
| 012 | Issue formatting (structured issue output with rule name)      | feature | 5        | ready  | Section 5.2, 9       | 007, 008, 009, 010  |
