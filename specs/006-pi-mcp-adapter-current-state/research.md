# Research: MCP Adapter Wrapper Current State

## Sources Inspected

- `extensions/pi-mcp-adapter/index.ts` — source for MCP Adapter Wrapper current-state behavior
- `extensions/pi-mcp-adapter/compact.ts` — source for MCP Adapter Wrapper current-state behavior
- `extensions/pi-mcp-adapter/tests/` — source for MCP Adapter Wrapper current-state behavior
- `package.json` — source for MCP Adapter Wrapper current-state behavior

## Current Behavior Findings

- Root package loads `extensions/pi-mcp-adapter/index.ts` instead of the upstream adapter entrypoint directly.
- The wrapper imports the upstream adapter from `node_modules/pi-mcp-adapter/index.ts` and invokes it once through a proxied `pi` object.
- The proxy intercepts `registerTool` and replaces tool `renderCall`/`renderResult` functions with compact one-line renderers.
- Renderer failures fall back to original upstream renderers when available.
- MCP engine behavior, protocol/OAuth/UI stack, and server integration remain owned by the upstream dependency.

## Integration Boundaries

- external `pi-mcp-adapter` package
- MCP protocol/OAuth/server behavior
- pi TUI Text rendering
- tool result content block conventions

## Mismatches / TODOs

- Consider adding a local package/CI entry for pi-mcp-adapter tests in a separate tooling goal.

## Decisions

- **Decision**: Treat upstream MCP adapter internals as an external integration boundary.
  - **Rationale**: This keeps the current-state baseline source-backed and documentation-only.
  - **Alternatives considered**: Fixing the behavior or stale docs now; rejected because this goal only creates specs.
