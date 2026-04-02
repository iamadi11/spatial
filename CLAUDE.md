# Layout Validator — AI Development Instructions

## Project Identity

**Product**: Client-Side UI Performance Optimizer — a deterministic development-time UI performance detection engine that identifies potential performance bottlenecks before code ships.

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

### When to Use Each

- **Starting a new project?** → `/kickoff` once, then `/dev`
- **Resuming work?** → `/dev` (picks up from current state)
- **Checking health?** → `/status` anytime
- **Found a bug?** → `/detect-bugs`
- **Want new features?** → `/brainstorm`

---

## Technical Constraints

- **Language**: TypeScript with strict mode (`"strict": true`)
- **Functions**: Pure only — no side effects, no mutations, no global state
- **Testing**: vitest — tests MUST exist before implementation
- **No DOM**: No `document`, `window`, `navigator`, or browser APIs
- **No randomness**: No `Math.random()` — engine must be deterministic
- **Performance**: O(n) max traversal, caching for text measurement
- **Unknown handling**: If uncertain, return `{ status: "unknown", reason: "..." }`

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
- Source: `src/{module-name}.ts` (kebab-case)
- Tests: `tests/unit/{module-name}.test.ts`
- Integration: `tests/integration/{feature-name}.integration.test.ts`

---

## Backlog Protocol

- **One active item at a time** — finish or shelve before picking another
- Items flow: `backlog/ready/` → `backlog/active/` → `backlog/done/`
- `BACKLOG.md` is the index — always keep it in sync with the actual files
- Each item file has frontmatter (id, title, type, priority, status, created, sot-section, depends-on)
- Sections are filled progressively: PM Plan → QA Test Plan → Implementation Plan → Validation Report

### Item Template Location
Items follow the template defined in the plan. Create them in `backlog/ready/` with status `ready`.

---

## Quality Gates (4 Mandatory)

Nothing ships without passing ALL gates:

1. **PM Gate**: Problem defined, scope limited, non-goals listed
2. **QA Gate**: Test cases cover happy path, edge cases, failures, unknowns
3. **Dev Gate**: Pure functions, no DOM, deterministic, O(n) complexity
4. **Test Gate**: All tests pass, no skipped tests, full coverage

See `.claude/rules/quality-gates.md` for detailed checklists.

---

## Project Structure

```
src/                    → Source code (TypeScript, pure functions)
tests/unit/             → Unit tests (vitest)
tests/integration/      → Integration tests
backlog/ready/          → Work items waiting for development
backlog/active/         → Currently being worked on (max 1)
backlog/done/           → Completed and released items
releases/               → Release notes per version
BACKLOG.md              → Work item index table
VERSION                 → Current semver version
CHANGELOG.md            → Changelog in Keep-a-Changelog format
SourceOfTruth.md        → [IMMUTABLE] Product governance document
```
