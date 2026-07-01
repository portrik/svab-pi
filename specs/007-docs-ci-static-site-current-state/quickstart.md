# Quickstart: Docs and CI Static Site Current State

## Purpose

Use this artifact set to understand the current behavior of Docs and CI Static Site before changing it.

## Read Order

1. `spec.md` — behavior requirements and edge cases.
2. `research.md` — source-backed findings and TODOs.
3. `data-model.md` — entities, relationships, and state/storage.
4. `contracts/README.md` — commands, tools, APIs, and integration contracts.
5. `tasks.md` — documentation-maintenance checklist.

## Source Paths To Inspect

- `docs/index.html` — source for Docs and CI Static Site current-state behavior
- `docs/style.css` — source for Docs and CI Static Site current-state behavior
- `docs/features/` — source for Docs and CI Static Site current-state behavior
- `docs/assets/workflow-command-video.mp4` — source for Docs and CI Static Site current-state behavior
- `assets/` — source for Docs and CI Static Site current-state behavior
- `scripts/serve-static-docs.mjs` — source for Docs and CI Static Site current-state behavior
- `tests/docs-index-workflow-video.test.mjs` — source for Docs and CI Static Site current-state behavior
- `.github/workflows/static-checks.yml` — source for Docs and CI Static Site current-state behavior

## Verification

```bash
node --test tests/docs-index-workflow-video.test.mjs
```

## Notes

- This artifact set is documentation-only.
- Do not infer product behavior from ignored local runtime state unless this spec explicitly names that state as a storage boundary.
