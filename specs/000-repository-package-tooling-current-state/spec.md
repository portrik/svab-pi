# Feature Specification: Repository Package and Tooling Current State

**Feature Branch**: `000-repository-package-tooling-current-state`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Current repository behavior for Repository Package and Tooling

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Repository Package and Tooling behavior (Priority: P1)

A maintainer can read this artifact set to understand the current supported behavior and boundaries for Root package metadata, extension registration, bundled dependencies, root docs, CI, and pi-core change snapshot boundaries.

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

- pi host package loader
- bundled dependencies in node_modules
- ignored local `.pi/` runtime state
- upstream pi core snapshot under `pi-core-changes/`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Current Repository Package and Tooling behavior MUST document that `package.json` defines `svab-pi` as a pi package requiring Node.js >=24.16.0.
- **FR-002**: Current Repository Package and Tooling behavior MUST document that The root pi extension list loads six local extension entrypoints plus bundled `@code-yeongyu/pi-nested-agents-md`, `pi-lsp-client`, and the local wrapper for `pi-mcp-adapter`.
- **FR-003**: Current Repository Package and Tooling behavior MUST document that Root dependencies and overrides pin pi packages to the 0.79.x line while bundled dependencies package nested agents, LSP, and MCP adapter code.
- **FR-004**: Current Repository Package and Tooling behavior MUST document that Static checks run per-extension test/build/check commands and a docs node test; there is no root `npm test` script.
- **FR-005**: Current Repository Package and Tooling behavior MUST document that `pi-core-changes/` is a checked-in upstream core-change snapshot/test area, not the main local extension runtime.
- **FR-006**: This artifact set MUST cite checked-in paths for every material behavior claim.
- **FR-007**: This artifact set MUST label external dependencies, generated state, host APIs, feature flags, and platform behavior as boundaries.

### Key Entities *(include if feature involves data)*

- **PiPackage**: Current-state concept documented for Repository Package and Tooling.
- **ExtensionEntrypoint**: Current-state concept documented for Repository Package and Tooling.
- **BundledDependency**: Current-state concept documented for Repository Package and Tooling.
- **StaticCheckJob**: Current-state concept documented for Repository Package and Tooling.
- **CoreChangeSnapshot**: Current-state concept documented for Repository Package and Tooling.

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

- Reconcile README pi 0.72.x badges/text with package dependencies pinned to 0.79.4 in a separate docs cleanup goal.
