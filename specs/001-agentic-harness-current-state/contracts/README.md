# Contracts: Agentic Harness Current State

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| /clarify | `pi.registerCommand("clarify")` | free-form clarification topic | one-question-at-a-time interview and Goal Contract | `extensions/agentic-harness/index.ts` |
| /goal | `pi.registerCommand("goal")` | status/create/evidence/complete/auto commands | durable goal state and verifier receipts | `extensions/agentic-harness/goal-command.ts` |
| subagent tool | `pi.registerTool({ name: "subagent" })` | agent task(s), cwd, mode options | subagent run summary/artifacts | `extensions/agentic-harness/subagent.ts` |
| webfetch tool | `pi.registerTool({ name: "webfetch" })` | URL and rendering options | markdown content | `extensions/agentic-harness/webfetch/` |

## Integration Boundaries

- pi extension API and UI APIs
- subagent pi subprocesses
- tmux availability
- Linux/macOS sandbox adapters
- environment flags `PI_ENABLE_TEAM_MODE`, `PI_TEAM_WORKER`, `PI_SANDBOX_APPROVAL_MODE`, `PI_AGENTIC_SANDBOX_BASH`, `PI_AGENTIC_MICROCOMPACTION`, `PI_AGENTIC_FOOTER_GLYPHS`

## Non-Contracts

- Internal helper functions are not public contracts unless surfaced through a registered command, registered tool, package field, CLI command, test command, or documented file layout.
- Ignored/generated local state is not a public contract unless this artifact explicitly names it as persisted runtime storage.
