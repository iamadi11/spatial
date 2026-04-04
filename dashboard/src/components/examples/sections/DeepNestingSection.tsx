import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { ExampleSection } from '../ExampleSection'

// ── Engine trees ──────────────────────────────────────────────────────────────

function makeDeepTree(depth: number): ComponentNode {
  const types = [
    'App', 'Wrapper', 'Container', 'Section', 'Panel',
    'Box', 'Inner', 'Content', 'Block', 'Frame',
    'Slot', 'Layer', 'Zone', 'Area', 'Cell',
  ]
  let node: ComponentNode = { id: `node-${depth - 1}`, type: types[depth - 1] ?? 'Node' }
  for (let i = depth - 2; i >= 0; i--) {
    node = { id: `node-${i}`, type: types[i] ?? 'Node', children: [node] }
  }
  return node
}

const BAD_TREE: ComponentNode = makeDeepTree(14)
const BAD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

const GOOD_TREE: ComponentNode = {
  id: 'app',
  type: 'App',
  children: [
    {
      id: 'main',
      type: 'main',
      children: [
        { id: 'section', type: 'section', children: [{ id: 'card', type: 'Card' }] },
      ],
    },
  ],
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

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

// ── Demo components ───────────────────────────────────────────────────────────

const BAD_LEVELS = [
  'App', 'Wrapper', 'Container', 'Section', 'Panel',
  'Box', 'Inner', 'Content', 'Block', 'Frame',
  'Slot', 'Layer', 'Zone',
]

function BadDemo() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Tree depth: {BAD_LEVELS.length + 1} levels</p>
      <div className="font-mono text-xs overflow-x-auto">
        {BAD_LEVELS.map((name, i) => (
          <div key={name} style={{ paddingLeft: `${i * 10}px` }} className="text-red-400/80 leading-5">
            {'<'}{name}{'>'}
          </div>
        ))}
        <div style={{ paddingLeft: `${BAD_LEVELS.length * 10}px` }} className="text-gray-300 leading-5">
          {'<Card />'}
        </div>
        {[...BAD_LEVELS].reverse().map((name, i) => (
          <div key={`c-${name}`} style={{ paddingLeft: `${(BAD_LEVELS.length - 1 - i) * 10}px` }} className="text-red-400/80 leading-5">
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
      <p className="text-xs text-gray-500">Tree depth: 4 levels</p>
      <div className="font-mono text-xs">
        <div className="text-emerald-400/80 leading-5">{'<main>'}</div>
        <div className="pl-4 text-emerald-400/80 leading-5">{'<section>'}</div>
        <div className="pl-8 text-gray-300 leading-5">{'<Card />'}</div>
        <div className="pl-4 text-emerald-400/80 leading-5">{'</section>'}</div>
        <div className="text-emerald-400/80 leading-5">{'</main>'}</div>
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function DeepNestingSection() {
  return (
    <ExampleSection
      title="Deep Nesting"
      description="Deeply nested component trees force React's reconciler to traverse the full depth on every render. Beyond ~10 levels, the overhead becomes measurable. Most deep nesting arises from accumulated wrapper components — flattening the tree with CSS layout primitives is usually straightforward."
      ruleNames={['nesting-depth']}
      bad={{ code: BAD_CODE, tree: BAD_TREE, metrics: BAD_METRICS, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, tree: GOOD_TREE, metrics: GOOD_METRICS, demo: <GoodDemo /> }}
    />
  )
}
