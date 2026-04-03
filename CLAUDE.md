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
src/
  engine.ts          ← core analyze() — pure function
  types.ts           ← shared types
  rule-registry.ts   ← registry factory — pure
  traversal.ts       ← O(n) tree walker — pure
  rules/             ← individual rule implementations — pure, no DOM
  adapters/          ← real-world bridge — browser APIs allowed, dev-only
    react.ts         ← React Profiler + fiber tree → ComponentNode
    metrics.ts       ← PerformanceObserver → PerformanceMetrics
    index.ts         ← SpatialProvider, useSpatial hook
tests/unit/          ← vitest unit tests (pure functions only)
tests/integration/   ← integration tests (jsdom or real browser)
backlog/ready/       ← work items waiting
backlog/active/      ← currently being worked on (max 1)
backlog/done/        ← completed and released
releases/            ← release notes per version
BACKLOG.md           ← work item index
VERSION              ← current semver version
CHANGELOG.md         ← Keep-a-Changelog format
SourceOfTruth.md     ← [IMMUTABLE] product governance
```
