# Research: Docs and CI Static Site Current State

## Sources Inspected

- `docs/index.html` — source for Docs and CI Static Site current-state behavior
- `docs/style.css` — source for Docs and CI Static Site current-state behavior
- `docs/features/` — source for Docs and CI Static Site current-state behavior
- `docs/assets/workflow-command-video.mp4` — source for Docs and CI Static Site current-state behavior
- `assets/` — source for Docs and CI Static Site current-state behavior
- `scripts/serve-static-docs.mjs` — source for Docs and CI Static Site current-state behavior
- `tests/docs-index-workflow-video.test.mjs` — source for Docs and CI Static Site current-state behavior
- `.github/workflows/static-checks.yml` — source for Docs and CI Static Site current-state behavior

## Current Behavior Findings

- `docs/index.html` and related CSS/assets implement a static documentation site; feature pages live under `docs/features/`.
- `scripts/serve-static-docs.mjs` serves files from `docs/` and `assets/`, maps `/` to `docs/index.html`, maps `/assets/*`, sets MIME types, and rejects paths outside allowed roots.
- `tests/docs-index-workflow-video.test.mjs` validates workflow video markup, asset size, forbidden branding absence, hero ASCII, and static server behavior.
- The CI workflow runs extension checks in a matrix and runs the docs node test as a separate docs job.
- Docs are static HTML/CSS/asset files; there is no checked-in site build step.

## Integration Boundaries

- static HTTP server path allow-list
- large MP4 asset size and availability
- GitHub Actions Node 24.16.0 environment
- external browser rendering/accessibility behavior

## Mismatches / TODOs

- None recorded.

## Decisions

- **Decision**: Treat checked-in static files as canonical; no generated docs build artifacts are required.
  - **Rationale**: This keeps the current-state baseline source-backed and documentation-only.
  - **Alternatives considered**: Fixing the behavior or stale docs now; rejected because this goal only creates specs.
