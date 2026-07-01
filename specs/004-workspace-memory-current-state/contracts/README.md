# Contracts: Workspace Memory Current State

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| memory_save tool | `pi.registerTool({ name: "memory_save" })` | content/template/tags | saved memory id/template/tags | `extensions/workspace-memory/index.ts` |
| /memory | `pi.registerCommand("memory")` | list/show/save/delete/search/stats | memory command output | `extensions/workspace-memory/commands.ts` |
| before_agent_start recall | `pi.on("before_agent_start")` | prompt and systemPrompt | possibly augmented systemPrompt | `extensions/workspace-memory/index.ts` |

## Integration Boundaries

- workspace cwd determines memory scope
- system prompt injection by pi hook
- local files under the agent/workspace memory storage paths
- heuristic keyword and scoring behavior

## Non-Contracts

- Internal helper functions are not public contracts unless surfaced through a registered command, registered tool, package field, CLI command, test command, or documented file layout.
- Ignored/generated local state is not a public contract unless this artifact explicitly names it as persisted runtime storage.
