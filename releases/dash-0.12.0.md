# Release dash-0.12.0 — 2026-04-04

## Summary

Major UX redesign of the dashboard. Removes the manual JSON playground (`/analyze`) and the bridge-dependent live page (`/live`). Replaces both with a single `/examples` page that shows real-world React performance anti-patterns with bad vs good comparisons, interactive demos, and live engine analysis — no setup required.

---

## New: `/examples` page (D17)

A 5-section pattern explorer with a persistent left-side section nav.

### Sections

| # | Section | Rules Demonstrated |
|---|---------|-------------------|
| 1 | Excessive Re-renders | `render-count` |
| 2 | Wrapper Hell | `single-child-chain`, `nesting-depth` |
| 3 | Prop Explosion | `prop-count`, `boolean-prop-overload` |
| 4 | Unvirtualized List | `unvirtualized-list`, `child-count` |
| 5 | Deep Nesting | `nesting-depth` |

### Each section contains

- **Left nav button** — `aria-label`, `aria-current` for accessibility
- **Bad pattern column** — red-tinted border; interactive live demo + real code snippet + engine analysis card showing `fail`
- **Good pattern column** — green-tinted border; interactive live demo + fixed code snippet + engine analysis card showing `pass`
- **Rule badges** — monospace chips listing which rules are exercised

### Interactive demos

- **Re-renders**: click "Update parent state" to watch unmemoized render counters climb vs `memo()`'d ones staying flat
- **Wrapper Hell**: animated JSX tree showing 7-layer nesting vs 3-level semantic HTML
- **Prop Explosion**: prop tables comparing 20 props vs 3 focused props
- **Unvirtualized List**: scroll through all 200 mounted items vs paginated 10-at-a-time view
- **Deep Nesting**: JSX tree showing 14-level depth vs 4-level flat equivalent

---

## New Components

| File | Purpose |
|------|---------|
| `components/examples/CodeBlock.tsx` | Read-only syntax-highlighted code block with optional label |
| `components/examples/LiveAnalysisCard.tsx` | Runs `runAnalysis()` via `useMemo`, displays status badge + issue list |
| `components/examples/ExampleSection.tsx` | Two-column bad/good layout — wraps demo, code, and analysis card |
| `components/examples/sections/RerenderSection.tsx` | Excessive Re-renders section |
| `components/examples/sections/WrapperHellSection.tsx` | Wrapper Hell section |
| `components/examples/sections/PropExplosionSection.tsx` | Prop Explosion section |
| `components/examples/sections/UnvirtualizedListSection.tsx` | Unvirtualized List section |
| `components/examples/sections/DeepNestingSection.tsx` | Deep Nesting section |
| `pages/ExamplesPage.tsx` | Page shell — section nav + active section content |

---

## Engine Adapter Updates

Three rules that existed in the engine were missing from the dashboard adapter. Now registered:

- `boolean-prop-overload` — flags components with >5 boolean props
- `single-child-chain` — flags wrapper-hell single-child chains (tree-level)
- `memo-candidate` — flags high-render nodes with many children

Rule catalog expanded from 15 → 18 entries.

---

## Removed

| What | Why |
|------|-----|
| `/analyze` — `AnalysisPlaygroundPage.tsx` | Manual JSON input had too much friction; examples page provides curated patterns |
| `/live` — `LiveAnalysisPage.tsx` | Requires SpatialProvider installed in a real app; examples page works with zero setup |
| `ThresholdEditor.tsx` | Only used by playground |
| `NodeTreeInput.tsx` | Only used by playground |
| `MetricsInput.tsx` | Only used by playground |
| `AnalysisResult.tsx` | Superseded by `LiveAnalysisCard.tsx` |
| `lib/live.ts` | `readBridge()` no longer needed in dashboard |

---

## Navigation Changes

- Sidebar: removed **Analyze** and **Live** links → replaced with **Examples**
- Default route (`/`) still redirects to `/rules`
- `RuleCard` "Try in Playground" link updated from `/analyze` → `/examples`

---

## Tests

- Removed: `analysis-playground.test.tsx`, `live-analysis.test.tsx`, `threshold-editor.test.tsx` (−42 tests)
- Added: `examples-page.test.tsx` (+6 tests)
- Updated: `navigation-shell.test.tsx`, `rule-detail-panel.test.tsx`, `engine-adapter.test.ts`
- Final: **105 tests passing** across 11 test files
