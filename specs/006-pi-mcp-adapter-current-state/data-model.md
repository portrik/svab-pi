# Data Model: MCP Adapter Wrapper Current State

## Entities

### CompactMcpAdapter

- **Purpose**: Current-state concept used by MCP Adapter Wrapper.
- **Source paths**: `extensions/pi-mcp-adapter/index.ts`, `extensions/pi-mcp-adapter/compact.ts`, `extensions/pi-mcp-adapter/tests/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### ProxiedPi

- **Purpose**: Current-state concept used by MCP Adapter Wrapper.
- **Source paths**: `extensions/pi-mcp-adapter/index.ts`, `extensions/pi-mcp-adapter/compact.ts`, `extensions/pi-mcp-adapter/tests/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### McpToolSpec

- **Purpose**: Current-state concept used by MCP Adapter Wrapper.
- **Source paths**: `extensions/pi-mcp-adapter/index.ts`, `extensions/pi-mcp-adapter/compact.ts`, `extensions/pi-mcp-adapter/tests/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### CompactCallRenderer

- **Purpose**: Current-state concept used by MCP Adapter Wrapper.
- **Source paths**: `extensions/pi-mcp-adapter/index.ts`, `extensions/pi-mcp-adapter/compact.ts`, `extensions/pi-mcp-adapter/tests/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### CompactResultRenderer

- **Purpose**: Current-state concept used by MCP Adapter Wrapper.
- **Source paths**: `extensions/pi-mcp-adapter/index.ts`, `extensions/pi-mcp-adapter/compact.ts`, `extensions/pi-mcp-adapter/tests/`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

## Relationships

- MCP Adapter Wrapper behavior is established by the source/config paths listed in `research.md`.
- Integration boundaries named in this file are external to the owned current-state spec unless a source path explicitly brings them into scope.

## State and Storage

No local persistent storage in the wrapper; upstream adapter may manage its own state outside this local scope.

## Validation Rules

- Validate by inspecting source behavior: Root package loads `extensions/pi-mcp-adapter/index.ts` instead of the upstream adapter entrypoint directly.
- Validate by inspecting source behavior: The wrapper imports the upstream adapter from `node_modules/pi-mcp-adapter/index.ts` and invokes it once through a proxied `pi` object.
- Validate by inspecting source behavior: The proxy intercepts `registerTool` and replaces tool `renderCall`/`renderResult` functions with compact one-line renderers.
- Validate by inspecting source behavior: Renderer failures fall back to original upstream renderers when available.
- Validate by inspecting source behavior: MCP engine behavior, protocol/OAuth/UI stack, and server integration remain owned by the upstream dependency.
