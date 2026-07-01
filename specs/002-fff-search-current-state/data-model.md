# Data Model: FFF Search Current State

## Entities

### FileFinder

- **Purpose**: Current-state concept used by FFF Search.
- **Source paths**: `extensions/fff-search/index.ts`, `extensions/fff-search/package.json`, `extensions/fff-search/tests/index.test.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### CursorStore

- **Purpose**: Current-state concept used by FFF Search.
- **Source paths**: `extensions/fff-search/index.ts`, `extensions/fff-search/package.json`, `extensions/fff-search/tests/index.test.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### GrepCursor

- **Purpose**: Current-state concept used by FFF Search.
- **Source paths**: `extensions/fff-search/index.ts`, `extensions/fff-search/package.json`, `extensions/fff-search/tests/index.test.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### FffMode

- **Purpose**: Current-state concept used by FFF Search.
- **Source paths**: `extensions/fff-search/index.ts`, `extensions/fff-search/package.json`, `extensions/fff-search/tests/index.test.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### AutocompleteItem

- **Purpose**: Current-state concept used by FFF Search.
- **Source paths**: `extensions/fff-search/index.ts`, `extensions/fff-search/package.json`, `extensions/fff-search/tests/index.test.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

## Relationships

- FFF Search behavior is established by the source/config paths listed in `research.md`.
- Integration boundaries named in this file are external to the owned current-state spec unless a source path explicitly brings them into scope.

## State and Storage

FFF database/config files under `getAgentDir()/fff`: `frecency.mdb`, `history.mdb`, `config.json`.

## Validation Rules

- Validate by inspecting source behavior: Overrides built-in `find` and `grep` tools with FFF-backed implementations and registers `multi_grep` for multi-pattern OR search.
- Validate by inspecting source behavior: Can replace @-mention file autocomplete unless mode is `tools-only`.
- Validate by inspecting source behavior: Uses persistent FFF frecency/history/config files under the pi agent directory.
- Validate by inspecting source behavior: Falls back to built-in find/grep when the native FFF engine is unavailable, at filesystem root/home, or initial scan fails/times out.
- Validate by inspecting source behavior: Exposes `/fff-mode`, `/fff-health`, and `/fff-rescan` commands.
