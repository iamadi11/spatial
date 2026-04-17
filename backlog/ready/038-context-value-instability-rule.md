---
id: "038"
title: "Context value instability detection rule (flag non-primitive Provider values)"
type: rule
priority: 3
status: ready
created: 2026-04-17
sot-section: "Section 12, 7"
depends-on: "005, 006"
---

## PM Plan

**Problem**: `React.createContext` + `Context.Provider` is one of the most common React patterns, but a well-known performance trap exists: when the Provider's `value` prop is an object or array literal (e.g., `value={{ user, setUser }}`), a new reference is created on every parent render, causing ALL context consumers to re-render — even when the underlying data hasn't changed. The engine has no rule for this.

**Goal**: Add a `context-value-instability` rule that flags `Context.Provider` nodes whose `value` prop is a non-primitive type (object, array, or function), indicating the value will be a new reference on every render.

**Scope**:
- Node-level rule: check if `node.type` ends with `.Provider` or equals `Context.Provider` or `ReactContext.Provider`
- If `props.value` exists and `typeof props.value === 'object'` or `typeof props.value === 'function'` → fire warning
- Primitive values (`string`, `number`, `boolean`, `null`, `undefined`) are stable across renders → not flagged
- One issue per Provider node

**Non-goals**: Detecting whether the value is actually memoized at runtime, comparing values across renders, analyzing useContext consumers

**Done when**:
- Rule fires when a `*.Provider` node passes an object/array/function as `value`
- Rule returns null when value is a primitive
- Rule returns null for non-Provider node types
- Tests cover happy/edge/failure/unknown
