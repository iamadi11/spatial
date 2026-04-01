# 🧠 Layout Validator — AI Governance Source of Truth (SOT)

---

# 0. Purpose

This document enforces **strict alignment between idea → implementation** when using AI-assisted development.

AI must:

* NOT assume
* NOT expand scope
* NOT skip validation
* ALWAYS follow test-first development

---

# 1. Product Definition (Immutable)

We are building:

> A deterministic layout validation engine that detects layout issues before runtime.

---

# 2. Non-Negotiable Constraints

## 2.1 No Scope Expansion

AI must NOT:

* add new features
* support additional CSS
* introduce UI builder concepts

Unless explicitly instructed.

---

## 2.2 Deterministic Engine Only

* No DOM usage
* No browser APIs in core engine
* No randomness

---

## 2.3 Trust Over Intelligence

* If unsure → return UNKNOWN
* Never guess
* Never hallucinate values

---

## 2.4 Test-First Development (MANDATORY)

> No implementation is allowed before test definition.

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

* Input format
* Output format
* Data structures
* Algorithm approach

---

## 3.3 QA Engineer

AI must define:

* Edge cases
* Failure cases
* Boundary inputs
* Negative scenarios

---

# 4. Development Workflow (STRICT ORDER)

---

## Step 1: Problem Definition

AI must output:

```txt
Feature:
Goal:
Scope:
Non-goals:
```

---

## Step 2: Test Case Definition (MANDATORY)

AI must define:

### 4.2.1 Happy Path

```json
Input:
Expected Output:
```

---

### 4.2.2 Edge Cases

* extreme values
* boundary widths
* empty inputs

---

### 4.2.3 Failure Cases

* unsupported styles
* missing data

---

### 4.2.4 Unknown Cases

```json
Expected:
status: "unknown"
```

---

## Step 3: Test Coverage Validation

AI must explicitly confirm:

```txt
✔ All scenarios covered
✔ No missing edge case
✔ No ambiguity in expected output
```

If NOT → STOP.

---

## Step 4: Implementation Plan

AI must define:

* functions
* modules
* flow of data

WITHOUT writing code yet.

---

## Step 5: Code Implementation

Rules:

* pure functions only
* no side effects
* TypeScript preferred
* no external dependencies unless required

---

## Step 6: Validation Against Tests

AI must verify:

```txt
✔ All test cases pass logically
✔ No uncovered scenario
```

---

# 5. System Contracts

---

## 5.1 Input Contract

```ts
type Node = {
  id: string
  type: string
  style: Style
  text?: string
  children?: Node[]
}
```

---

## 5.2 Output Contract

```json
{
  "status": "pass" | "fail" | "unknown",
  "issues": []
}
```

---

# 6. Validation Philosophy

---

## 6.1 No Assumptions

AI must NOT assume:

* default width
* default font
* default layout behavior

If missing:

→ return UNKNOWN

---

## 6.2 Explicit Inputs Only

All computations must be based on:

* provided data
* defined rules

---

## 6.3 Deterministic Rules

Example:

```txt
IF textWidth > containerWidth → overflow
```

No probabilistic logic.

---

# 7. Rule Development Template

Every rule must follow:

---

## Rule Definition

```txt
Rule Name:
Purpose:
Inputs:
Condition:
Output:
```

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

❌ Add UI layer
❌ Add drag-drop logic
❌ Add styling systems
❌ Use DOM APIs
❌ Expand CSS support

---

# 9. Failure Handling

If system cannot compute:

```json
{
  "status": "unknown",
  "reason": "unsupported input"
}
```

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
* deterministic

---

## Gate 4: Test Coverage

* All cases mapped to logic

---

# 11. Performance Constraints

* O(n) traversal max
* caching required for text measurement
* no repeated computation

---

# 12. Expansion Policy

Allowed:

* new rules
* improved accuracy

Not allowed:

* uncontrolled feature growth

---

# 13. Execution Command Template (for AI)

Every prompt MUST follow:

```txt
Follow SOT strictly.

Step 1: Define problem (PM role)
Step 2: Define test cases (QA role)
Step 3: Validate coverage
Step 4: Provide implementation plan
Step 5: Then write code

Do not skip steps.
Do not assume missing data.
Return UNKNOWN if uncertain.
```

---

# 14. Definition of Done

A feature is complete ONLY IF:

* all test cases defined first
* all test cases satisfied
* no ambiguity remains
* no SOT rule violated

---

# 15. Philosophy

> This system is built like a compiler:

* strict
* predictable
* validated before execution

NOT like:

* AI generator
* heuristic system

---
