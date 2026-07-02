# Feature Specification: [AREA] Current State

**Feature Branch**: `[###-area-current-state]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: Current repository behavior for `[AREA]`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand current behavior (Priority: P1)

[Describe who depends on this area and what behavior they need documented.]

**Why this priority**: Current-state specs must make the shipped behavior inspectable before future changes.

**Independent Test**: A reader can trace each documented behavior to checked-in files listed in the plan/research artifacts.

**Acceptance Scenarios**:

1. **Given** a maintainer reviewing `[AREA]`, **When** they read this spec, **Then** they can identify the supported behavior and boundaries.
2. **Given** a future implementation task, **When** it touches `[AREA]`, **Then** the current-state spec provides the baseline to compare against.

### Edge Cases

- Feature flags and environment variables that alter behavior.
- Terminal, tmux, OS, or pi-host behavior that cannot be verified from local TypeScript alone.
- External dependencies that are bundled or integrated but not owned here.
- Local/generated state that should not be treated as product behavior.
- Implementation boundaries where runtime validation, mutable APIs, or imperative style are required by the project.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The spec MUST describe observed current behavior for `[AREA]`.
- **FR-002**: The spec MUST cite the repository paths that establish the behavior.
- **FR-003**: The spec MUST distinguish owned implementation from external dependency and host integration boundaries.
- **FR-004**: The spec MUST record stale-doc, ambiguity, or mismatch findings as TODOs/risks instead of fixing them.
- **FR-005**: Implementation-change specs MUST state how boundary parsing, unrepresentable invalid states, and immutable/functional defaults apply, or name the project exception.

### Key Entities *(include if applicable)*

- **Area**: The subsystem or project slice being documented.
- **Boundary**: Any external dependency, host API, environment variable, generated state, or platform behavior that affects the area.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every requirement in this spec maps to at least one checked-in source, docs, config, or test path.
- **SC-002**: Known mismatches/TODOs are listed in this artifact set.
- **SC-003**: The artifact set includes `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/`, and `tasks.md`.
- **SC-004**: Reviewer/verifier policy can fail implementation work that skips parser-first, unrepresentable-state, or immutable/functional defaults without a spec-named exception.

## Assumptions

- This is a documentation-only current-state baseline unless the artifact set is explicitly marked as an implementation-change spec.
- Existing runtime behavior is not changed as part of current-state specs.
