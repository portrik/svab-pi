# Data Model: Repository Package and Tooling Current State

## Entities

### PiPackage

- **Purpose**: Current-state concept used by Repository Package and Tooling.
- **Source paths**: `package.json`, `package-lock.json`, `README.md`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### ExtensionEntrypoint

- **Purpose**: Current-state concept used by Repository Package and Tooling.
- **Source paths**: `package.json`, `package-lock.json`, `README.md`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### BundledDependency

- **Purpose**: Current-state concept used by Repository Package and Tooling.
- **Source paths**: `package.json`, `package-lock.json`, `README.md`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### StaticCheckJob

- **Purpose**: Current-state concept used by Repository Package and Tooling.
- **Source paths**: `package.json`, `package-lock.json`, `README.md`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### CoreChangeSnapshot

- **Purpose**: Current-state concept used by Repository Package and Tooling.
- **Source paths**: `package.json`, `package-lock.json`, `README.md`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

## Relationships

- Repository Package and Tooling behavior is established by the source/config paths listed in `research.md`.
- Integration boundaries named in this file are external to the owned current-state spec unless a source path explicitly brings them into scope.

## State and Storage

Root package/lock files plus generated local runtime state under `.pi/` that is excluded from product behavior.

## Validation Rules

- Validate by inspecting source behavior: `package.json` defines `svab-pi` as a pi package requiring Node.js >=24.16.0.
- Validate by inspecting source behavior: The root pi extension list loads six local extension entrypoints plus bundled `@code-yeongyu/pi-nested-agents-md`, `pi-lsp-client`, and the local wrapper for `pi-mcp-adapter`.
- Validate by inspecting source behavior: Root dependencies and overrides pin pi packages to the 0.79.x line while bundled dependencies package nested agents, LSP, and MCP adapter code.
- Validate by inspecting source behavior: Static checks run per-extension test/build/check commands and a docs node test; there is no root `npm test` script.
- Validate by inspecting source behavior: `pi-core-changes/` is a checked-in upstream core-change snapshot/test area, not the main local extension runtime.
