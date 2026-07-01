# Data Model: Docs and CI Static Site Current State

## Entities

### StaticDocsSite

- **Purpose**: Current-state concept used by Docs and CI Static Site.
- **Source paths**: `docs/index.html`, `docs/style.css`, `docs/features/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### FeaturePage

- **Purpose**: Current-state concept used by Docs and CI Static Site.
- **Source paths**: `docs/index.html`, `docs/style.css`, `docs/features/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### WorkflowVideoAsset

- **Purpose**: Current-state concept used by Docs and CI Static Site.
- **Source paths**: `docs/index.html`, `docs/style.css`, `docs/features/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### DocsServer

- **Purpose**: Current-state concept used by Docs and CI Static Site.
- **Source paths**: `docs/index.html`, `docs/style.css`, `docs/features/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### StaticChecksWorkflow

- **Purpose**: Current-state concept used by Docs and CI Static Site.
- **Source paths**: `docs/index.html`, `docs/style.css`, `docs/features/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

## Relationships

- Docs and CI Static Site behavior is established by the source/config paths listed in `research.md`.
- Integration boundaries named in this file are external to the owned current-state spec unless a source path explicitly brings them into scope.

## State and Storage

Checked-in docs/assets files only; local server holds no persistent state.

## Validation Rules

- Validate by inspecting source behavior: `docs/index.html` and related CSS/assets implement a static documentation site; feature pages live under `docs/features/`.
- Validate by inspecting source behavior: `scripts/serve-static-docs.mjs` serves files from `docs/` and `assets/`, maps `/` to `docs/index.html`, maps `/assets/*`, sets MIME types, and rejects paths outside allowed roots.
- Validate by inspecting source behavior: `tests/docs-index-workflow-video.test.mjs` validates workflow video markup, asset size, forbidden branding absence, hero ASCII, and static server behavior.
- Validate by inspecting source behavior: The CI workflow runs extension checks in a matrix and runs the docs node test as a separate docs job.
- Validate by inspecting source behavior: Docs are static HTML/CSS/asset files; there is no checked-in site build step.
