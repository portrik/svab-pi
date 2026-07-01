# Research: Repository Package and Tooling Current State

## Sources Inspected

- `package.json` — source for Repository Package and Tooling current-state behavior
- `package-lock.json` — source for Repository Package and Tooling current-state behavior
- `README.md` — source for Repository Package and Tooling current-state behavior
- `INTRODUCTION.md` — source for Repository Package and Tooling current-state behavior
- `CHANGELOG.md` — source for Repository Package and Tooling current-state behavior
- `AGENTS.md` — source for Repository Package and Tooling current-state behavior
- `.github/workflows/static-checks.yml` — source for Repository Package and Tooling current-state behavior
- `pi-core-changes/` — source for Repository Package and Tooling current-state behavior
- `docs/pi-core-worktree-source.md` — source for Repository Package and Tooling current-state behavior

## Current Behavior Findings

- `package.json` defines `svab-pi` as a pi package requiring Node.js >=24.16.0.
- The root pi extension list loads six local extension entrypoints plus bundled `@code-yeongyu/pi-nested-agents-md`, `pi-lsp-client`, and the local wrapper for `pi-mcp-adapter`.
- Root dependencies and overrides pin pi packages to the 0.79.x line while bundled dependencies package nested agents, LSP, and MCP adapter code.
- Static checks run per-extension test/build/check commands and a docs node test; there is no root `npm test` script.
- `pi-core-changes/` is a checked-in upstream core-change snapshot/test area, not the main local extension runtime.

## Integration Boundaries

- pi host package loader
- bundled dependencies in node_modules
- ignored local `.pi/` runtime state
- upstream pi core snapshot under `pi-core-changes/`

## Mismatches / TODOs

- Reconcile README pi 0.72.x badges/text with package dependencies pinned to 0.79.4 in a separate docs cleanup goal.

## Decisions

- **Decision**: Treat root `package.json` and CI workflow as canonical for current package/tooling behavior.
  - **Rationale**: This keeps the current-state baseline source-backed and documentation-only.
  - **Alternatives considered**: Fixing the behavior or stale docs now; rejected because this goal only creates specs.
