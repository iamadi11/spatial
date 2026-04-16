import { useState } from 'react'
import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// 14 levels of nesting — React reconciles the full depth
function DeepPage() {
  return (
    <App>
      <Wrapper>
        <Container>
          <Section>
            <Panel>
              <Box>
                <Inner>
                  <Content>
                    <Block>
                      <Frame>
                        <Slot>
                          <Layer>
                            <Zone>
                              <Card />
                            </Zone>
                          </Layer>
                        </Slot>
                      </Frame>
                    </Block>
                  </Content>
                </Inner>
              </Box>
            </Panel>
          </Section>
        </Container>
      </Wrapper>
    </App>
  )
}`

const GOOD_CODE = `// 4 levels — semantic HTML does the structural work
function Page() {
  return (
    <main>
      <section>
        <Card />
      </section>
    </main>
  )
}
// Deep nesting is almost always avoidable with CSS grid/flex`

// ── Helpers ───────────────────────────────────────────────────────────────────

const NODE_TYPES = [
  'App', 'Wrapper', 'Container', 'Section', 'Panel',
  'Box', 'Inner', 'Content', 'Block', 'Frame',
  'Slot', 'Layer', 'Zone', 'Area', 'Cell',
]

function makeDeepTree(depth: number): ComponentNode {
  let node: ComponentNode = { id: 'leaf', type: 'Card' }
  for (let i = depth - 1; i >= 0; i--) {
    node = { id: `node-${i}`, type: NODE_TYPES[i % NODE_TYPES.length], children: [node] }
  }
  return node
}

// ── Demo components ───────────────────────────────────────────────────────────

function BadDemo() {
  const [depth, setDepth] = useState(14)

  const tree = makeDeepTree(depth)
  const metrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }
  const levels = NODE_TYPES.slice(0, Math.min(depth, NODE_TYPES.length))

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={tree} metrics={metrics} label="Deep tree" />
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label htmlFor="tree-depth-slider" className="text-xs text-gray-400 whitespace-nowrap">
            Tree depth: <span className="text-gray-200 font-mono">{depth}</span>
          </label>
          <input
            id="tree-depth-slider"
            type="range"
            min={1}
            max={15}
            value={depth}
            onChange={e => setDepth(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
            aria-label="Tree depth"
          />
        </div>
        <p className="text-xs text-gray-500">
          nesting-depth fires when depth &gt; 10 — drag to cross the threshold
        </p>
      </div>
      <div className="font-mono text-xs overflow-x-auto max-h-40 overflow-y-auto">
        {levels.map((name, i) => (
          <div key={name} style={{ paddingLeft: `${i * 10}px` }} className="text-red-400/80 leading-5">
            {'<'}{name}{'>'}
          </div>
        ))}
        <div style={{ paddingLeft: `${Math.min(depth, levels.length) * 10}px` }} className="text-gray-300 leading-5">
          {'<Card />'}
        </div>
        {[...levels].reverse().map((name, i) => (
          <div key={`c-${name}`} style={{ paddingLeft: `${(levels.length - 1 - i) * 10}px` }} className="text-red-400/80 leading-5">
            {'</'}{name}{'>'}
          </div>
        ))}
      </div>
    </div>
  )
}

const GOOD_TREE: ComponentNode = {
  id: 'app',
  type: 'App',
  children: [
    { id: 'main', type: 'main', children: [
      { id: 'section', type: 'section', children: [
        { id: 'card', type: 'Card' },
      ]},
    ]},
  ],
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

function GoodDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={GOOD_TREE} metrics={GOOD_METRICS} label="Flat tree" />
      <p className="text-xs text-gray-500">4 levels — semantic HTML, no unnecessary wrappers</p>
      <div className="font-mono text-xs">
        <div className="text-emerald-400/80 leading-5">{'<App>'}</div>
        <div className="pl-4 text-emerald-400/80 leading-5">{'<main>'}</div>
        <div className="pl-8 text-emerald-400/80 leading-5">{'<section>'}</div>
        <div className="pl-12 text-gray-300 leading-5">{'<Card />'}</div>
        <div className="pl-8 text-emerald-400/80 leading-5">{'</section>'}</div>
        <div className="pl-4 text-emerald-400/80 leading-5">{'</main>'}</div>
        <div className="text-emerald-400/80 leading-5">{'</App>'}</div>
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function DeepNestingSection() {
  return (
    <ExampleSection
      title="Deep Nesting"
      description="Deeply nested component trees force React's reconciler to traverse the full depth on every render. Drag the slider — the engine flags nesting-depth once the tree exceeds 10 levels."
      ruleNames={['nesting-depth']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
