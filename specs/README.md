# Spec Kit Current-State Coverage

This directory contains root-level Spec Kit artifact sets for the current implemented state of `svab-pi`.

## Area Breakdown

| Area | Artifact set | Scope |
|------|--------------|-------|
| Repository package/tooling | `000-repository-package-tooling-current-state/` | Root package metadata, extension registration, bundled dependency boundaries, root docs, `pi-core-changes/` boundary |
| Agentic harness | `001-agentic-harness-current-state/` | `/clarify`, `/goal`, subagents, tools, sandbox, team/tmux, TUI/footer, state and verifier runtime |
| FFF search | `002-fff-search-current-state/` | `find`, `grep`, `multi_grep`, `@` autocomplete, FFF/env behavior |
| Session loop | `003-session-loop-current-state/` | `/loop` commands and scheduler behavior |
| Workspace memory | `004-workspace-memory-current-state/` | Memory save/recall commands, prompt injection, scoring, storage |
| Pi code previews | `005-pi-code-previews-current-state/` | Tool result renderers, Shiki previews, settings and warning behavior |
| MCP adapter | `006-pi-mcp-adapter-current-state/` | Local wrapper/compact rendering around bundled `pi-mcp-adapter` |
| Docs and CI | `007-docs-ci-static-site-current-state/` | Static docs site, docs server script, docs test, GitHub Actions checks |

## Cross-Check

- `current-state-cross-check.md` records representative source checks and logged mismatches/TODOs across all artifact sets.
- `verification-evidence.md` records artifact lists, area mapping, commands run, and intentionally skipped package checks.

## Rules

- Specs describe observed current behavior only.
- Mismatches or stale docs are recorded as TODOs/risks inside artifacts.
- The nested `my-project/.specify/` scaffold is not canonical for this repository.
