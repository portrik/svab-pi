# Research: Session Loop Current State

## Sources Inspected

- `extensions/session-loop/index.ts` — source for Session Loop current-state behavior
- `extensions/session-loop/commands.ts` — source for Session Loop current-state behavior
- `extensions/session-loop/scheduler.ts` — source for Session Loop current-state behavior
- `extensions/session-loop/types.ts` — source for Session Loop current-state behavior
- `extensions/session-loop/tests/` — source for Session Loop current-state behavior
- `extensions/session-loop/README.md` — source for Session Loop current-state behavior

## Current Behavior Findings

- Registers `/loop`, `/loop-stop`, `/loop-list`, and `/loop-stop-all` commands.
- `/loop` accepts an optional interval first token; if interval parsing fails, it defaults to `1m` and treats the entire input as the prompt.
- Scheduled jobs deliver prompts back to pi via `sendUserMessage(..., { deliverAs: "followUp" })`.
- `/loop-stop` can stop by id or use interactive selection when no id is provided.
- `/loop-stop-all` requires UI confirmation before stopping all active jobs.
- Session shutdown stops all jobs and waits briefly for cleanup.

## Integration Boundaries

- pi follow-up message delivery
- session lifetime only; no durable job persistence observed
- UI select/confirm availability

## Mismatches / TODOs

- If durable loops are desired later, add a separate feature; current behavior is session-scoped.

## Decisions

- **Decision**: Treat in-memory scheduling as the current product behavior.
  - **Rationale**: This keeps the current-state baseline source-backed and documentation-only.
  - **Alternatives considered**: Fixing the behavior or stale docs now; rejected because this goal only creates specs.
