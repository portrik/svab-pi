# Implementation Plan: Code Quality Enforcement Style Policy

**Branch**: `008-code-quality-enforcement-style-policy` | **Date**: 2026-07-01 | **Spec**: `spec.md`

**Input**: Desired parser-first code-quality enforcement behavior.

## Summary

Update specs first, then code-quality enforcement surfaces so reviewer/verifier guidance fails parser-first, unrepresentable-state, or immutable/functional-style violations unless a project-specific exception is documented.

## Technical Context

**Language/Version**: Node.js >=24.16.0 and TypeScript where applicable  
**Primary Dependencies**: pi-coding-agent host APIs, agentic-harness verifier/reviewer prompts, Spec Kit artifacts  
**Storage**: Spec files under `.specify/` and `specs/`; durable goal state under `.pi/agent/goal-state/` during execution  
**Testing**: `npm --prefix extensions/agentic-harness test`, `npm --prefix extensions/agentic-harness run build`, targeted prompt/reviewer/verifier tests  
**Target Platform**: pi coding-agent runtime on supported terminal platforms  
**Project Type**: pi extension suite / prompt and verifier enforcement infrastructure  
**Constraints**: Specs before code; preserve project-required exceptions and trust-boundary validation  
**Code Quality Style**: Parser-first at boundaries; invalid states unrepresentable where practical; immutable/functional default; explicit project exceptions only  
**Scale/Scope**: Code-quality enforcement surfaces, not arbitrary product code

## Constitution Check

- Observed behavior first: PASS when current-state specs only claim behavior after it exists.
- Spec-first changes: PASS when this artifact set and governance templates change before runtime/prompt code.
- Parser-first code quality: PASS when boundary parsing, unrepresentable invalid states, immutable/functional defaults, and project exceptions are specified.
- Root canonical layout: PASS when output lives under root `specs/`.
- Integration boundaries explicit: PASS when host/dependency/env/platform boundaries are named.
- Verification evidence required: PASS when evidence lists artifacts, commands, and reviewer/verifier policy checks.

## Project Structure

### Documentation (this feature)

```text
specs/008-code-quality-enforcement-style-policy/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── README.md
└── tasks.md
```

### Source Code (repository root)

```text
.specify/
specs/
extensions/agentic-harness/
extensions/workspace-memory/   # only if prompt-injection guidance changes
AGENTS.md
CONTRIBUTING.md
```

**Structure Decision**: Use a dedicated implementation-change spec so current-state specs do not claim future behavior before code changes land.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Dedicated implementation-change spec | This policy changes enforcement behavior | Editing only current-state specs would make future behavior look already implemented |
| Reviewer-failure enforcement | User requested force as reviewer failure | Prose-only guidance would not be enforceable |
