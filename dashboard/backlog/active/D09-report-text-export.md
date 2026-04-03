---
id: "D09"
title: "Report text export — copy formatReport() output to clipboard"
type: feature
priority: 4
status: active
created: 2026-04-03
sot-section: "dashboard/SourceOfTruth.md Section 7 (additional display formats for PerformanceResult)"
depends-on: "D05"
---

## PM Plan

**Problem**: The engine's `formatReport()` function produces a clean plain-text summary of any `PerformanceResult`, but the dashboard has no way to surface this text or let developers copy it. Developers who want to paste the report into a bug report, Slack message, or CI log have to reconstruct it manually.

**Goal**: Add a "Copy report" button to the `ResultDetailView` component that calls `formatReport()` and copies the result to the clipboard.

**Scope**:
- "Copy report" button rendered in `ResultDetailView` (near the status banner)
- On click: calls `formatReport(result)` from `src/lib/engine.ts` and writes to `navigator.clipboard`
- Button shows a brief "Copied!" confirmation state (1.5s) then resets
- Button is accessible with an ARIA label

**Non-goals**: Do not add download-as-file functionality. Do not add email or share integrations. Do not show the formatted text inline (clipboard only).

**Done when**: Clicking "Copy report" on any result copies the `formatReport()` text to the clipboard and shows a "Copied!" confirmation.

## QA Test Plan

**Happy path:**
- H1: CopyReportButton renders a "Copy report" button
- H2: Clicking calls `navigator.clipboard.writeText` with `formatReport` output
- H3: Shows "Copied!" confirmation after click
- H4: ResultDetailView renders the Copy report button
- H5: Copying from ResultDetailView with fail result includes issues text

**Edge cases:**
- E1: Button has an accessible `aria-label`
- E2: Copied text includes issue details for fail result

**Failure cases:**
- F1: Does not throw when `clipboard.writeText` rejects

**Unknown cases:**
- U1: Copies report correctly for result with `status: "unknown"`
