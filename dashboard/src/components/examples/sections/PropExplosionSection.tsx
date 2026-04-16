import { useState } from 'react'
import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { LiveAnalysisCard } from '../LiveAnalysisCard'
import { ExampleSection } from '../ExampleSection'

// ── Code snippets ─────────────────────────────────────────────────────────────

const BAD_CODE = `// 20 props — this component does too many things
function Widget({
  isActive, isDisabled, isLoading, isReadOnly,
  isSelected, isVisible, isCollapsed, isExpanded,
  theme, size, variant, mode,
  label, placeholder,
  onSubmit, onCancel, onChange, onFocus, onBlur,
  className,
}) {
  // Hard to understand, test, and maintain
  // Every prop change triggers a re-render check
  return <button ...>{label}</button>
}`

const GOOD_CODE = `// Each component does one thing — focused props only
function SubmitButton({ isLoading, label, onSubmit }) {
  return (
    <button onClick={onSubmit} disabled={isLoading}>
      {isLoading ? 'Saving…' : label}
    </button>
  )
}

// Variants are separate components, not boolean flags
function EditableField({ value, onChange, placeholder }) {
  return <input value={value} onChange={onChange} placeholder={placeholder} />
}`

// ── Helpers ───────────────────────────────────────────────────────────────────

const BOOL_FLAG_NAMES = [
  'isActive', 'isDisabled', 'isLoading', 'isReadOnly', 'isSelected',
  'isVisible', 'isCollapsed', 'isExpanded', 'isFocused', 'isHighlighted',
  'isChecked', 'isRequired', 'isValid', 'isPending', 'isBusy',
]

function buildWidgetTree(boolCount: number): ComponentNode {
  const boolProps = Object.fromEntries(
    BOOL_FLAG_NAMES.slice(0, boolCount).map((name, i) => [name, i % 2 === 0])
  )
  return {
    id: 'Widget',
    type: 'Widget',
    props: {
      ...boolProps,
      theme: 'dark',
      size: 'lg',
      label: 'Submit',
      onSubmit: null,
      onChange: null,
    },
  }
}

// ── Demo components ───────────────────────────────────────────────────────────

function BadDemo() {
  const [boolCount, setBoolCount] = useState(8)

  const tree = buildWidgetTree(boolCount)
  const metrics: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }
  const totalProps = boolCount + 5 // 5 fixed non-boolean props

  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={tree} metrics={metrics} label="Prop-heavy widget" />
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label htmlFor="bool-slider" className="text-xs text-gray-400 whitespace-nowrap">
            Boolean props: <span className="text-gray-200 font-mono">{boolCount}</span>
            <span className="text-gray-500"> (total: {totalProps})</span>
          </label>
          <input
            id="bool-slider"
            type="range"
            min={0}
            max={15}
            value={boolCount}
            onChange={e => setBoolCount(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
            aria-label="Boolean props"
          />
        </div>
        <p className="text-xs text-gray-500">
          boolean-prop-overload fires at &gt; 5 booleans · prop-count fires at total &gt; 15
        </p>
      </div>
      <div className="rounded bg-gray-900 p-3 font-mono text-xs space-y-0.5 max-h-36 overflow-y-auto">
        {BOOL_FLAG_NAMES.slice(0, boolCount).map((name, i) => (
          <div key={name} className="flex gap-2">
            <span className="text-red-300">{name}</span>
            <span className="text-gray-500">=</span>
            <span className="text-gray-300">{i % 2 === 0 ? 'true' : 'false'}</span>
          </div>
        ))}
        {(['theme', 'size', 'label', 'onSubmit', 'onChange'] as const).map(name => (
          <div key={name} className="flex gap-2">
            <span className="text-gray-400">{name}</span>
            <span className="text-gray-500">=</span>
            <span className="text-gray-300">…</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const GOOD_TREE: ComponentNode = {
  id: 'SubmitButton',
  type: 'SubmitButton',
  props: { isLoading: false, label: 'Submit', onSubmit: null },
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 1, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

function GoodDemo() {
  return (
    <div className="space-y-3">
      <LiveAnalysisCard tree={GOOD_TREE} metrics={GOOD_METRICS} label="Focused component" />
      <p className="text-xs text-gray-500">3 focused props — one responsibility per component</p>
      <div className="rounded bg-gray-900 p-3 font-mono text-xs space-y-0.5">
        {[['isLoading', 'false'], ['label', '"Submit"'], ['onSubmit', 'fn']].map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="text-emerald-300">{k}</span>
            <span className="text-gray-500">=</span>
            <span className="text-gray-300">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function PropExplosionSection() {
  return (
    <ExampleSection
      title="Prop Explosion"
      description="Components with too many boolean flags are trying to do too much. Drag the slider to add boolean props — the engine flags boolean-prop-overload above 5 and prop-count above 15 total props."
      ruleNames={['prop-count', 'boolean-prop-overload']}
      bad={{ code: BAD_CODE, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, demo: <GoodDemo /> }}
    />
  )
}
