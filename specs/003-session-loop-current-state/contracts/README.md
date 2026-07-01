# Contracts: Session Loop Current State

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| /loop | `pi.registerCommand("loop")` | `<interval> <prompt>` or `<prompt>` | scheduled follow-up job | `extensions/session-loop/commands.ts` |
| /loop-stop | `pi.registerCommand("loop-stop")` | optional job id | stopped job or interactive selection | `extensions/session-loop/commands.ts` |
| /loop-list | `pi.registerCommand("loop-list")` | none | console job list and UI notification | `extensions/session-loop/commands.ts` |
| /loop-stop-all | `pi.registerCommand("loop-stop-all")` | confirmation | all jobs stopped | `extensions/session-loop/commands.ts` |

## Integration Boundaries

- pi follow-up message delivery
- session lifetime only; no durable job persistence observed
- UI select/confirm availability

## Non-Contracts

- Internal helper functions are not public contracts unless surfaced through a registered command, registered tool, package field, CLI command, test command, or documented file layout.
- Ignored/generated local state is not a public contract unless this artifact explicitly names it as persisted runtime storage.
