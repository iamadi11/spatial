import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { ExampleSection } from '../ExampleSection'

// ── Engine trees ──────────────────────────────────────────────────────────────

const BAD_TREE: ComponentNode = {
  id: 'page-root',
  type: 'PageRoot',
  children: [{
    id: 'page-layout',
    type: 'PageLayout',
    children: [{
      id: 'content-area',
      type: 'ContentArea',
      children: [{
        id: 'section-wrapper',
        type: 'SectionWrapper',
        children: [{
          id: 'inner-wrapper',
          type: 'InnerWrapper',
          children: [{
            id: 'article-wrapper',
            type: 'ArticleWrapper',
            children: [{
              id: 'card-shell',
              type: 'CardShell',
              children: [{ id: 'user-card', type: 'UserCard' }],
            }],
          }],
        }],
      }],
    }],
  }],
}
const BAD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

const GOOD_TREE: ComponentNode = {
  id: 'page',
  type: 'Page',
  children: [
    { id: 'main', type: 'main' },
    { id: 'section', type: 'section' },
    { id: 'user-card', type: 'UserCard' },
  ],
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

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

// ── Demo components ───────────────────────────────────────────────────────────

const WRAPPER_LAYERS = [
  'PageRoot', 'PageLayout', 'ContentArea',
  'SectionWrapper', 'InnerWrapper', 'ArticleWrapper', 'CardShell',
]

function BadDemo() {
  const depth = WRAPPER_LAYERS.length
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">{depth} nested wrapper components:</p>
      <div className="font-mono text-xs space-y-0">
        {WRAPPER_LAYERS.map((name, i) => (
          <div
            key={name}
            style={{ paddingLeft: `${i * 12}px` }}
            className="text-red-400/80"
          >
            {'<'}{name}{'>'}
          </div>
        ))}
        <div style={{ paddingLeft: `${depth * 12}px` }} className="text-gray-300">
          {'<'}UserCard {'/>'} ← actual content
        </div>
        {[...WRAPPER_LAYERS].reverse().map((name, i) => (
          <div
            key={`close-${name}`}
            style={{ paddingLeft: `${(depth - 1 - i) * 12}px` }}
            className="text-red-400/80"
          >
            {'</'}{name}{'>'}
          </div>
        ))}
      </div>
    </div>
  )
}

function GoodDemo() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">3 semantic elements — same layout:</p>
      <div className="font-mono text-xs space-y-0">
        <div className="text-emerald-400/80">{'<main className="page-layout">'}</div>
        <div className="pl-4 text-emerald-400/80">{'<section className="content-area">'}</div>
        <div className="pl-8 text-gray-300">{'<UserCard />'} ← actual content</div>
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
      description="Excessive single-child wrapper components — often accumulated over time as requirements change — create deep nesting that React must traverse on every render. Each wrapper adds reconciliation overhead without adding structural value. CSS classes can replace most wrappers."
      ruleNames={['single-child-chain', 'nesting-depth']}
      bad={{ code: BAD_CODE, tree: BAD_TREE, metrics: BAD_METRICS, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, tree: GOOD_TREE, metrics: GOOD_METRICS, demo: <GoodDemo /> }}
    />
  )
}
