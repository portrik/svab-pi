# Feature Specification: Agentic Harness Current State

**Feature Branch**: `001-agentic-harness-current-state`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Current repository behavior for Agentic Harness

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Agentic Harness behavior (Priority: P1)

A maintainer can read this artifact set to understand the current supported behavior and boundaries for /clarify, /goal, subagents, team/tmux, sandboxed tools, review command, TUI/footer, durable state, agents, skills, and verifier-guarded execution.

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

- pi extension API and UI APIs
- subagent pi subprocesses
- tmux availability
- Linux/macOS sandbox adapters
- environment flags `PI_ENABLE_TEAM_MODE`, `PI_TEAM_WORKER`, `PI_SANDBOX_APPROVAL_MODE`, `PI_AGENTIC_SANDBOX_BASH`, `PI_AGENTIC_MICROCOMPACTION`, `PI_AGENTIC_FOOTER_GLYPHS`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Current Agentic Harness behavior MUST document that Registers `/clarify`, `/goal`, `/review`, `/ask`, `/setup`, `/init`, `/reset-phase`, and `/team` commands from the extension entrypoint.
- **FR-002**: Current Agentic Harness behavior MUST document that Registers LLM tools including `ask_user_question`, `clarification_state`, `subagent`, `webfetch`, sandboxed bash replacement, and gated `team` when root-session/team-mode conditions allow.
- **FR-003**: Current Agentic Harness behavior MUST document that Maintains durable clarification and goal state as JSON snapshots and session replay events under `.pi/agent/*-state/`.
- **FR-004**: Current Agentic Harness behavior MUST document that Goal completion is verifier-gated: evidence is recorded, completion is requested, `reviewer-verifier` runs, and only PASS receipts allow completion.
- **FR-005**: Current Agentic Harness behavior MUST document that Team mode is disabled by default and requires `PI_ENABLE_TEAM_MODE=1`; workers run with `PI_TEAM_WORKER=1` to suppress recursive orchestration.
- **FR-006**: Current Agentic Harness behavior MUST document that Sandbox approval behavior depends on `PI_SANDBOX_APPROVAL_MODE`; sandboxed bash registration is OS/env-dependent.
- **FR-007**: This artifact set MUST cite checked-in paths for every material behavior claim.
- **FR-008**: This artifact set MUST label external dependencies, generated state, host APIs, feature flags, and platform behavior as boundaries.

### Key Entities *(include if feature involves data)*

- **ClarificationState**: Current-state concept documented for Agentic Harness.
- **GoalState**: Current-state concept documented for Agentic Harness.
- **GoalItem**: Current-state concept documented for Agentic Harness.
- **SubgoalItem**: Current-state concept documented for Agentic Harness.
- **GoalVerifierReceipt**: Current-state concept documented for Agentic Harness.
- **TeamRun**: Current-state concept documented for Agentic Harness.
- **SandboxPolicy**: Current-state concept documented for Agentic Harness.
- **HarnessTodo**: Current-state concept documented for Agentic Harness.

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

- README still describes pi v0.72 compatibility while root package pins 0.79.x; document-only here, fix separately if desired.
