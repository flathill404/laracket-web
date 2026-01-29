---
name: test-naming
description: "Generate clean, professional test structures for Vitest/Jest/Mocha. Use when writing test files (.test.ts, .spec.ts), creating describe/it blocks, or reviewing test naming conventions. Ensures tests read as technical specifications with declarative naming."
---

# Test Naming

Generate test structures that serve as technical specifications.

## Quick Start

Preview test tree without execution:

```bash
bun vitest list
```

## Structure Rules

**Top-level `describe`**: Class, function, or component name.

**Nested `describe`**: Use "when [condition]" or "given [state]" for scenarios.

**`it` blocks**: Complete the sentence "It..." as a factual statement.

## Naming Rules

| Rule                              | Rationale                                         |
| --------------------------------- | ------------------------------------------------- |
| Never use "should"                | Redundant - "It should return X" → "It returns X" |
| Use third-person singular present | `returns`, `throws`, `updates`                    |
| State outcomes as facts           | Tests assert truths, not possibilities            |

## Vocabulary Reference

| Category   | Verbs                                                                |
| ---------- | -------------------------------------------------------------------- |
| State      | `returns`, `provides`, `initializes`, `contains`, `exposes`          |
| Action     | `updates`, `persists`, `notifies`, `dispatches`, `emits`, `triggers` |
| Error      | `throws`, `rejects`, `ignores`, `denies`, `fails`                    |
| Validation | `validates`, `requires`, `matches`, `enforces`                       |

## Example

```typescript
describe("PaymentGateway", () => {
  describe("processPayment", () => {
    describe("when the credit card is expired", () => {
      it("throws an InvalidCardError", () => {});
      it("logs a warning to the security audit", () => {});
    });

    describe("given a valid payment method", () => {
      it("returns a transaction ID", () => {});
      it('updates the order status to "paid"', () => {});
    });
  });
});
```

## Anti-Patterns

```typescript
// ❌ WRONG: Uses "should"
it("should return a value", () => {});

// ✅ CORRECT: Declarative
it("returns a value", () => {});

// ❌ WRONG: Vague description
it("works correctly", () => {});

// ✅ CORRECT: Specific outcome
it("returns the sum of all elements", () => {});

// ❌ WRONG: Tests implementation detail
it("calls the helper function", () => {});

// ✅ CORRECT: Tests behavior
it("calculates the total price including tax", () => {});

// ❌ WRONG: No context grouping
describe("UserService", () => {
  it("throws when email is invalid", () => {});
  it("returns user when email is valid", () => {});
});

// ✅ CORRECT: Grouped by context
describe("UserService", () => {
  describe("findByEmail", () => {
    describe("when email format is invalid", () => {
      it("throws a ValidationError", () => {});
    });
    describe("when email exists in database", () => {
      it("returns the user object", () => {});
    });
  });
});
```
