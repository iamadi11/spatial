---
id: "D22"
title: "Dark mode toggle (system preference + manual override)"
type: feature
priority: 4
status: active
created: 2026-04-17
sot-section: "Section 16.6"
depends-on: "D06"
---

## PM Plan

**Problem**: Dashboard always renders in dark mode (Tailwind bg-gray-900). There is no toggle for users who prefer light mode.

**Goal**: Add a system-preference-aware dark/light toggle button in the navigation shell.

**Scope**:
- Read `prefers-color-scheme` on mount for default
- Toggle button in sidebar/nav; persists to localStorage
- Apply `dark` class to `<html>` element per Tailwind dark-mode convention
- Works alongside existing Tailwind dark: classes

**Non-goals**: Per-page color schemes, custom color palettes

**Done when**:
- Button appears in nav with accessible label
- Toggle switches between dark and light classes
- Preference persisted to localStorage
- All existing tests pass
