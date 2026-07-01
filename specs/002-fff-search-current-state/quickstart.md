# Quickstart: FFF Search Current State

## Purpose

Use this artifact set to understand the current behavior of FFF Search before changing it.

## Read Order

1. `spec.md` — behavior requirements and edge cases.
2. `research.md` — source-backed findings and TODOs.
3. `data-model.md` — entities, relationships, and state/storage.
4. `contracts/README.md` — commands, tools, APIs, and integration contracts.
5. `tasks.md` — documentation-maintenance checklist.

## Source Paths To Inspect

- `extensions/fff-search/index.ts` — source for FFF Search current-state behavior
- `extensions/fff-search/package.json` — source for FFF Search current-state behavior
- `extensions/fff-search/tests/index.test.ts` — source for FFF Search current-state behavior
- `README.md` — source for FFF Search current-state behavior

## Verification

```bash
npm --prefix extensions/fff-search test
npm --prefix extensions/fff-search run build
```

## Notes

- This artifact set is documentation-only.
- Do not infer product behavior from ignored local runtime state unless this spec explicitly names that state as a storage boundary.
