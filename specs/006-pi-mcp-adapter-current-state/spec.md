# Feature Specification: MCP Adapter Wrapper Current State

**Feature Branch**: `006-pi-mcp-adapter-current-state`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Current repository behavior for MCP Adapter Wrapper

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand MCP Adapter Wrapper behavior (Priority: P1)

A maintainer can read this artifact set to understand the current supported behavior and boundaries for Local compact-rendering wrapper around bundled upstream `pi-mcp-adapter` without forking the full MCP engine.

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

- external `pi-mcp-adapter` package
- MCP protocol/OAuth/server behavior
- pi TUI Text rendering
- tool result content block conventions

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Current MCP Adapter Wrapper behavior MUST document that Root package loads `extensions/pi-mcp-adapter/index.ts` instead of the upstream adapter entrypoint directly.
- **FR-002**: Current MCP Adapter Wrapper behavior MUST document that The wrapper imports the upstream adapter from `node_modules/pi-mcp-adapter/index.ts` and invokes it once through a proxied `pi` object.
- **FR-003**: Current MCP Adapter Wrapper behavior MUST document that The proxy intercepts `registerTool` and replaces tool `renderCall`/`renderResult` functions with compact one-line renderers.
- **FR-004**: Current MCP Adapter Wrapper behavior MUST document that Renderer failures fall back to original upstream renderers when available.
- **FR-005**: Current MCP Adapter Wrapper behavior MUST document that MCP engine behavior, protocol/OAuth/UI stack, and server integration remain owned by the upstream dependency.
- **FR-006**: This artifact set MUST cite checked-in paths for every material behavior claim.
- **FR-007**: This artifact set MUST label external dependencies, generated state, host APIs, feature flags, and platform behavior as boundaries.

### Key Entities *(include if feature involves data)*

- **CompactMcpAdapter**: Current-state concept documented for MCP Adapter Wrapper.
- **ProxiedPi**: Current-state concept documented for MCP Adapter Wrapper.
- **McpToolSpec**: Current-state concept documented for MCP Adapter Wrapper.
- **CompactCallRenderer**: Current-state concept documented for MCP Adapter Wrapper.
- **CompactResultRenderer**: Current-state concept documented for MCP Adapter Wrapper.

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

- Consider adding a local package/CI entry for pi-mcp-adapter tests in a separate tooling goal.
