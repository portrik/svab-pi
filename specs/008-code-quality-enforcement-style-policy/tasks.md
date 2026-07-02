# Tasks: Code Quality Enforcement Style Policy

**Input**: Design documents from `specs/008-code-quality-enforcement-style-policy/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Agentic harness prompt/reviewer/verifier tests and build after implementation surfaces change.

## Phase 1: Spec-First Policy

- [x] T001 Update `.specify/memory/constitution.md` with spec-first and parser-first governance.
- [x] T002 Update `.specify/templates/*` so future specs record parser-first boundaries, unrepresentable-state modeling, immutable/functional defaults, and exceptions.
- [x] T003 Add this implementation-change artifact set before code/prompt changes.
- [x] T004 Update `specs/README.md` so maintainers can find this policy spec.

## Phase 2: Enforcement Surfaces

- [x] T005 Update system/developer prompt surfaces and code-quality skills.
- [x] T006 Update reviewer/verifier guidance so undocumented policy violations are failures.
- [x] T007 Update tests that assert prompt/reviewer/verifier guidance.
- [x] T008 Confirm no code-quality infrastructure refactor is needed beyond prompt/reviewer/verifier surfaces for this policy pass.

## Phase 3: Verification

- [x] T009 Run targeted tests for touched prompt/reviewer/verifier surfaces.
- [x] T010 Run `npm --prefix extensions/agentic-harness test`.
- [x] T011 Run `npm --prefix extensions/agentic-harness run build`.
- [x] T012 Record durable `/goal evidence` before requesting completion.

## Dependencies & Execution Order

1. T001-T004 before any implementation changes.
2. T005-T008 after specs are updated.
3. T009-T012 after implementation changes.
