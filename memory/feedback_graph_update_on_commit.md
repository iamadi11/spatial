---
name: Update code-review-graph after every commit
description: After every git commit in this project, update code-review-graph.html with any new nodes and edges
type: feedback
---

After every git commit, update `code-review-graph.html` to reflect the new state of the codebase.

**Why:** The user explicitly requested this. The graph is the primary codebase navigation tool for code review, and it must stay in sync with the source files.

**How to apply:**
1. After each `git commit` call, check which source files were added or removed (use `git diff HEAD~1 --name-status` or inspect the commit message/branch)
2. For new `src/rules/*.ts` files: add a rule node (layer "rules") and an edge to `rule-registry`
3. For new `dashboard/src/components/*.tsx` files: add a component node (layer "components") and edges to `d-engine` if it imports from lib/engine
4. For new `dashboard/src/pages/*.tsx` files: add a page node (layer "pages") and edges to components it imports
5. Update the node count in the header subtitle
6. This applies to both feature commits and merge commits
