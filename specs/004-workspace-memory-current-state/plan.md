# Implementation Plan: Workspace Memory Current State

**Branch**: `004-workspace-memory-current-state` | **Date**: 2026-07-01 | **Spec**: `spec.md`

**Input**: Current-state feature specification from `specs/004-workspace-memory-current-state/spec.md`

## Summary

Document observed current behavior for Workspace-scoped memory save, recall, scoring, prompt injection, command surface, templates, and local storage. This is a documentation-only baseline; no runtime, package, dependency, or CI behavior is changed.

## Technical Context

**Language/Version**: Node.js >=24.16.0; TypeScript for extension runtime where applicable  
**Primary Dependencies**: pi coding-agent host APIs plus area-specific packages named in source/package files  
**Storage**: Workspace-local memory index and memory files managed by `storage.ts` under the extension storage conventions.  
**Testing**: npm --prefix extensions/workspace-memory test; npm --prefix extensions/workspace-memory run build  
**Target Platform**: pi coding-agent extension runtime, terminal/TUI environments, and GitHub Actions where applicable  
**Project Type**: pi extension suite current-state documentation  
**Performance Goals**: Preserve current runtime characteristics; this spec does not optimize behavior  
**Constraints**: Documentation-only; root Spec Kit layout; no code/package changes  
**Scale/Scope**: Workspace-scoped memory save, recall, scoring, prompt injection, command surface, templates, and local storage.

## Constitution Check

- Observed behavior first: PASS — claims cite checked-in source/config/doc/test paths.
- Documentation-only boundary: PASS — runtime behavior changes are out of scope.
- Root canonical layout: PASS — artifact lives under root `specs/004-workspace-memory-current-state/`.
- Integration boundaries explicit: PASS — boundaries are listed in spec and research.
- Verification evidence required: PASS — commands and inspection evidence are listed in quickstart/tasks.

## Project Structure

### Documentation (this feature)

```text
specs/004-workspace-memory-current-state/
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
extensions/workspace-memory/index.ts
extensions/workspace-memory/commands.ts
extensions/workspace-memory/storage.ts
extensions/workspace-memory/recall.ts
extensions/workspace-memory/save.ts
extensions/workspace-memory/scoring.ts
extensions/workspace-memory/templates.ts
extensions/workspace-memory/tests/
```

**Structure Decision**: Keep one artifact set for Workspace Memory so review and future drift checks can be scoped to this area.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Separate area artifact | Workspace Memory has independent source paths and verification | A single repo-wide document would hide ownership and boundary details |
