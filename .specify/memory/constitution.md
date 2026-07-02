# Constitution: svab-pi Specs

## Principles

1. **Observed Behavior First**
   Current-state specs MUST describe what the repository currently implements. Intended changes, stale docs, and suspected bugs are recorded as risks or TODOs.

2. **Spec-First Changes**
   Implementation changes MUST update the relevant Spec Kit artifacts before runtime code, prompt, package, dependency, CI, or docs changes. Change specs document intended deltas; current-state specs remain observed-behavior baselines until implementation lands.

3. **Parser-First Code Quality**
   Specs for implementation work MUST prefer parsing external or uncertain input into narrow domain types over scattered validation checks, make invalid states unrepresentable where practical, and prefer immutable/functional style by default.

4. **Explicit Project Exceptions**
   Specs MUST name any project-required exception to parser-first, unrepresentable-state, or immutable/functional defaults. Required trust-boundary checks, TypeBox/tool schemas, host API contracts, performance constraints, and platform-mutable APIs remain allowed when documented.

5. **Root Canonical Layout**
   Root `.specify/` and `specs/` are canonical. Nested scaffolds such as `my-project/.specify/` are examples only.

6. **Integration Boundaries Are Explicit**
   External bundled dependencies, pi host APIs, terminal/tmux behavior, feature flags, environment variables, and local runtime state MUST be labeled as boundaries.

7. **Verification Evidence Required**
   Completion MUST include artifact lists, area-to-spec mapping, mismatch/TODO list, relevant docs/spec verification output, and reviewer/verifier evidence for parser-first policy exceptions.

## Governance

These principles apply to every Spec Kit artifact in this repository. If a current-state spec cannot verify a behavior from code or checked-in docs, it must mark the point as an assumption or TODO. If implementation work does not follow parser-first, unrepresentable-state, or immutable/functional defaults, reviewer/verifier guidance MUST fail it unless the project spec names the exception.
