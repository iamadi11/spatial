# Spatial — AI Development Instructions

## Project Identity

**Product**: A deterministic dev-time UI performance detection engine that integrates into real React projects with ≤ 3 lines of setup code.

**Governance**: `SourceOfTruth.md` is the IMMUTABLE product governance document. Never modify it. Always comply with it.

**Reuse**: To adapt this system for a different project, replace `SourceOfTruth.md` and update this "Project Identity" section. Everything else adapts automatically.

---

## Autonomous Development Workflow

### The One Command You Need

```
/dev
```

This runs the **entire development loop** — pick-next → plan → write-tests → implement → validate → release — continuously until all backlog items are done. No other input required.

### Bootstrap (first time only)

```
/kickoff   ← decomposes SourceOfTruth.md into backlog items (run once)
/dev       ← builds everything from there
```

### All Commands

| Command | Role | Purpose |
|---------|------|---------|
| `/dev` | **Autonomous loop** | **Full cycle, runs until all items done** |
| `/kickoff` | Bootstrap | One-time: decompose SOT into backlog items |
| `/pick-next` | Orchestrator | Select next item (chains into plan automatically) |
| `/plan-feature` | PM | Define problem, scope, non-goals (chains into write-tests) |
| `/write-tests` | QA | Write failing tests (chains into implement) |
| `/implement` | Developer | Write code to pass tests (chains into validate) |
| `/validate` | QA + Dev | Run all 4 quality gates (chains into release) |
| `/release` | Release Mgr | Version bump, tag, merge, move to done (chains into pick-next) |
| `/detect-bugs` | QA | Scan for regressions and SOT violations |
| `/brainstorm` | PM | Propose new rules/improvements within SOT policy |
| `/status` | Dashboard | Show project health, backlog state, test results |

---

## Technical Constraints

### Core Engine (`src/` — excluding `src/adapters/`)

- **Language**: TypeScript with strict mode (`"strict": true`)
- **Functions**: Pure only — no side effects, no mutations, no global state
- **Testing**: vitest — tests MUST exist before implementation
- **No DOM**: No `document`, `window`, `navigator`, or browser APIs
- **No randomness**: No `Math.random()` — engine must be deterministic
- **Performance**: O(n) max traversal, caching where needed
- **Unknown handling**: If uncertain, return `{ status: "unknown", reason: "..." }`
- **Bundle target**: ≤ 5 KB gzipped

### Integration Adapters (`src/adapters/`)

- **Browser APIs allowed**: `PerformanceObserver`, `performance.memory`, React Profiler
- **Dev-only guard required**: every adapter must check `process.env.NODE_ENV !== 'production'`
- **No React internals patching**: only public APIs (`React.Profiler`, fiber read-only access)
- **Tree-shakeable**: each adapter exported independently — unused adapters must not appear in consumer bundles
- **Bundle target**: full integration bundle ≤ 20 KB gzipped

---

## Conventions

### Branch Naming
- Features: `feat/item-{id}-{short-name}`
- Bugs: `fix/bug-{id}-{short-name}`
- Infrastructure: `infra/item-{id}-{short-name}`

### Commit Messages
```
[{type}] {item-id}: {short description}

{optional longer description}
```
Types: `feat`, `fix`, `infra`, `perf`, `test`, `docs`

### File Naming
- Core source: `src/{module-name}.ts` (kebab-case)
- Adapter source: `src/adapters/{adapter-name}.ts`
- Tests: `tests/unit/{module-name}.test.ts`
- Integration tests: `tests/integration/{feature-name}.integration.test.ts`

---

## Backlog Protocol

- **One active item at a time** — finish or shelve before picking another
- Items flow: `backlog/ready/` → `backlog/active/` → `backlog/done/`
- `BACKLOG.md` is the index — always keep it in sync with the actual files
- Each item file has frontmatter (id, title, type, priority, status, created, sot-section, depends-on)
- Sections are filled progressively: PM Plan → QA Test Plan → Implementation Plan → Validation Report

---

## Quality Gates (4 Mandatory)

Nothing ships without passing ALL gates:

1. **PM Gate**: Problem defined, scope limited, non-goals listed
2. **QA Gate**: Test cases cover happy path, edge cases, failures, unknowns
3. **Dev Gate**: Core = pure/no-DOM; Adapters = dev-only guard present, no internals patched
4. **Test Gate**: All tests pass, no skipped tests, bundle size verified

See `.claude/rules/quality-gates.md` for detailed checklists.

---

## Project Structure

```
src/                    ← engine (pure TypeScript, no DOM)
  engine.ts
  types.ts
  rule-registry.ts
  traversal.ts
  rules/
  adapters/             ← browser APIs allowed, dev-only
tests/unit/             ← engine unit tests (vitest)
backlog/ready|active|done/  ← engine work items
releases/               ← engine release notes
BACKLOG.md              ← unified index (engine + dashboard items)
VERSION                 ← engine semver
CHANGELOG.md            ← engine changelog
SourceOfTruth.md        ← [IMMUTABLE] single SOT for all layers

dashboard/              ← dev-time visualisation app
  src/
    lib/                ← engine adapter (only place engine is called)
      engine.ts         ← runAnalysis(), getRuleCatalog()
    components/         ← display-only React components
      examples/         ← bad/good pattern example components
        CodeBlock.tsx         ← read-only code display
        ExampleSection.tsx    ← two-column bad vs good layout
        LiveAnalysisCard.tsx  ← runs runAnalysis(), shows status + issues
        sections/             ← one file per pattern section (5 total)
    pages/              ← page-level views
      ExamplesPage.tsx  ← /examples — section nav + pattern explorer
      RuleCatalogPage.tsx
  backlog/ready|active|done/  ← dashboard work items
  tests/                ← vitest + React Testing Library
  package.json          ← dashboard deps
  vite.config.ts        ← @engine alias → ../src/
```

---

## Dashboard Technical Constraints

- **Framework**: React 18 + TypeScript strict mode + Tailwind + Vite
- **No `any` types** — strict TypeScript throughout
- **Engine calls only in `dashboard/src/lib/`** — never in components directly
- **No detection logic** — all rules live in `src/rules/`, never in the dashboard
- **Accessible** — all interactive elements have ARIA labels
- **No bridge dependency in dashboard UI** — `window.__SPATIAL__` is for engine adapter use only; the dashboard does not read it directly

## Dashboard Conventions

### Branch Naming
- Dashboard features: `feat/dash-{id}-{short-name}`
- Dashboard fixes: `fix/dash-{id}-{short-name}`

### Commit Messages
```
[{type}] dash-{id}: {description}
```
Types: `feat`, `fix`, `style`, `refactor`, `test`

---

## Documentation Update Policy

**After every feature release** (engine or dashboard), update:
1. **`BACKLOG.md`** — mark item as `done`, confirm all rows are accurate
2. **`CHANGELOG.md`** — add release entry under the correct version header
3. **`SourceOfTruth.md` Section 17 file structure** — if new files were added
4. **`releases/{version}.md`** — engine release notes (create if not exists)
5. **`dashboard/package.json` version** — bump on every dashboard release

This keeps governance docs accurate and avoids drift between code and documentation.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
