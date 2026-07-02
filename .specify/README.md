# Spec Kit Scaffold

This root-level scaffold is for Spec Kit artifacts for `svab-pi`.

- Canonical specs live in root `specs/`.
- Current-state specs describe observed behavior from the repository state; mismatches are recorded as TODOs/risks, not fixed there.
- Implementation-change specs must be updated before code/prompt/runtime changes.
- Implementation specs prefer parser-first boundaries, unrepresentable invalid states, and immutable/functional defaults unless they name a project-required exception.
- The nested `my-project/.specify/` directory is an example scaffold and is not canonical for this repository.
