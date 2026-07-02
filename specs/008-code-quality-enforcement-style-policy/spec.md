# Feature Specification: Code Quality Enforcement Style Policy

**Feature Branch**: `008-code-quality-enforcement-style-policy`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Goal to update specs first, then code-quality enforcement surfaces

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enforce parser-first implementation style (Priority: P1)

A maintainer wants reviewers and verifier prompts to fail implementation work that uses scattered validation, representable invalid states, or mutable/imperative style when a parser-first immutable model is practical.

**Why this priority**: The policy must be enforceable by review, not just prose guidance.

**Independent Test**: Inspect reviewer/verifier guidance and confirm it treats violations as failures unless a project-specific exception is named.

**Acceptance Scenarios**:

1. **Given** code handles external or uncertain input, **When** a parser can narrow it into a domain type, **Then** review guidance expects parsing at the boundary instead of repeated downstream validation checks.
2. **Given** state can encode impossible combinations, **When** a discriminated union, narrowed type, or state shape can remove those combinations, **Then** review guidance expects invalid states to be unrepresentable.
3. **Given** code uses mutation or imperative flow, **When** immutable/functional style would fit the project, **Then** review guidance expects the immutable/functional version.
4. **Given** a project specifies a different approach, **When** validation, mutation, or imperative code is required, **Then** the exception is accepted when documented.

### Edge Cases

- Runtime schema validation required for tool contracts, TypeBox schemas, trust boundaries, or host APIs.
- Platform APIs, caches, performance hot paths, or resource lifecycles that require mutation or imperative control flow.
- Existing domain names such as `plan-validator` and `reviewer-verifier` that should not be renamed just to avoid the word validation.
- Current-state specs that must not claim intended future behavior before code changes land.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Spec/governance files MUST be updated before code, prompt, runtime, or test changes for this policy.
- **FR-002**: Code-quality enforcement guidance MUST prefer parsing external or uncertain input into narrow domain types over scattered validation checks.
- **FR-003**: Code-quality enforcement guidance MUST prefer type/state designs that make invalid states unrepresentable where practical.
- **FR-004**: Code-quality enforcement guidance MUST prefer immutable/functional style unless the project requires mutation or imperative code.
- **FR-005**: Reviewer/verifier guidance MUST fail violations of FR-002 through FR-004 unless a project-specific exception is documented.
- **FR-006**: Required runtime schemas, trust-boundary checks, host/tool contracts, and documented project exceptions MUST remain allowed.

### Key Entities *(include if applicable)*

- **Boundary Parser**: Code or prompt guidance that converts uncertain input into a narrower domain representation before business logic uses it.
- **Domain State Model**: Types or state shapes that remove impossible combinations instead of allowing invalid states.
- **Project Exception**: A documented reason a project requires validation-heavy, mutable, or imperative code.
- **Reviewer Failure**: A verifier/reviewer outcome that blocks completion when the policy is violated without an exception.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Spec/governance changes land before implementation-enforcement changes.
- **SC-002**: Reviewer/verifier guidance names parser-first, unrepresentable-state, and immutable/functional defaults as failure criteria when no project exception exists.
- **SC-003**: Prompt/spec/skill/runtime guidance remains internally consistent and keeps durable goal/reviewer workflows intact.
- **SC-004**: Required validation at trust boundaries and tool contracts remains explicitly allowed.

## Assumptions

- This is an implementation-change spec, not a current-state baseline.
- Existing current-state specs remain observed-behavior documents until the implementation changes land.
- The policy targets code-quality enforcement infrastructure first, not arbitrary product code.
