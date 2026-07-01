# Feature Specification: Session Loop Current State

**Feature Branch**: `003-session-loop-current-state`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Current repository behavior for Session Loop

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Session Loop behavior (Priority: P1)

A maintainer can read this artifact set to understand the current supported behavior and boundaries for Recurring prompt scheduling with `/loop`, job listing, stopping, shutdown cleanup, and scheduler behavior.

**Why this priority**: This is the baseline for safe future changes.

**Independent Test**: Compare this spec with the checked-in sources listed in `plan.md` and `research.md`.

**Acceptance Scenarios**:

1. **Given** a maintainer reviewing this area, **When** they read the spec, **Then** they can identify current behavior, owned files, and integration boundaries.
2. **Given** a future change touching this area, **When** the change is planned, **Then** this current-state spec provides the baseline to compare against.

### User Story 2 - Preserve documentation-only boundaries (Priority: P2)

A maintainer can see what is intentionally not changed by this spec work.

**Why this priority**: The goal is documentation-only current-state coverage.

**Independent Test**: Confirm this artifact set records mismatches/TODOs without changing runtime behavior.

**Acceptance Scenarios**:

1. **Given** a stale-doc or behavior mismatch, **When** it is found, **Then** it is listed as a TODO/risk rather than fixed in this goal.

### Edge Cases

- pi follow-up message delivery
- session lifetime only; no durable job persistence observed
- UI select/confirm availability

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Current Session Loop behavior MUST document that Registers `/loop`, `/loop-stop`, `/loop-list`, and `/loop-stop-all` commands.
- **FR-002**: Current Session Loop behavior MUST document that `/loop` accepts an optional interval first token; if interval parsing fails, it defaults to `1m` and treats the entire input as the prompt.
- **FR-003**: Current Session Loop behavior MUST document that Scheduled jobs deliver prompts back to pi via `sendUserMessage(..., { deliverAs: "followUp" })`.
- **FR-004**: Current Session Loop behavior MUST document that `/loop-stop` can stop by id or use interactive selection when no id is provided.
- **FR-005**: Current Session Loop behavior MUST document that `/loop-stop-all` requires UI confirmation before stopping all active jobs.
- **FR-006**: Current Session Loop behavior MUST document that Session shutdown stops all jobs and waits briefly for cleanup.
- **FR-007**: This artifact set MUST cite checked-in paths for every material behavior claim.
- **FR-008**: This artifact set MUST label external dependencies, generated state, host APIs, feature flags, and platform behavior as boundaries.

### Key Entities *(include if feature involves data)*

- **JobScheduler**: Current-state concept documented for Session Loop.
- **LoopJob**: Current-state concept documented for Session Loop.
- **LoopError**: Current-state concept documented for Session Loop.
- **Interval**: Current-state concept documented for Session Loop.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The artifact set includes `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/README.md`, and `tasks.md`.
- **SC-002**: Every behavior claim maps to at least one source path listed in `research.md`.
- **SC-003**: Mismatches/TODOs are recorded here or in `research.md` without modifying runtime code.

## Assumptions

- This is a current-state baseline, not a request for behavior changes.
- Local ignored state such as `.pi/` is not product behavior unless explicitly named as runtime storage.
- Source files are more authoritative than stale prose when conflicts are found.

## Known Mismatches / TODOs

- If durable loops are desired later, add a separate feature; current behavior is session-scoped.
