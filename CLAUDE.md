# Layout Validator — AI Development Instructions

## Project Identity

**Product**: Client-Side UI Performance Optimizer — a deterministic development-time UI performance detection engine that identifies potential performance bottlenecks before code ships.

**Governance**: `SourceOfTruth.md` is the IMMUTABLE product governance document. Never modify it. Always comply with it.

**Reuse**: To adapt this system for a different project, replace `SourceOfTruth.md` and update this "Project Identity" section. Everything else adapts automatically.

---

## Autonomous Development Workflow

This project is built autonomously using 10 slash commands that map to the real software development lifecycle.

### The Standard Cycle

```
/pick-next → /plan-feature → /write-tests → /implement → /validate → /release
```

### All Commands

| Command | Role | Purpose |
|---------|------|---------|
| `/kickoff` | Bootstrap | One-time: decompose SOT into backlog items |
| `/pick-next` | Orchestrator | Select next highest-priority ready item |
| `/plan-feature` | PM | Define problem, scope, non-goals, expected behavior |
| `/write-tests` | QA | Define ALL test cases BEFORE implementation |
| `/implement` | Developer | Write code to make tests pass |
| `/validate` | QA + Dev | Run all 4 quality gates |
| `/release` | Release Mgr | Version bump, changelog, tag, move to done |
| `/detect-bugs` | QA | Scan for regressions and SOT violations |
| `/brainstorm` | PM | Propose new rules/improvements within SOT policy |
| `/status` | Dashboard | Show project health, backlog state, test results |

### When to Use Each

- **Starting fresh?** → `/kickoff` (once), then `/status`
- **Ready to build?** → `/pick-next` to grab work, then follow the cycle
- **Between features?** → `/detect-bugs` to catch regressions, `/brainstorm` for ideas
- **Checking health?** → `/status` anytime

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
