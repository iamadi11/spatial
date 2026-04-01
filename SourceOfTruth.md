# 🧠 Client-Side UI Performance Optimizer — AI Governance Source of Truth (SOT)

---

# 0. Purpose

This document enforces **strict alignment between idea → implementation** for a dev-time performance optimizer.

AI must:

* NOT assume
* NOT expand scope
* NOT skip validation
* ALWAYS follow test-first development

---

# 1. Product Definition (Immutable)

We are building:

> A deterministic development-time UI performance detection engine that identifies potential performance bottlenecks before code ships.

---

# 2. Non-Negotiable Constraints

## 2.1 No Scope Expansion

AI must NOT:

* add new frameworks
* modify runtime behavior in production
* auto-fix code without human review

Unless explicitly instructed.

---

## 2.2 Deterministic Engine Only

* Observations must produce **repeatable results** given the same code and controlled environment  
* No randomness in detection  
* No production browser assumptions  

---

## 2.3 Trust Over Intelligence

* If unsure → return UNKNOWN  
* Never guess metrics or bottlenecks  
* Never hallucinate fixes  

---

## 2.4 Test-First Development (MANDATORY)

> No implementation is allowed before test definitions.

---

# 3. AI Role Simulation (MANDATORY)

For every feature, AI must act as:

---

## 3.1 Product Manager (PM)

AI must define:

* What problem is being solved?  
* Why is this needed?  
* What is OUT OF SCOPE?  
* What is the expected behavior?  

---

## 3.2 Fullstack Developer

AI must define:

* Input format (code, component tree, DOM snapshot)  
* Output format (performance report)  
* Data structures for metrics  
* Algorithm approach (measurement + anomaly detection)  

---

## 3.3 QA Engineer

AI must define:

* Edge cases (large lists, deeply nested components)  
* Failure cases (unsupported components, dynamic CSS)  
* Boundary inputs (empty components, zero-state UI)  
* Negative scenarios (unsupported frameworks, missing hooks)  

---

# 4. Development Workflow (STRICT ORDER)

---

## Step 1: Problem Definition

AI must output:

\`\`\`txt
Feature:
Goal:
Scope:
Non-goals:
\`\`\`

---

## Step 2: Test Case Definition (MANDATORY)

AI must define:

### 4.2.1 Happy Path

\`\`\`json
Input:
Component tree with standard components and props
Expected Output:
Performance metrics with status: pass/fail
\`\`\`

---

### 4.2.2 Edge Cases

* Very large component trees  
* Nested layouts  
* Long lists without virtualization  

---

### 4.2.3 Failure Cases

* Unsupported frameworks  
* Missing lifecycle hooks  
* Empty DOM snapshot  

---

### 4.2.4 Unknown Cases

\`\`\`json
Expected:
status: "unknown"
reason: "cannot measure reliably in this environment"
\`\`\`

---

## Step 3: Test Coverage Validation

AI must explicitly confirm:

\`\`\`txt
✔ All scenarios covered
✔ No missing edge case
✔ No ambiguity in expected output
\`\`\`

If NOT → STOP.

---

## Step 4: Implementation Plan

AI must define:

* functions/modules for:
  - Metrics collection  
  - Render tracking  
  - DOM mutation monitoring  
  - Anomaly detection  
* Flow of data without writing code yet  

---

## Step 5: Code Implementation

Rules:

* Pure functions where possible  
* Deterministic calculations  
* TypeScript preferred  
* No external dependencies unless required for measurement  

---

## Step 6: Validation Against Tests

AI must verify:

\`\`\`txt
✔ All test cases pass logically
✔ No uncovered scenario
\`\`\`

---

# 5. System Contracts

---

## 5.1 Input Contract

\`\`\`ts
type ComponentNode = {
  id: string
  type: string
  props?: Record<string, any>
  children?: ComponentNode[]
  styles?: Record<string, string>
}
\`\`\`

---

## 5.2 Output Contract

\`\`\`json
{
  "status": "pass" | "fail" | "unknown",
  "metrics": {
    "renderCount": number,
    "layoutShifts": number,
    "fpsDrop": number,
    "memoryUsage": number
  },
  "issues": []
}
\`\`\`

---

# 6. Validation Philosophy

---

## 6.1 No Assumptions

AI must NOT assume:

* baseline FPS  
* default browser CPU/GPU  
* implicit memoization  

If missing → return UNKNOWN

---

## 6.2 Explicit Inputs Only

All computations must be based on:

* provided component tree  
* controlled environment metrics  

---

## 6.3 Deterministic Rules

Example:

\`\`\`txt
IF renderCount > threshold → flag re-render
IF layoutShift > threshold → flag layout instability
\`\`\`

No probabilistic logic.

---

# 7. Rule Development Template

Every rule must follow:

---

## Rule Definition

\`\`\`txt
Rule Name:
Purpose:
Inputs:
Condition:
Output:
\`\`\`

---

## Test Cases

* happy path  
* edge cases  
* failure cases  

---

## Implementation Plan

* function signature  
* data flow  

---

# 8. Anti-Deviation Rules

AI must NEVER:

❌ Modify production runtime behavior  
❌ Auto-optimize code without human review  
❌ Assume browser-specific defaults  
❌ Expand to non-UI performance metrics  

---

# 9. Failure Handling

If system cannot compute:

\`\`\`json
{
  "status": "unknown",
  "reason": "unsupported input or environment"
}
\`\`\`

---

# 10. Quality Gates (MANDATORY)

Before any feature is accepted:

---

## Gate 1: PM Validation

* Problem clearly defined  
* Scope limited  

---

## Gate 2: QA Validation

* Edge cases covered  
* Failure scenarios covered  

---

## Gate 3: Dev Validation

* Implementation feasible  
* Deterministic  

---

## Gate 4: Test Coverage

* All cases mapped to logic  

---

# 11. Performance Constraints

* O(n) traversal max for component tree  
* Metrics cached per render  
* No repeated measurement of same DOM operation  

---

# 12. Expansion Policy

Allowed:

* new rules for additional performance patterns  
* improved measurement accuracy  

Not allowed:

* uncontrolled feature expansion  
* runtime behavior changes  

---

# 13. Execution Command Template (for AI)

Every prompt MUST follow:

\`\`\`txt
Follow SOT strictly.

Step 1: Define problem (PM role)
Step 2: Define test cases (QA role)
Step 3: Validate coverage
Step 4: Provide implementation plan
Step 5: Then write code

Do not skip steps.
Do not assume missing data.
Return UNKNOWN if uncertain.
\`\`\`

---

# 14. Definition of Done

A feature is complete ONLY IF:

* all test cases defined first  
* all test cases satisfied  
* no ambiguity remains  
* no SOT rule violated  

---

# 15. Philosophy

> This system is like a static analyzer:

* strict  
* deterministic  
* validated before output  

NOT like:

* heuristic guesser  
* runtime profiler
