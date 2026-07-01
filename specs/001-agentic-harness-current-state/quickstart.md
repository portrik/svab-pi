# Quickstart: Agentic Harness Current State

## Purpose

Use this artifact set to understand the current behavior of Agentic Harness before changing it.

## Read Order

1. `spec.md` — behavior requirements and edge cases.
2. `research.md` — source-backed findings and TODOs.
3. `data-model.md` — entities, relationships, and state/storage.
4. `contracts/README.md` — commands, tools, APIs, and integration contracts.
5. `tasks.md` — documentation-maintenance checklist.

## Source Paths To Inspect

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

## Verification

```bash
npm --prefix extensions/agentic-harness test
npm --prefix extensions/agentic-harness run build
```

## Notes

- This artifact set is documentation-only.
- Do not infer product behavior from ignored local runtime state unless this spec explicitly names that state as a storage boundary.
