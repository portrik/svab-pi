# Constitution: svab-pi Current-State Specs

## Principles

1. **Observed Behavior First**
   Specs MUST describe what the repository currently implements. Intended changes, stale docs, and suspected bugs are recorded as risks or TODOs.

2. **Documentation-Only Boundary**
   Spec work MUST NOT change runtime code, package dependencies, CI behavior, or existing docs outside the new Spec Kit artifacts.

3. **Root Canonical Layout**
   Root `.specify/` and `specs/` are canonical. Nested scaffolds such as `my-project/.specify/` are examples only.

4. **Integration Boundaries Are Explicit**
   External bundled dependencies, pi host APIs, terminal/tmux behavior, feature flags, environment variables, and local runtime state MUST be labeled as boundaries.

5. **Verification Evidence Required**
   Completion MUST include artifact lists, area-to-spec mapping, mismatch/TODO list, and relevant docs/spec verification output.

## Governance

These principles apply to every current-state Spec Kit artifact in this repository. If a spec cannot verify a behavior from code or checked-in docs, it must mark the point as an assumption or TODO.
