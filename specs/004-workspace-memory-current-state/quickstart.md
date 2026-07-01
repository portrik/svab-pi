# Quickstart: Workspace Memory Current State

## Purpose

Use this artifact set to understand the current behavior of Workspace Memory before changing it.

## Read Order

1. `spec.md` — behavior requirements and edge cases.
2. `research.md` — source-backed findings and TODOs.
3. `data-model.md` — entities, relationships, and state/storage.
4. `contracts/README.md` — commands, tools, APIs, and integration contracts.
5. `tasks.md` — documentation-maintenance checklist.

## Source Paths To Inspect

- `extensions/workspace-memory/index.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/commands.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/storage.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/recall.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/save.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/scoring.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/templates.ts` — source for Workspace Memory current-state behavior
- `extensions/workspace-memory/tests/` — source for Workspace Memory current-state behavior

## Verification

```bash
npm --prefix extensions/workspace-memory test
npm --prefix extensions/workspace-memory run build
```

## Notes

- This artifact set is documentation-only.
- Do not infer product behavior from ignored local runtime state unless this spec explicitly names that state as a storage boundary.
