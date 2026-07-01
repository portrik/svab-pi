# Feature Specification: Pi Code Previews Current State

**Feature Branch**: `005-pi-code-previews-current-state`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Current repository behavior for Pi Code Previews

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Pi Code Previews behavior (Priority: P1)

A maintainer can read this artifact set to understand the current supported behavior and boundaries for Syntax-highlighted and compact previews for tool calls, Shiki setup, settings UI, health command, and warning/rendering helpers.

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

- pi tool renderer API
- Shiki initialization/cache
- global/local pi settings files
- terminal width and TUI rendering
- optional oxlint/oxfmt checks in this extension package

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Current Pi Code Previews behavior MUST document that Loads code preview settings from multiple global/local settings paths and saves normalized settings to `getAgentDir()/code-previews.json`.
- **FR-002**: Current Pi Code Previews behavior MUST document that Initializes Shiki when syntax highlighting is enabled.
- **FR-003**: Current Pi Code Previews behavior MUST document that Registers `/code-preview-health` and `/code-preview-settings` commands.
- **FR-004**: Current Pi Code Previews behavior MUST document that On session start, registers renderers for supported tool outputs such as read, write, edit, grep, find, ls, and bash.
- **FR-005**: Current Pi Code Previews behavior MUST document that Settings control compact previews, syntax highlighting, collapsed line counts, path icons, bash warnings, secret warnings, and enabled tools.
- **FR-006**: This artifact set MUST cite checked-in paths for every material behavior claim.
- **FR-007**: This artifact set MUST label external dependencies, generated state, host APIs, feature flags, and platform behavior as boundaries.

### Key Entities *(include if feature involves data)*

- **CodePreviewSettings**: Current-state concept documented for Pi Code Previews.
- **ToolRenderer**: Current-state concept documented for Pi Code Previews.
- **ShikiStatus**: Current-state concept documented for Pi Code Previews.
- **SettingsListItem**: Current-state concept documented for Pi Code Previews.
- **ToolSelection**: Current-state concept documented for Pi Code Previews.

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
