# Feature Specification: Workspace Memory Current State

**Feature Branch**: `004-workspace-memory-current-state`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Current repository behavior for Workspace Memory

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Workspace Memory behavior (Priority: P1)

A maintainer can read this artifact set to understand the current supported behavior and boundaries for Workspace-scoped memory save, recall, scoring, prompt injection, command surface, templates, and local storage.

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

- workspace cwd determines memory scope
- system prompt injection by pi hook
- local files under the agent/workspace memory storage paths
- heuristic keyword and scoring behavior

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Current Workspace Memory behavior MUST document that On session start, loads cached memory index for the workspace and updates UI status when memories exist.
- **FR-002**: Current Workspace Memory behavior MUST document that Before agent start, detects keywords, recalls relevant memories, can inject memory context into the system prompt, and suggests use of `memory_save` for important findings.
- **FR-003**: Current Workspace Memory behavior MUST document that Registers the `memory_save` tool with content/template/tags parameters.
- **FR-004**: Current Workspace Memory behavior MUST document that Registers `/memory` command handling list/show/save/delete/search/stats behavior.
- **FR-005**: Current Workspace Memory behavior MUST document that Recall updates scores and persists the memory index after recall.
- **FR-006**: This artifact set MUST cite checked-in paths for every material behavior claim.
- **FR-007**: This artifact set MUST label external dependencies, generated state, host APIs, feature flags, and platform behavior as boundaries.

### Key Entities *(include if feature involves data)*

- **WorkspaceMemory**: Current-state concept documented for Workspace Memory.
- **MemoryIndex**: Current-state concept documented for Workspace Memory.
- **MemoryTemplate**: Current-state concept documented for Workspace Memory.
- **RecallScore**: Current-state concept documented for Workspace Memory.
- **MemoryMetadata**: Current-state concept documented for Workspace Memory.

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

- None recorded.
