# Dashboard Backlog

| ID  | Title                                                              | Type    | Priority | Status | Depends On |
|-----|--------------------------------------------------------------------|---------|----------|--------|------------|
| D01 | Project setup (Vite + React + TS + Tailwind)                       | infra   | 1        | done   | —          |
| D02 | Engine adapter layer (src/lib/engine.ts)                           | infra   | 1        | ready  | D01        |
| D03 | Rule catalog page (list all rules with metadata)                   | feature | 2        | ready  | D02        |
| D04 | Analysis playground page (JSON input → run engine → show result)   | feature | 2        | ready  | D02        |
| D05 | Result detail view (status badge + metrics table + issue cards)    | feature | 3        | ready  | D04        |
| D06 | Navigation shell (sidebar/topbar linking all pages)                | feature | 3        | ready  | D03, D05   |
