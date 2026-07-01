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

## Phase 2: Consistency Review

- [ ] T007 Confirm requirements cite checked-in paths.
- [ ] T008 Record mismatches/TODOs without changing runtime code.
- [ ] T009 Run relevant docs/spec verification and record evidence.

## Dependencies & Execution Order

1. T001 before documentation tasks.
2. T002-T006 can proceed in parallel after T001.
3. T007-T009 after artifact drafts exist.
