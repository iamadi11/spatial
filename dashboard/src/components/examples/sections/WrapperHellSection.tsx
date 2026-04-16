import { useState } from 'react'
import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// 8 wrapper layers to render a single card
function ProfilePage() {
  return (
    <PageRoot>
      <PageLayout>
        <ContentArea>
          <SectionWrapper>
            <InnerWrapper>
              <ArticleWrapper>
                <CardShell>
                  <UserCard />
                </CardShell>
              </ArticleWrapper>
            </InnerWrapper>
          </SectionWrapper>
        </ContentArea>
      </PageLayout>
    </PageRoot>
  )
}
// Each wrapper = extra reconciliation work on every render`

const GOOD_CODE = `// CSS handles layout — components add semantic meaning only
function ProfilePage() {
  return (
    <main className="page-layout">
      <section className="content-area">
        <UserCard />
      </section>
    </main>
  )
}
// Same visual result, 5 fewer React nodes in the tree`

// ── Helpers ───────────────────────────────────────────────────────────────────

const WRAPPER_NAMES = [
  'PageRoot', 'PageLayout', 'ContentArea', 'SectionWrapper',
  'InnerWrapper', 'ArticleWrapper', 'CardShell', 'PaddingBox',
  'MarginBox', 'FlexWrapper', 'GridWrapper', 'ContainerDiv',
]

function buildSingleChildTree(depth: number): ComponentNode {
  let node: ComponentNode = { id: 'UserCard', type: 'UserCard' }
  for (let i = depth - 1; i >= 0; i--) {
    const type = WRAPPER_NAMES[i] ?? `Wrapper${i + 1}`
    node = { id: `wrapper-${i}`, type, children: [node] }
  }
  return node
}

// ── Demo components ───────────────────────────────────────────────────────────

function BadDemo() {
  const [depth, setDepth] = useState(8)

  const tree = buildSingleChildTree(depth)
  const metrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

  const layers = WRAPPER_NAMES.slice(0, depth)

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={tree} metrics={metrics} label="Wrapper hell" />
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label htmlFor="depth-slider" className="text-xs text-gray-400 whitespace-nowrap">
            Nesting depth: <span className="text-gray-200 font-mono">{depth}</span>
          </label>
          <input
            id="depth-slider"
            type="range"
            min={1}
            max={12}
            value={depth}
            onChange={e => setDepth(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
            aria-label="Nesting depth"
          />
        </div>
        <p className="text-xs text-gray-500">
          single-child-chain fires at depth &gt; 4 — drag to cross the threshold
        </p>
      </div>
      <div className="font-mono text-xs space-y-0 max-h-40 overflow-y-auto">
        {layers.map((name, i) => (
          <div key={name} style={{ paddingLeft: `${i * 10}px` }} className="text-red-400/80">
            {'<'}{name}{'>'}
          </div>
        ))}
        <div style={{ paddingLeft: `${depth * 10}px` }} className="text-gray-300">
          {'<'}UserCard {'/>'} ← content
        </div>
        {[...layers].reverse().map((name, i) => (
          <div key={`c-${name}`} style={{ paddingLeft: `${(depth - 1 - i) * 10}px` }} className="text-red-400/80">
            {'</'}{name}{'>'}
          </div>
        ))}
      </div>
    </div>
  )
}

const GOOD_TREE: ComponentNode = {
  id: 'page',
  type: 'Page',
  children: [
    { id: 'main', type: 'main', children: [
      { id: 'section', type: 'section', children: [
        { id: 'user-card', type: 'UserCard' },
      ]},
    ]},
  ],
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

function GoodDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={GOOD_TREE} metrics={GOOD_METRICS} label="Semantic structure" />
      <p className="text-xs text-gray-500">3 levels — CSS handles layout, components add semantic meaning</p>
      <div className="font-mono text-xs space-y-0">
        <div className="text-emerald-400/80">{'<main className="page-layout">'}</div>
        <div className="pl-4 text-emerald-400/80">{'<section className="content-area">'}</div>
        <div className="pl-8 text-gray-300">{'<UserCard />'} ← content</div>
        <div className="pl-4 text-emerald-400/80">{'</section>'}</div>
        <div className="text-emerald-400/80">{'</main>'}</div>
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function WrapperHellSection() {
  return (
    <ExampleSection
      title="Wrapper Hell"
      description="Excessive single-child wrapper components create deep nesting that React must traverse on every render. Drag the slider to add wrapper layers — watch the engine flag it when the single-child-chain threshold (4) is crossed."
      ruleNames={['single-child-chain', 'nesting-depth']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
