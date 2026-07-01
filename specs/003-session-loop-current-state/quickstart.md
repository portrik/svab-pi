# Quickstart: Session Loop Current State

## Purpose

Use this artifact set to understand the current behavior of Session Loop before changing it.

## Read Order

1. `spec.md` — behavior requirements and edge cases.
2. `research.md` — source-backed findings and TODOs.
3. `data-model.md` — entities, relationships, and state/storage.
4. `contracts/README.md` — commands, tools, APIs, and integration contracts.
5. `tasks.md` — documentation-maintenance checklist.

## Source Paths To Inspect

- `extensions/session-loop/index.ts` — source for Session Loop current-state behavior
- `extensions/session-loop/commands.ts` — source for Session Loop current-state behavior
- `extensions/session-loop/scheduler.ts` — source for Session Loop current-state behavior
- `extensions/session-loop/types.ts` — source for Session Loop current-state behavior
- `extensions/session-loop/tests/` — source for Session Loop current-state behavior
- `extensions/session-loop/README.md` — source for Session Loop current-state behavior

## Verification

```bash
npm --prefix extensions/session-loop test
npm --prefix extensions/session-loop run build
```

## Notes

- This artifact set is documentation-only.
- Do not infer product behavior from ignored local runtime state unless this spec explicitly names that state as a storage boundary.
