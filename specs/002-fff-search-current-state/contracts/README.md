# Contracts: FFF Search Current State

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| find tool | `pi.registerTool({ name: "find" })` | pattern/path/limit | relative paths | `extensions/fff-search/index.ts` |
| grep tool | `pi.registerTool({ name: "grep" })` | pattern/path/literal/context/limit/cursor | path:line matches and cursor | `extensions/fff-search/index.ts` |
| multi_grep tool | `pi.registerTool({ name: "multi_grep" })` | patterns/constraints/context/limit/cursor | OR-search matches | `extensions/fff-search/index.ts` |
| /fff-mode | `pi.registerCommand("fff-mode")` | `both` or `tools-only` | saved FFF mode | `extensions/fff-search/index.ts` |

## Integration Boundaries

- native `@ff-labs/fff-node` availability
- gitignore-aware FFF scan results
- environment variables `PI_FFF_MODE`, `PI_FFF_SCAN_TIMEOUT_MS`, `PI_FFF_ENABLE_WATCH`
- pi editor autocomplete provider

## Non-Contracts

- Internal helper functions are not public contracts unless surfaced through a registered command, registered tool, package field, CLI command, test command, or documented file layout.
- Ignored/generated local state is not a public contract unless this artifact explicitly names it as persisted runtime storage.
