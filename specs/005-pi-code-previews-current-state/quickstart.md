# Quickstart: Pi Code Previews Current State

## Purpose

Use this artifact set to understand the current behavior of Pi Code Previews before changing it.

## Read Order

1. `spec.md` — behavior requirements and edge cases.
2. `research.md` — source-backed findings and TODOs.
3. `data-model.md` — entities, relationships, and state/storage.
4. `contracts/README.md` — commands, tools, APIs, and integration contracts.
5. `tasks.md` — documentation-maintenance checklist.

## Source Paths To Inspect

- `extensions/pi-code-previews/index.ts` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/src/renderers.ts` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/src/settings.ts` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/src/settings-store.ts` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/src/tool-renderers/` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/tests/` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/package.json` — source for Pi Code Previews current-state behavior
- `extensions/pi-code-previews/README.md` — source for Pi Code Previews current-state behavior

## Verification

```bash
npm --prefix extensions/pi-code-previews test
npm --prefix extensions/pi-code-previews run check
```

## Notes

- This artifact set is documentation-only.
- Do not infer product behavior from ignored local runtime state unless this spec explicitly names that state as a storage boundary.
