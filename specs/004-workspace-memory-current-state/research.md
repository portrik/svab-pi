# Research: Workspace Memory Current State

## Sources Inspected

- `extensions/workspace-memory/index.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/commands.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/storage.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/recall.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/save.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/scoring.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/templates.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/tests/` — source for Workspace Memory current-state behavior

## Current Behavior Findings

- On session start, loads cached memory index for the workspace and updates UI status when memories exist.
- Before agent start, detects keywords, recalls relevant memories, can inject memory context into the system prompt, and suggests use of `memory_save` for important findings.
- Registers the `memory_save` tool with content/template/tags parameters.
- Registers `/memory` command handling list/show/save/delete/search/stats behavior.
- Recall updates scores and persists the memory index after recall.

## Integration Boundaries

- workspace cwd determines memory scope
- system prompt injection by pi hook
- local files under the agent/workspace memory storage paths
- heuristic keyword and scoring behavior

## Mismatches / TODOs

- None recorded.

## Decisions

- **Decision**: Treat recalled memories as contextual hints, not authoritative instructions.
  - **Rationale**: This keeps the current-state baseline source-backed and documentation-only.
  - **Alternatives considered**: Fixing the behavior or stale docs now; rejected because this goal only creates specs.
