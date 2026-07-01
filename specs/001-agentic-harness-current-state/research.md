# Research: Agentic Harness Current State

## Sources Inspected

- `extensions/agentic-harness/index.ts` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/goal-*.ts` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/clarification-*.ts` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/subagent.ts` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/team*.ts` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/sandbox/` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/agents/` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/skills/` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/tests/` — source for Agentic Harness current-state behavior
- `extensions/agentic-harness/README.md` — source for Agentic Harness current-state behavior

## Current Behavior Findings

- Registers `/clarify`, `/goal`, `/review`, `/ask`, `/setup`, `/init`, `/reset-phase`, and `/team` commands from the extension entrypoint.
- Registers LLM tools including `ask_user_question`, `clarification_state`, `subagent`, `webfetch`, sandboxed bash replacement, and gated `team` when root-session/team-mode conditions allow.
- Maintains durable clarification and goal state as JSON snapshots and session replay events under `.pi/agent/*-state/`.
- Goal completion is verifier-gated: evidence is recorded, completion is requested, `reviewer-verifier` runs, and only PASS receipts allow completion.
- Team mode is disabled by default and requires `PI_ENABLE_TEAM_MODE=1`; workers run with `PI_TEAM_WORKER=1` to suppress recursive orchestration.
- Sandbox approval behavior depends on `PI_SANDBOX_APPROVAL_MODE`; sandboxed bash registration is OS/env-dependent.

## Integration Boundaries

- pi extension API and UI APIs
- subagent pi subprocesses
- tmux availability
- Linux/macOS sandbox adapters
- environment flags `PI_ENABLE_TEAM_MODE`, `PI_TEAM_WORKER`, `PI_SANDBOX_APPROVAL_MODE`, `PI_AGENTIC_SANDBOX_BASH`, `PI_AGENTIC_MICROCOMPACTION`, `PI_AGENTIC_FOOTER_GLYPHS`

## Mismatches / TODOs

- README still describes pi v0.72 compatibility while root package pins 0.79.x; document-only here, fix separately if desired.

## Decisions

- **Decision**: Treat `extensions/agentic-harness/index.ts` plus focused state/verifier modules as canonical over README prose where they differ.
  - **Rationale**: This keeps the current-state baseline source-backed and documentation-only.
  - **Alternatives considered**: Fixing the behavior or stale docs now; rejected because this goal only creates specs.
