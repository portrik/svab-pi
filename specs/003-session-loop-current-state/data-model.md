# Data Model: Session Loop Current State

## Entities

### JobScheduler

- **Purpose**: Current-state concept used by Session Loop.
- **Source paths**: `extensions/session-loop/index.ts`, `extensions/session-loop/commands.ts`, `extensions/session-loop/scheduler.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### LoopJob

- **Purpose**: Current-state concept used by Session Loop.
- **Source paths**: `extensions/session-loop/index.ts`, `extensions/session-loop/commands.ts`, `extensions/session-loop/scheduler.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### LoopError

- **Purpose**: Current-state concept used by Session Loop.
- **Source paths**: `extensions/session-loop/index.ts`, `extensions/session-loop/commands.ts`, `extensions/session-loop/scheduler.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### Interval

- **Purpose**: Current-state concept used by Session Loop.
- **Source paths**: `extensions/session-loop/index.ts`, `extensions/session-loop/commands.ts`, `extensions/session-loop/scheduler.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

## Relationships

- Session Loop behavior is established by the source/config paths listed in `research.md`.
- Integration boundaries named in this file are external to the owned current-state spec unless a source path explicitly brings them into scope.

## State and Storage

In-memory scheduler state for the active session.

## Validation Rules

- Validate by inspecting source behavior: Registers `/loop`, `/loop-stop`, `/loop-list`, and `/loop-stop-all` commands.
- Validate by inspecting source behavior: `/loop` accepts an optional interval first token; if interval parsing fails, it defaults to `1m` and treats the entire input as the prompt.
- Validate by inspecting source behavior: Scheduled jobs deliver prompts back to pi via `sendUserMessage(..., { deliverAs: "followUp" })`.
- Validate by inspecting source behavior: `/loop-stop` can stop by id or use interactive selection when no id is provided.
- Validate by inspecting source behavior: `/loop-stop-all` requires UI confirmation before stopping all active jobs.
- Validate by inspecting source behavior: Session shutdown stops all jobs and waits briefly for cleanup.
