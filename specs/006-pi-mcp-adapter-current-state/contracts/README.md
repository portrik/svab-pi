# Contracts: MCP Adapter Wrapper Current State

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| adapter wrapper | `compactMcpAdapter(pi)` | pi extension API object | upstream adapter with compact renderers | `extensions/pi-mcp-adapter/index.ts` |
| compact result rendering | `compactResultText(...)` | MCP result text/options/theme | one-line preview text | `extensions/pi-mcp-adapter/compact.ts` |

## Integration Boundaries

- external `pi-mcp-adapter` package
- MCP protocol/OAuth/server behavior
- pi TUI Text rendering
- tool result content block conventions

## Non-Contracts

- Internal helper functions are not public contracts unless surfaced through a registered command, registered tool, package field, CLI command, test command, or documented file layout.
- Ignored/generated local state is not a public contract unless this artifact explicitly names it as persisted runtime storage.
