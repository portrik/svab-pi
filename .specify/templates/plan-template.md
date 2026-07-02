# Implementation Plan: [AREA] Current State

**Branch**: `[###-area-current-state]` | **Date**: [DATE] | **Spec**: `spec.md`

**Input**: Current-state feature specification from `specs/[###-area-current-state]/spec.md`

## Summary

[Summarize the observed behavior and the documentation-only approach.]

## Technical Context

**Language/Version**: Node.js >=24.16.0 and TypeScript where applicable  
**Primary Dependencies**: pi-coding-agent host APIs plus area-specific dependencies  
**Storage**: [N/A or local file/state paths]  
**Testing**: [Relevant extension tests/builds/docs checks]  
**Target Platform**: pi coding-agent runtime on supported terminal platforms  
**Project Type**: pi extension suite / documentation artifact  
**Constraints**: Documentation-only for current-state specs; implementation-change specs update specs before code  
**Code Quality Style**: Parser-first at boundaries; invalid states unrepresentable where practical; immutable/functional default; explicit project exceptions only  
**Scale/Scope**: Current checked-in repository state for this area

## Constitution Check

- Observed behavior first: PASS when claims cite checked-in files.
- Spec-first changes: PASS when relevant specs are updated before runtime/prompt/dependency changes.
- Parser-first code quality: PASS when boundary parsing, unrepresentable invalid states, immutable/functional defaults, and any project exceptions are specified.
- Root canonical layout: PASS when output lives under root `specs/`.
- Integration boundaries explicit: PASS when host/dependency/env/platform boundaries are named.
- Verification evidence required: PASS when evidence lists artifacts, mappings, TODOs, checks, and reviewer/verifier policy evidence.

## Project Structure

### Documentation (this feature)

```text
specs/[###-area-current-state]/
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
[Relevant checked-in paths for this area]
```

**Structure Decision**: Use one Spec Kit artifact set per major repository area so each current-state baseline is independently reviewable.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Multiple current-state specs | The repository is an extension suite with distinct subsystems | One large spec would hide subsystem boundaries and verification paths |
