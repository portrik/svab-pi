# Data Model: Workspace Memory Current State

## Entities

### WorkspaceMemory

- **Purpose**: Current-state concept used by Workspace Memory.
- **Source paths**: `extensions/workspace-memory/index.ts`, `extensions/workspace-memory/commands.ts`, `extensions/workspace-memory/storage.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### MemoryIndex

- **Purpose**: Current-state concept used by Workspace Memory.
- **Source paths**: `extensions/workspace-memory/index.ts`, `extensions/workspace-memory/commands.ts`, `extensions/workspace-memory/storage.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### MemoryTemplate

- **Purpose**: Current-state concept used by Workspace Memory.
- **Source paths**: `extensions/workspace-memory/index.ts`, `extensions/workspace-memory/commands.ts`, `extensions/workspace-memory/storage.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### RecallScore

- **Purpose**: Current-state concept used by Workspace Memory.
- **Source paths**: `extensions/workspace-memory/index.ts`, `extensions/workspace-memory/commands.ts`, `extensions/workspace-memory/storage.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### MemoryMetadata

- **Purpose**: Current-state concept used by Workspace Memory.
- **Source paths**: `extensions/workspace-memory/index.ts`, `extensions/workspace-memory/commands.ts`, `extensions/workspace-memory/storage.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

## Relationships

- Workspace Memory behavior is established by the source/config paths listed in `research.md`.
- Integration boundaries named in this file are external to the owned current-state spec unless a source path explicitly brings them into scope.

## State and Storage

Workspace-local memory index and memory files managed by `storage.ts` under the extension storage conventions.

## Validation Rules

- Validate by inspecting source behavior: On session start, loads cached memory index for the workspace and updates UI status when memories exist.
- Validate by inspecting source behavior: Before agent start, detects keywords, recalls relevant memories, can inject memory context into the system prompt, and suggests use of `memory_save` for important findings.
- Validate by inspecting source behavior: Registers the `memory_save` tool with content/template/tags parameters.
- Validate by inspecting source behavior: Registers `/memory` command handling list/show/save/delete/search/stats behavior.
- Validate by inspecting source behavior: Recall updates scores and persists the memory index after recall.
