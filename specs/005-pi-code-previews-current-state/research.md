# Research: Pi Code Previews Current State

## Sources Inspected

- `extensions/pi-code-previews/index.ts` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/src/renderers.ts` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/src/settings.ts` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/src/settings-store.ts` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/src/tool-renderers/` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/tests/` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/package.json` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/README.md` — source for Pi Code Previews current-state behavior

## Current Behavior Findings

- Loads code preview settings from multiple global/local settings paths and saves normalized settings to `getAgentDir()/code-previews.json`.
- Initializes Shiki when syntax highlighting is enabled.
- Registers `/code-preview-health` and `/code-preview-settings` commands.
- On session start, registers renderers for supported tool outputs such as read, write, edit, grep, find, ls, and bash.
- Settings control compact previews, syntax highlighting, collapsed line counts, path icons, bash warnings, secret warnings, and enabled tools.

## Integration Boundaries

- pi tool renderer API
- Shiki initialization/cache
- global/local pi settings files
- terminal width and TUI rendering
- optional oxlint/oxfmt checks in this extension package

## Mismatches / TODOs

- None recorded.

## Decisions

- **Decision**: Treat rendering as presentation-only: it must not change tool execution results.
  - **Rationale**: This keeps the current-state baseline source-backed and documentation-only.
  - **Alternatives considered**: Fixing the behavior or stale docs now; rejected because this goal only creates specs.
