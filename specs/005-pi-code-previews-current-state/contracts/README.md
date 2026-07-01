# Contracts: Pi Code Previews Current State

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| /code-preview-health | `pi.registerCommand("code-preview-health")` | none | overlay health panel | `extensions/pi-code-previews/index.ts` |
| /code-preview-settings | `pi.registerCommand("code-preview-settings")` | interactive settings edits | saved preview settings | `extensions/pi-code-previews/index.ts` |
| tool renderers | `registerToolRenderers(...)` | tool result payloads | compact/syntax-highlighted TUI previews | `extensions/pi-code-previews/src/renderers.ts` |

## Integration Boundaries

- pi tool renderer API
- Shiki initialization/cache
- global/local pi settings files
- terminal width and TUI rendering
- optional oxlint/oxfmt checks in this extension package

## Non-Contracts

- Internal helper functions are not public contracts unless surfaced through a registered command, registered tool, package field, CLI command, test command, or documented file layout.
- Ignored/generated local state is not a public contract unless this artifact explicitly names it as persisted runtime storage.
