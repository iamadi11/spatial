# Spatial Dashboard — AI Development Instructions

## Project Identity

**Product**: A dev-time React dashboard that visualises `spatial` engine output.

**Governance**: `SourceOfTruth.md` is the IMMUTABLE product governance document. Never modify it. Always comply with it.

**Engine location**: `../src/` — import engine types and functions from there directly.

---

## Autonomous Development Workflow

```
/dev   ← runs the full loop until all backlog items are done
```

### All Commands

| Command | Purpose |
|---------|---------|
| `/dev` | Full autonomous loop |
| `/pick-next` | Select next backlog item |
| `/plan-feature` | PM: define scope + non-goals |
| `/write-tests` | QA: write failing tests first |
| `/implement` | Dev: make tests pass |
| `/validate` | Run all 4 quality gates |
| `/release` | Version bump, tag, merge |
| `/status` | Show health + backlog state |

---

## Technical Constraints

- **Framework**: React 18 + TypeScript strict mode
- **No `any` types** anywhere
- **Engine calls only in `src/lib/`** — never in components directly
- **No detection logic in the dashboard** — all rules live in `../src/`
- **Pure render** — components are display-only; no side effects in render
- **Accessible** — all interactive elements have ARIA labels

---

## Conventions

### Branch Naming
- `feat/dash-{id}-{short-name}`
- `fix/dash-{id}-{short-name}`

### Commit Messages
```
[{type}] dash-{id}: {description}
```
Types: `feat`, `fix`, `style`, `refactor`, `test`

### File Structure
```
src/
  lib/           ← engine adapter functions (only place engine is called)
  components/    ← React components (display only)
  pages/         ← Page-level components
  types.ts       ← Dashboard-specific types (never duplicate engine types)
```

---

## Backlog Protocol

- Items flow: `backlog/ready/` → `backlog/active/` → `backlog/done/`
- `BACKLOG.md` is the index — keep it in sync
- One active item at a time

---

## Quality Gates (4 Mandatory)

1. **PM Gate**: Problem defined, scope limited, non-goals listed
2. **Component Gate**: Isolated component, typed props, no deep prop drilling
3. **Dev Gate**: Engine calls only in `src/lib/`, no `any`, strict TypeScript
4. **Visual Gate**: Renders at 1280px, no overflow, accessible labels

---

## Project Structure

```
dashboard/
  src/
    lib/            ← engine adapter (calls ../src/ functions)
    components/     ← UI components
    pages/          ← page views
    types.ts        ← dashboard-only types
  backlog/
    ready/
    active/
    done/
  public/
  BACKLOG.md
  CLAUDE.md
  SourceOfTruth.md
  package.json
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
```
