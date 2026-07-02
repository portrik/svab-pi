# Verification Evidence

**Date**: 2026-07-01  
**Scope**: Spec Kit current-state coverage plus code-quality enforcement style policy change spec.

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
- 8 current-state area directories under `specs/000-*` through `specs/007-*`, each with:
  - `spec.md`
  - `plan.md`
  - `research.md`
  - `data-model.md`
  - `quickstart.md`
  - `contracts/README.md`
  - `tasks.md`
- `specs/008-code-quality-enforcement-style-policy/` implementation-change spec with:
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
| Code quality enforcement style policy | `specs/008-code-quality-enforcement-style-policy/` |

## Logged Mismatches / TODOs

1. `README.md` and extension READMEs still mention pi `0.72.x`, while package files pin `@earendil-works/pi-*` dependencies around `^0.79.4`.
2. `extensions/pi-mcp-adapter/` has local tests but no local `package.json` or CI matrix entry.
3. `extensions/session-loop` is currently in-memory/session-scoped; durable loop jobs would be a future feature.

## Commands Run

### Agentic harness build

```bash
npm --prefix extensions/agentic-harness run build
```

Result: PASS on 2026-07-01 during goal-1.

### Agentic harness full test suite

```bash
npm --prefix extensions/agentic-harness test
```

Result: PASS on 2026-07-01 during goal-1.

```text
Test Files  70 passed (70)
Tests       706 passed (706)
```

### Targeted code-quality enforcement tests

```bash
npm --prefix extensions/agentic-harness test -- tests/discipline.test.ts tests/goal-verifier.test.ts tests/review-commands.test.ts tests/validator-template.test.ts tests/extension.test.ts tests/skill-docs.test.ts tests/agents.test.ts
```

Result: PASS on 2026-07-01 during goal-1.

```text
Test Files  7 passed (7)
Tests       109 passed (109)
```

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
// verifies 8 current-state area dirs, required 7 files per area, and no placeholder markers
JS
```

Result: PASS

```text
Spec structure OK: 8 area dirs x 7 required files; no placeholder markers.
```

### Code-quality policy spec-first check

```bash
node - <<'JS'
// verifies 008 policy spec required files and parser-first policy markers in governance/templates
JS
```

Result: PASS on 2026-07-01 during goal-1/subgoal-1.

```text
Code quality policy spec OK: 7 files; governance/templates include parser-first, unrepresentable-state, immutable/functional, and project exception markers.
```

## Commands Intentionally Not Run

Non-agentic-harness extension package test/build/check commands were not run for this goal because this change touched Spec Kit docs, root guidance, and agentic-harness prompt/reviewer/verifier surfaces only. Existing per-extension verification commands are documented in the relevant `quickstart.md` and `plan.md` artifacts.
