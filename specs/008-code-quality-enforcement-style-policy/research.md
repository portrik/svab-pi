# Research: Code Quality Enforcement Style Policy

## Sources Inspected

- `.specify/memory/constitution.md` — governance rules for spec artifacts.
- `.specify/templates/*.md` — templates future specs inherit.
- `specs/001-agentic-harness-current-state/spec.md` — current baseline for `/goal`, reviewer/verifier, prompts, tools, and durable state.
- `specs/000-repository-package-tooling-current-state/spec.md` — current baseline for root docs/package/tooling boundaries.
- `extensions/agentic-harness/index.ts` — primary prompt and command registration surface to update after specs.
- `extensions/agentic-harness/discipline.ts` — injected implementation discipline guidance.
- `extensions/agentic-harness/agents/*.md` — reviewer/verifier and subagent prompt surfaces.
- `extensions/agentic-harness/skills/*/SKILL.md` — behavioral workflow guidance surfaces.
- `extensions/agentic-harness/goal-verifier.ts` and `goal-state.ts` — completion guard and verifier receipt surfaces.

## Current Behavior Findings

- Current-state specs are observed-behavior baselines and should not claim this new policy is implemented until the prompt/runtime changes land.
- Durable goal completion already depends on evidence and a reviewer-verifier PASS receipt.
- The existing codebase uses validation terminology for domain concepts such as `plan-validator`; this policy should not force renaming those concepts.

## Integration Boundaries

- pi host system/developer prompt assembly and extension hooks.
- reviewer-verifier subagent prompt contracts.
- TypeBox/tool schemas and runtime trust-boundary validation.
- Platform or host APIs that require mutable state or imperative lifecycle management.

## Mismatches / TODOs

- After implementation changes land, update affected current-state specs to describe the new observed enforcement behavior.
- Confirm tests cover prompt text and reviewer/verifier failure guidance once implementation files change.

## Decisions

- **Decision**: Treat this as an implementation-change spec, not a current-state artifact.
  - **Rationale**: Specs must come first without falsely claiming future behavior is already observed.
  - **Alternatives considered**: Update only current-state specs; rejected because it would blur baseline vs intended behavior.
- **Decision**: Enforce by reviewer/verifier failure, not a new lint/runtime blocker in this first pass.
  - **Rationale**: The user defined “force” as reviewer failure unless the project specifies a different approach.
  - **Alternatives considered**: Add new lint rules; rejected unless an existing enforcement surface naturally supports it.

## Code Quality Policy Notes

- Prefer parser functions at boundaries, then pass narrow domain types into internal logic.
- Prefer discriminated unions, branded/narrowed types, or state shapes that remove impossible combinations.
- Prefer immutable transformations and expression-oriented flow where the project does not require mutation.
- Accept documented exceptions for trust-boundary schemas, host/tool contracts, performance constraints, and mutable platform APIs.
