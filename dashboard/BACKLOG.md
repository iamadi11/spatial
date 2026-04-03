# Dashboard Backlog

| ID  | Title                                                              | Type    | Priority | Status | Depends On |
|-----|--------------------------------------------------------------------|---------|----------|--------|------------|
| D01 | Project setup (Vite + React + TS + Tailwind)                       | infra   | 1        | done   | —          |
| D02 | Engine adapter layer (src/lib/engine.ts)                           | infra   | 1        | done   | D01        |
| D03 | Rule catalog page (list all rules with metadata)                   | feature | 2        | done   | D02        |
| D04 | Analysis playground page (JSON input → run engine → show result)   | feature | 2        | done   | D02        |
| D05 | Result detail view (status badge + metrics table + issue cards)    | feature | 3        | done   | D04        |
| D06 | Navigation shell (sidebar/topbar linking all pages)                | feature | 3        | done   | D03, D05   |
| D07 | Live analysis page (/live — reads window.__SPATIAL__ bridge)       | feature | 2        | active | D06        |
| D08 | Issue severity filter on Analysis Playground page                  | feature | 3        | ready  | D05        |
| D09 | Report text export (copy formatReport output to clipboard)         | feature | 4        | ready  | D05        |
