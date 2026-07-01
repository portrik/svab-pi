# Data Model: Pi Code Previews Current State

## Entities

### CodePreviewSettings

- **Purpose**: Current-state concept used by Pi Code Previews.
- **Source paths**: `extensions/pi-code-previews/index.ts`, `extensions/pi-code-previews/src/renderers.ts`, `extensions/pi-code-previews/src/settings.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### ToolRenderer

- **Purpose**: Current-state concept used by Pi Code Previews.
- **Source paths**: `extensions/pi-code-previews/index.ts`, `extensions/pi-code-previews/src/renderers.ts`, `extensions/pi-code-previews/src/settings.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### ShikiStatus

- **Purpose**: Current-state concept used by Pi Code Previews.
- **Source paths**: `extensions/pi-code-previews/index.ts`, `extensions/pi-code-previews/src/renderers.ts`, `extensions/pi-code-previews/src/settings.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### SettingsListItem

- **Purpose**: Current-state concept used by Pi Code Previews.
- **Source paths**: `extensions/pi-code-previews/index.ts`, `extensions/pi-code-previews/src/renderers.ts`, `extensions/pi-code-previews/src/settings.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### ToolSelection

- **Purpose**: Current-state concept used by Pi Code Previews.
- **Source paths**: `extensions/pi-code-previews/index.ts`, `extensions/pi-code-previews/src/renderers.ts`, `extensions/pi-code-previews/src/settings.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

## Relationships

- Pi Code Previews behavior is established by the source/config paths listed in `research.md`.
- Integration boundaries named in this file are external to the owned current-state spec unless a source path explicitly brings them into scope.

## State and Storage

`getAgentDir()/code-previews.json` plus compatibility reads from `~/.pi/settings.json`, `~/.pi/agent/settings.json`, agent settings, cwd `.pi/settings.json`, and legacy code-preview paths.

## Validation Rules

- Validate by inspecting source behavior: Loads code preview settings from multiple global/local settings paths and saves normalized settings to `getAgentDir()/code-previews.json`.
- Validate by inspecting source behavior: Initializes Shiki when syntax highlighting is enabled.
- Validate by inspecting source behavior: Registers `/code-preview-health` and `/code-preview-settings` commands.
- Validate by inspecting source behavior: On session start, registers renderers for supported tool outputs such as read, write, edit, grep, find, ls, and bash.
- Validate by inspecting source behavior: Settings control compact previews, syntax highlighting, collapsed line counts, path icons, bash warnings, secret warnings, and enabled tools.
