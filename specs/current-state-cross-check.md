# Current-State Spec Cross-Check

**Date**: 2026-07-01  
**Scope**: Documentation-only cross-check for root Spec Kit artifacts in `specs/`.

## Artifact Structure Checked

- `specs/README.md` maps 8 major repository areas.
- Each area `000` through `007` contains:
  - `spec.md`
  - `plan.md`
  - `research.md`
  - `data-model.md`
  - `quickstart.md`
  - `contracts/README.md`
  - `tasks.md`

## Representative Source Checks

| Area | Representative files checked | Result |
|------|------------------------------|--------|
| Repository package/tooling | `package.json`, `.github/workflows/static-checks.yml`, `README.md`, `pi-core-changes/` | Specs match extension registration, Node requirement, CI matrix, and pi-core boundary. |
| Agentic harness | `extensions/agentic-harness/index.ts`, `goal-*.ts`, `clarification-*.ts`, `team*.ts`, `sandbox/`, README | Specs match commands/tools, durable state, verifier guard, team gating, env/platform boundaries. |
| FFF search | `extensions/fff-search/index.ts`, package/tests | Specs match tool overrides, `multi_grep`, autocomplete, mode/health/rescan commands, fallback behavior, env knobs. |
| Session loop | `extensions/session-loop/index.ts`, `commands.ts`, `scheduler.ts`, tests/README | Specs match `/loop*` command surface, in-memory scheduler, follow-up delivery, stop/list/shutdown behavior. |
| Workspace memory | `extensions/workspace-memory/index.ts`, `commands.ts`, `storage.ts`, `recall.ts`, `save.ts`, tests | Specs match session hooks, prompt injection, recall scoring, `memory_save`, `/memory`, and workspace storage boundary. |
| Pi code previews | `extensions/pi-code-previews/index.ts`, `src/settings-store.ts`, `src/renderers.ts`, package/tests | Specs match health/settings commands, settings path loading/saving, Shiki, renderer registration, and presentation-only boundary. |
| MCP adapter | `extensions/pi-mcp-adapter/index.ts`, `compact.ts`, tests, root package | Specs match proxy wrapper, compact renderers, fallback to upstream renderers, and upstream MCP boundary. |
| Docs and CI | `docs/index.html`, `docs/style.css`, `scripts/serve-static-docs.mjs`, `tests/docs-index-workflow-video.test.mjs`, CI workflow | Specs match static site, docs server path/MIME behavior, video/test contract, and CI docs job. |

## Logged Mismatches / TODOs

These are recorded only; no code or existing docs were fixed in this goal.

1. `README.md` and extension READMEs still mention pi `0.72.x`, while root and extension `package.json` files pin `@earendil-works/pi-*` packages around `^0.79.4`.
2. `extensions/pi-mcp-adapter/` has local tests but no local `package.json` or CI matrix entry, so current verification is inspection unless future tooling adds a package/check.
3. `extensions/session-loop` behavior is session-scoped and in-memory; durable recurring jobs would be a future feature, not current behavior.

## Placeholder Check

No leftover bracketed template placeholders for feature, date, or area names were found in generated area artifacts during the subgoal-3 check.
