# Data Model: Agentic Harness Current State

## Entities

### ClarificationState

- **Purpose**: Current-state concept used by Agentic Harness.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-*.ts`, `extensions/agentic-harness/clarification-*.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### GoalState

- **Purpose**: Current-state concept used by Agentic Harness.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-*.ts`, `extensions/agentic-harness/clarification-*.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### GoalItem

- **Purpose**: Current-state concept used by Agentic Harness.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-*.ts`, `extensions/agentic-harness/clarification-*.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### SubgoalItem

- **Purpose**: Current-state concept used by Agentic Harness.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-*.ts`, `extensions/agentic-harness/clarification-*.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### GoalVerifierReceipt

- **Purpose**: Current-state concept used by Agentic Harness.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-*.ts`, `extensions/agentic-harness/clarification-*.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### TeamRun

- **Purpose**: Current-state concept used by Agentic Harness.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-*.ts`, `extensions/agentic-harness/clarification-*.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### SandboxPolicy

- **Purpose**: Current-state concept used by Agentic Harness.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-*.ts`, `extensions/agentic-harness/clarification-*.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### HarnessTodo

- **Purpose**: Current-state concept used by Agentic Harness.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-*.ts`, `extensions/agentic-harness/clarification-*.ts`, ...
- **Lifecycle / ownership**: Owned by the checked-in implementation or configuration listed above.

### CodeQualityPolicy

- **Purpose**: Reviewer/verifier enforcement guidance for boundary parsing, unrepresentable invalid states, immutable/functional defaults, and documented exceptions.
- **Source paths**: `extensions/agentic-harness/index.ts`, `extensions/agentic-harness/goal-verifier.ts`, `extensions/agentic-harness/validator-template.ts`, `extensions/agentic-harness/discipline.ts`, `extensions/agentic-harness/agents/`, `extensions/agentic-harness/skills/`.
- **Lifecycle / ownership**: Injected into prompts and checked by tests under `extensions/agentic-harness/tests/`.

## Relationships

- Agentic Harness behavior is established by the source/config paths listed in `research.md`.
- Integration boundaries named in this file are external to the owned current-state spec unless a source path explicitly brings them into scope.

## State and Storage

Durable JSON snapshots under `.pi/agent/goal-state`, `.pi/agent/clarification-state`, `.pi/agent/runs`, and harness/team state roots.

## Parsing, Invariants, and Validation Rules

- Parse/review by inspecting source behavior: code-quality guidance prefers boundary parsing over scattered validation, unrepresentable invalid states where practical, and immutable/functional defaults unless project exceptions are documented.
- Required validation remains allowed for TypeBox/tool schemas, host contracts, trust boundaries, performance constraints, and platform-mutable APIs.
- Validate by inspecting source behavior: Registers `/clarify`, `/goal`, `/review`, `/ask`, `/setup`, `/init`, `/reset-phase`, and `/team` commands from the extension entrypoint.
- Validate by inspecting source behavior: Registers LLM tools including `ask_user_question`, `clarification_state`, `subagent`, `webfetch`, sandboxed bash replacement, and gated `team` when root-session/team-mode conditions allow.
- Validate by inspecting source behavior: Maintains durable clarification and goal state as JSON snapshots and session replay events under `.pi/agent/*-state/`.
- Validate by inspecting source behavior: Goal completion is verifier-gated: evidence is recorded, completion is requested, `reviewer-verifier` runs, and only PASS receipts allow completion.
- Validate by inspecting source behavior: Team mode is disabled by default and requires `PI_ENABLE_TEAM_MODE=1`; workers run with `PI_TEAM_WORKER=1` to suppress recursive orchestration.
- Validate by inspecting source behavior: Sandbox approval behavior depends on `PI_SANDBOX_APPROVAL_MODE`; sandboxed bash registration is OS/env-dependent.
