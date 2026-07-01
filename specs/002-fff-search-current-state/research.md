# Research: FFF Search Current State

## Sources Inspected

- `extensions/fff-search/index.ts` — source for FFF Search current-state behavior
- `extensions/fff-search/package.json` — source for FFF Search current-state behavior
- `extensions/fff-search/tests/index.test.ts` — source for FFF Search current-state behavior
- `README.md` — source for FFF Search current-state behavior

## Current Behavior Findings

- Overrides built-in `find` and `grep` tools with FFF-backed implementations and registers `multi_grep` for multi-pattern OR search.
- Can replace @-mention file autocomplete unless mode is `tools-only`.
- Uses persistent FFF frecency/history/config files under the pi agent directory.
- Falls back to built-in find/grep when the native FFF engine is unavailable, at filesystem root/home, or initial scan fails/times out.
- Exposes `/fff-mode`, `/fff-health`, and `/fff-rescan` commands.

## Integration Boundaries

- native `@ff-labs/fff-node` availability
- gitignore-aware FFF scan results
- environment variables `PI_FFF_MODE`, `PI_FFF_SCAN_TIMEOUT_MS`, `PI_FFF_ENABLE_WATCH`
- pi editor autocomplete provider

## Mismatches / TODOs

- None recorded.

## Decisions

- **Decision**: Treat FFF as preferred search when available and fallback search as required current behavior.
  - **Rationale**: This keeps the current-state baseline source-backed and documentation-only.
  - **Alternatives considered**: Fixing the behavior or stale docs now; rejected because this goal only creates specs.
