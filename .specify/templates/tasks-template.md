# Tasks: [AREA] Current State

**Input**: Design documents from `specs/[###-area-current-state]/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Documentation/spec verification only unless the artifact documents an existing command that should be run.

## Phase 1: Current-State Documentation

- [ ] T001 Review source paths listed in `plan.md` and `research.md`.
- [ ] T002 Fill `spec.md` with observed behavior only.
- [ ] T003 Fill `research.md` with source-backed findings.
- [ ] T004 Fill `data-model.md` with state/entities or mark N/A.
- [ ] T005 Fill `contracts/README.md` with commands/tools/APIs or mark non-contracts.
- [ ] T006 Fill `quickstart.md` with read order and verification.
- [ ] T007 For implementation-change specs, record parser-first boundaries, unrepresentable-state modeling, immutable/functional defaults, and any project exceptions.

## Phase 2: Consistency Review

- [ ] T008 Confirm requirements cite checked-in paths.
- [ ] T009 Record mismatches/TODOs without changing runtime code for current-state specs.
- [ ] T010 Confirm reviewer/verifier guidance can fail implementation work that violates parser-first policy without a spec-named exception.
- [ ] T011 Run relevant docs/spec verification and record evidence.

## Dependencies & Execution Order

1. T001 before documentation tasks.
2. T002-T007 can proceed in parallel after T001.
3. T008-T011 after artifact drafts exist.
