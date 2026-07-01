# Implementation Plan: FFF Search Current State

**Branch**: `002-fff-search-current-state` | **Date**: 2026-07-01 | **Spec**: `spec.md`

**Input**: Current-state feature specification from `specs/002-fff-search-current-state/spec.md`

## Summary

Document observed current behavior for FFF-backed `find`, `grep`, `multi_grep`, @-mention autocomplete, health/rescan/mode commands, fallback behavior, and FFF runtime config. This is a documentation-only baseline; no runtime, package, dependency, or CI behavior is changed.

## Technical Context

**Language/Version**: Node.js >=24.16.0; TypeScript for extension runtime where applicable  
**Primary Dependencies**: pi coding-agent host APIs plus area-specific packages named in source/package files  
**Storage**: FFF database/config files under `getAgentDir()/fff`: `frecency.mdb`, `history.mdb`, `config.json`.  
**Testing**: npm --prefix extensions/fff-search test; npm --prefix extensions/fff-search run build  
**Target Platform**: pi coding-agent extension runtime, terminal/TUI environments, and GitHub Actions where applicable  
**Project Type**: pi extension suite current-state documentation  
**Performance Goals**: Preserve current runtime characteristics; this spec does not optimize behavior  
**Constraints**: Documentation-only; root Spec Kit layout; no code/package changes  
**Scale/Scope**: FFF-backed `find`, `grep`, `multi_grep`, @-mention autocomplete, health/rescan/mode commands, fallback behavior, and FFF runtime config.

## Constitution Check

- Observed behavior first: PASS — claims cite checked-in source/config/doc/test paths.
- Documentation-only boundary: PASS — runtime behavior changes are out of scope.
- Root canonical layout: PASS — artifact lives under root `specs/002-fff-search-current-state/`.
- Integration boundaries explicit: PASS — boundaries are listed in spec and research.
- Verification evidence required: PASS — commands and inspection evidence are listed in quickstart/tasks.

## Project Structure

### Documentation (this feature)

```text
specs/002-fff-search-current-state/
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
extensions/fff-search/index.ts
extensions/fff-search/package.json
extensions/fff-search/tests/index.test.ts
README.md
```

**Structure Decision**: Keep one artifact set for FFF Search so review and future drift checks can be scoped to this area.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Separate area artifact | FFF Search has independent source paths and verification | A single repo-wide document would hide ownership and boundary details |
