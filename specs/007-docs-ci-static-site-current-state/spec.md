# Feature Specification: Docs and CI Static Site Current State

**Feature Branch**: `007-docs-ci-static-site-current-state`  
**Created**: 2026-07-01  
**Status**: Draft  
**Input**: Current repository behavior for Docs and CI Static Site

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Docs and CI Static Site behavior (Priority: P1)

A maintainer can read this artifact set to understand the current supported behavior and boundaries for Static docs site, feature HTML/CSS pages, video asset contract, local docs server, docs test, and CI check matrix.

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

- static HTTP server path allow-list
- large MP4 asset size and availability
- GitHub Actions Node 24.16.0 environment
- external browser rendering/accessibility behavior

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Current Docs and CI Static Site behavior MUST document that `docs/index.html` and related CSS/assets implement a static documentation site; feature pages live under `docs/features/`.
- **FR-002**: Current Docs and CI Static Site behavior MUST document that `scripts/serve-static-docs.mjs` serves files from `docs/` and `assets/`, maps `/` to `docs/index.html`, maps `/assets/*`, sets MIME types, and rejects paths outside allowed roots.
- **FR-003**: Current Docs and CI Static Site behavior MUST document that `tests/docs-index-workflow-video.test.mjs` validates workflow video markup, asset size, forbidden branding absence, hero ASCII, and static server behavior.
- **FR-004**: Current Docs and CI Static Site behavior MUST document that The CI workflow runs extension checks in a matrix and runs the docs node test as a separate docs job.
- **FR-005**: Current Docs and CI Static Site behavior MUST document that Docs are static HTML/CSS/asset files; there is no checked-in site build step.
- **FR-006**: This artifact set MUST cite checked-in paths for every material behavior claim.
- **FR-007**: This artifact set MUST label external dependencies, generated state, host APIs, feature flags, and platform behavior as boundaries.

### Key Entities *(include if feature involves data)*

- **StaticDocsSite**: Current-state concept documented for Docs and CI Static Site.
- **FeaturePage**: Current-state concept documented for Docs and CI Static Site.
- **WorkflowVideoAsset**: Current-state concept documented for Docs and CI Static Site.
- **DocsServer**: Current-state concept documented for Docs and CI Static Site.
- **StaticChecksWorkflow**: Current-state concept documented for Docs and CI Static Site.

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
