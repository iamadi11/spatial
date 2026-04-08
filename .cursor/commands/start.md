---
description: "One-shot: bootstrap backlog if needed, then run the full autonomous dev loop (no separate slash commands)"
---

# Start — Full Flow in One Session

You are the **session starter**. The user must not need to run `/kickoff`, `/pick-next`, `/plan-feature`, `/write-tests`, `/implement`, `/validate`, or `/release` manually unless they choose to. **In this session, you chain everything.**

## Phase A — Bootstrap (run only when needed)

Run **Kickoff** (same workflow as `.cursor/commands/kickoff.md`) **only if** there are **no** engine backlog item files (`*.md`) in **any** of:

- `backlog/ready/`
- `backlog/active/`
- `backlog/done/`

If **any** such file exists in those directories, **skip Phase A entirely** (Kickoff is one-time). Do not use `BACKLOG.md` alone to decide — the filesystem is the source of truth.

If Phase A runs: perform all Kickoff steps (decompose `SourceOfTruth.md`, create `backlog/ready/` items, update `BACKLOG.md`, initialize `VERSION` / `CHANGELOG.md` if missing), then **continue immediately** to Phase B without asking the user.

## Phase B — Autonomous development loop

Execute the **entire** workflow defined in `.cursor/commands/dev.md` (**Dev — Fully Autonomous Development Loop**):

- Cover **both** the spatial engine and the **dashboard** (paths and rules exactly as in `dev.md`).
- Loop: `pick-next → plan-feature → write-tests → implement → validate → release` until Dev stopping conditions apply.
- **Do not stop between steps** for user confirmation; self-heal test and gate failures; use the same progress format, gates, and documentation updates as `dev.md`.

### Inlined reminder (must follow `dev.md` detail)

1. After Phase A (if any), assess state: resume `backlog/active/` or `dashboard/backlog/active/` if present; else pick-next across both projects.
2. For each item, run plan-feature → write-tests → implement → validate → release in order, committing at the milestones `dev.md` specifies.
3. Dashboard items use `dashboard/` paths, `dashboard/SourceOfTruth.md`, and `dashboard/tests/` as in `dev.md`.

## Stopping

Stop only when `dev.md` says to (no eligible items, both projects done, or genuine ambiguity that cannot be resolved from repo context).

## Begin now

Print whether Phase A ran or was skipped, print initial state for engine + dashboard, then enter Phase B immediately.
