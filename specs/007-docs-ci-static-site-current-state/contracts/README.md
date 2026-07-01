# Contracts: Docs and CI Static Site Current State

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| static docs server | `node scripts/serve-static-docs.mjs` | HTTP request path and optional PORT env | served docs/assets file or 404 | `scripts/serve-static-docs.mjs` |
| docs test | `node --test tests/docs-index-workflow-video.test.mjs` | checked-in docs and server script | Node test pass/fail | `tests/docs-index-workflow-video.test.mjs` |
| static checks workflow | GitHub Actions docs job | push to main | docs test result | `.github/workflows/static-checks.yml` |

## Integration Boundaries

- static HTTP server path allow-list
- large MP4 asset size and availability
- GitHub Actions Node 24.16.0 environment
- external browser rendering/accessibility behavior

## Non-Contracts

- Internal helper functions are not public contracts unless surfaced through a registered command, registered tool, package field, CLI command, test command, or documented file layout.
- Ignored/generated local state is not a public contract unless this artifact explicitly names it as persisted runtime storage.
