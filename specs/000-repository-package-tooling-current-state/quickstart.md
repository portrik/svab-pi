# Quickstart: Repository Package and Tooling Current State

## Purpose

Use this artifact set to understand the current behavior of Repository Package and Tooling before changing it.

## Read Order

1. `spec.md` — behavior requirements and edge cases.
2. `research.md` — source-backed findings and TODOs.
3. `data-model.md` — entities, relationships, and state/storage.
4. `contracts/README.md` — commands, tools, APIs, and integration contracts.
5. `tasks.md` — documentation-maintenance checklist.

## Source Paths To Inspect

- `package.json` — source for Repository Package and Tooling current-state behavior
- `package-lock.json` — source for Repository Package and Tooling current-state behavior
- `README.md` — source for Repository Package and Tooling current-state behavior
- `INTRODUCTION.md` — source for Repository Package and Tooling current-state behavior
- `CHANGELOG.md` — source for Repository Package and Tooling current-state behavior
- `AGENTS.md` — source for Repository Package and Tooling current-state behavior
- `.github/workflows/static-checks.yml` — source for Repository Package and Tooling current-state behavior
- `pi-core-changes/` — source for Repository Package and Tooling current-state behavior
- `docs/pi-core-worktree-source.md` — source for Repository Package and Tooling current-state behavior

## Verification

```bash
node --test tests/docs-index-workflow-video.test.mjs
npm --prefix extensions/agentic-harness test && npm --prefix extensions/agentic-harness run build
per-extension CI commands listed in `.github/workflows/static-checks.yml`
```

## Notes

- This artifact set is documentation-only.
- Do not infer product behavior from ignored local runtime state unless this spec explicitly names that state as a storage boundary.
