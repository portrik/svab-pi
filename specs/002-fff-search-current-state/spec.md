# Feature Specification: FFF Search Current State

**Feature Branch**: `002-fff-search-current-state`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Current repository behavior for FFF Search

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand FFF Search behavior (Priority: P1)

A maintainer can read this artifact set to understand the current supported behavior and boundaries for FFF-backed `find`, `grep`, `multi_grep`, @-mention autocomplete, health/rescan/mode commands, fallback behavior, and FFF runtime config.

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

- native `@ff-labs/fff-node` availability
- gitignore-aware FFF scan results
- environment variables `PI_FFF_MODE`, `PI_FFF_SCAN_TIMEOUT_MS`, `PI_FFF_ENABLE_WATCH`
- pi editor autocomplete provider

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Current FFF Search behavior MUST document that Overrides built-in `find` and `grep` tools with FFF-backed implementations and registers `multi_grep` for multi-pattern OR search.
- **FR-002**: Current FFF Search behavior MUST document that Can replace @-mention file autocomplete unless mode is `tools-only`.
- **FR-003**: Current FFF Search behavior MUST document that Uses persistent FFF frecency/history/config files under the pi agent directory.
- **FR-004**: Current FFF Search behavior MUST document that Falls back to built-in find/grep when the native FFF engine is unavailable, at filesystem root/home, or initial scan fails/times out.
- **FR-005**: Current FFF Search behavior MUST document that Exposes `/fff-mode`, `/fff-health`, and `/fff-rescan` commands.
- **FR-006**: This artifact set MUST cite checked-in paths for every material behavior claim.
- **FR-007**: This artifact set MUST label external dependencies, generated state, host APIs, feature flags, and platform behavior as boundaries.

### Key Entities *(include if feature involves data)*

- **FileFinder**: Current-state concept documented for FFF Search.
- **CursorStore**: Current-state concept documented for FFF Search.
- **GrepCursor**: Current-state concept documented for FFF Search.
- **FffMode**: Current-state concept documented for FFF Search.
- **AutocompleteItem**: Current-state concept documented for FFF Search.

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
