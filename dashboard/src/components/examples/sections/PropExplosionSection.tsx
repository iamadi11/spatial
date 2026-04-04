import type { ComponentNode, PerformanceMetrics } from '../../../lib/engine'
import { ExampleSection } from '../ExampleSection'

// ── Engine trees ──────────────────────────────────────────────────────────────

const BAD_TREE: ComponentNode = {
  id: 'widget',
  type: 'Widget',
  props: {
    isActive: true,
    isDisabled: false,
    isLoading: false,
    isReadOnly: false,
    isSelected: true,
    isVisible: true,
    isCollapsed: false,
    isExpanded: true,
    theme: 'dark',
    size: 'lg',
    variant: 'primary',
    mode: 'edit',
    label: 'Submit',
    placeholder: 'Enter value',
    onSubmit: null,
    onCancel: null,
    onChange: null,
    onFocus: null,
    onBlur: null,
    className: 'widget--main',
  },
}
const BAD_METRICS: PerformanceMetrics = { renderCount: 2, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

const GOOD_TREE: ComponentNode = {
  id: 'submit-button',
  type: 'SubmitButton',
  props: {
    isLoading: false,
    label: 'Submit',
    onSubmit: null,
  },
}
const GOOD_METRICS: PerformanceMetrics = { renderCount: 2, layoutShifts: 0, fpsDrop: 0, memoryUsage: 0 }

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
}

// Composition over configuration
function Widget() {
  return (
    <>
      <EditableField value={value} onChange={onChange} placeholder="Enter value" />
      <SubmitButton label="Submit" onSubmit={handleSubmit} />
    </>
  )
}`

// ── Demo components ───────────────────────────────────────────────────────────

const BAD_PROPS = [
  ['isActive', 'true'], ['isDisabled', 'false'], ['isLoading', 'false'],
  ['isReadOnly', 'false'], ['isSelected', 'true'], ['isVisible', 'true'],
  ['isCollapsed', 'false'], ['isExpanded', 'true'],
  ['theme', '"dark"'], ['size', '"lg"'], ['variant', '"primary"'], ['mode', '"edit"'],
  ['label', '"Submit"'], ['placeholder', '"Enter value"'],
  ['onSubmit', 'fn'], ['onCancel', 'fn'], ['onChange', 'fn'],
  ['onFocus', 'fn'], ['onBlur', 'fn'], ['className', '"widget--main"'],
]

const GOOD_PROPS = [
  ['isLoading', 'false'],
  ['label', '"Submit"'],
  ['onSubmit', 'fn'],
]

function PropTable({ props, tint }: { props: string[][]; tint: 'red' | 'green' }) {
  const nameClass = tint === 'red' ? 'text-red-300' : 'text-emerald-300'
  return (
    <div className="rounded bg-gray-900 p-3 font-mono text-xs space-y-0.5 max-h-40 overflow-y-auto">
      {props.map(([k, v]) => (
        <div key={k} className="flex gap-2">
          <span className={nameClass}>{k}</span>
          <span className="text-gray-500">=</span>
          <span className="text-gray-300">{v}</span>
        </div>
      ))}
    </div>
  )
}

function BadDemo() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">{BAD_PROPS.length} props on one component:</p>
      <PropTable props={BAD_PROPS} tint="red" />
      <div className="flex gap-2 text-xs text-red-400/80">
        <span>8 boolean flags</span>
        <span>·</span>
        <span>4 string variants</span>
        <span>·</span>
        <span>5 handlers</span>
      </div>
    </div>
  )
}

function GoodDemo() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Focused component — {GOOD_PROPS.length} props:</p>
      <PropTable props={GOOD_PROPS} tint="green" />
      <div className="flex gap-2 text-xs text-emerald-400/80">
        <span>1 boolean</span>
        <span>·</span>
        <span>1 label</span>
        <span>·</span>
        <span>1 handler</span>
      </div>
    </div>
  )
}

// ── Section export ────────────────────────────────────────────────────────────

export function PropExplosionSection() {
  return (
    <ExampleSection
      title="Prop Explosion"
      description="Components that accept too many props — especially many boolean flags — are trying to do too much. They're hard to test, hard to read, and every prop adds diffing cost on re-render. Split them into focused components and use composition instead of configuration."
      ruleNames={['prop-count', 'boolean-prop-overload']}
      bad={{ code: BAD_CODE, tree: BAD_TREE, metrics: BAD_METRICS, demo: <BadDemo /> }}
      good={{ code: GOOD_CODE, tree: GOOD_TREE, metrics: GOOD_METRICS, demo: <GoodDemo /> }}
    />
  )
}
