# Contracts: Code Quality Enforcement Style Policy

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| Goal completion guard | `/goal complete <targetId>` | target id plus evidence already recorded | PASS completes target; FAIL records blockers | `extensions/agentic-harness/index.ts`, `goal-verifier.ts`, `goal-state.ts` |
| Reviewer/verifier prompt contract | `reviewer-verifier` agent | objective, success criteria, evidence, blockers | strict verdict with blockers, commands, evidence checked | `extensions/agentic-harness/agents/reviewer-verifier.md`, `goal-verifier.ts` |
| Spec governance | `.specify/memory/constitution.md` | spec/change requirements | required policy and exception rules | `.specify/memory/constitution.md` |

## Integration Boundaries

- pi host prompt assembly and extension lifecycle.
- subagent execution and reviewer-verifier outputs.
- TypeBox/tool schemas and other runtime validation required at trust boundaries.
- Platform APIs or host contracts that require mutation or imperative lifecycle management.

## Boundary Parsing / Required Validation

- Inputs should be parsed into domain types before internal logic when practical.
- Required runtime validation remains allowed for tool schemas, host boundaries, and project-specified exceptions.
- Exceptions must name why parser-first, unrepresentable-state, or immutable/functional defaults do not fit.

## Non-Contracts

- Local `.pi/` runtime state is execution evidence, not a product API.
- Internal helper names containing “validator” are not violations by themselves.
