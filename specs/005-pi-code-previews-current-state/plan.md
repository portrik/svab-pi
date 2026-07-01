# Implementation Plan: Pi Code Previews Current State

**Branch**: `005-pi-code-previews-current-state` | **Date**: 2026-07-01 | **Spec**: `spec.md`

**Input**: Current-state feature specification from `specs/005-pi-code-previews-current-state/spec.md`

## Summary

Document observed current behavior for Syntax-highlighted and compact previews for tool calls, Shiki setup, settings UI, health command, and warning/rendering helpers. This is a documentation-only baseline; no runtime, package, dependency, or CI behavior is changed.

## Technical Context

**Language/Version**: Node.js >=24.16.0; TypeScript for extension runtime where applicable  
**Primary Dependencies**: pi coding-agent host APIs plus area-specific packages named in source/package files  
**Storage**: `getAgentDir()/code-previews.json` plus compatibility reads from `~/.pi/settings.json`, `~/.pi/agent/settings.json`, agent settings, cwd `.pi/settings.json`, and legacy code-preview paths.  
**Testing**: npm --prefix extensions/pi-code-previews test; npm --prefix extensions/pi-code-previews run check  
**Target Platform**: pi coding-agent extension runtime, terminal/TUI environments, and GitHub Actions where applicable  
**Project Type**: pi extension suite current-state documentation  
**Performance Goals**: Preserve current runtime characteristics; this spec does not optimize behavior  
**Constraints**: Documentation-only; root Spec Kit layout; no code/package changes  
**Scale/Scope**: Syntax-highlighted and compact previews for tool calls, Shiki setup, settings UI, health command, and warning/rendering helpers.

## Constitution Check

- Observed behavior first: PASS — claims cite checked-in source/config/doc/test paths.
- Documentation-only boundary: PASS — runtime behavior changes are out of scope.
- Root canonical layout: PASS — artifact lives under root `specs/005-pi-code-previews-current-state/`.
- Integration boundaries explicit: PASS — boundaries are listed in spec and research.
- Verification evidence required: PASS — commands and inspection evidence are listed in quickstart/tasks.

## Project Structure

### Documentation (this feature)

```text
specs/005-pi-code-previews-current-state/
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
extensions/pi-code-previews/index.ts
extensions/pi-code-previews/src/renderers.ts
extensions/pi-code-previews/src/settings.ts
extensions/pi-code-previews/src/settings-store.ts
extensions/pi-code-previews/src/tool-renderers/
extensions/pi-code-previews/tests/
extensions/pi-code-previews/package.json
extensions/pi-code-previews/README.md
```

**Structure Decision**: Keep one artifact set for Pi Code Previews so review and future drift checks can be scoped to this area.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Separate area artifact | Pi Code Previews has independent source paths and verification | A single repo-wide document would hide ownership and boundary details |
