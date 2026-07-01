# Verification Evidence

**Date**: 2026-07-01  
**Scope**: Documentation-only Spec Kit current-state coverage.

## Created / Updated Artifacts

- `.specify/README.md`
- `.specify/memory/constitution.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/plan-template.md`
- `.specify/templates/research-template.md`
- `.specify/templates/data-model-template.md`
- `.specify/templates/quickstart-template.md`
- `.specify/templates/contracts-template.md`
- `.specify/templates/tasks-template.md`
- `specs/README.md`
- `specs/current-state-cross-check.md`
- `specs/verification-evidence.md`
- 8 area directories under `specs/000-*` through `specs/007-*`, each with:
  - `spec.md`
  - `plan.md`
  - `research.md`
  - `data-model.md`
  - `quickstart.md`
  - `contracts/README.md`
  - `tasks.md`

## Area Mapping

| Area | Artifact set |
|------|--------------|
| Repository package/tooling | `specs/000-repository-package-tooling-current-state/` |
| Agentic harness | `specs/001-agentic-harness-current-state/` |
| FFF search | `specs/002-fff-search-current-state/` |
| Session loop | `specs/003-session-loop-current-state/` |
| Workspace memory | `specs/004-workspace-memory-current-state/` |
| Pi code previews | `specs/005-pi-code-previews-current-state/` |
| MCP adapter | `specs/006-pi-mcp-adapter-current-state/` |
| Docs and CI static site | `specs/007-docs-ci-static-site-current-state/` |

## Logged Mismatches / TODOs

1. `README.md` and extension READMEs still mention pi `0.72.x`, while package files pin `@earendil-works/pi-*` dependencies around `^0.79.4`.
2. `extensions/pi-mcp-adapter/` has local tests but no local `package.json` or CI matrix entry.
3. `extensions/session-loop` is currently in-memory/session-scoped; durable loop jobs would be a future feature.

## Commands Run

### Docs test

```bash
node --test tests/docs-index-workflow-video.test.mjs
```

Result: PASS

```text
✔ docs index includes workflow video contract
✔ workflow MP4 asset exists and has non-trivial size
✔ forbidden BETRO/BYER branding text is absent
✔ hero ASCII banner is readable SVAB PI text
✔ workflow video CSS hooks and reduced-motion fallback exist
✔ static docs server serves /docs/* and assets and blocks traversal
ℹ tests 6
ℹ pass 6
ℹ fail 0
```

### Spec structure / placeholder check

```bash
node - <<'JS'
// verifies 8 area dirs, required 7 files per area, and no placeholder markers
JS
```

Result: PASS

```text
Spec structure OK: 8 area dirs x 7 required files; no placeholder markers.
```

## Commands Intentionally Not Run

Extension package test/build/check commands were not run for this goal because the requested work is documentation-only and did not modify runtime TypeScript, packages, dependencies, or CI behavior. Existing per-extension verification commands are documented in the relevant `quickstart.md` and `plan.md` artifacts.
