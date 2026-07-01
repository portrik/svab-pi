# Implementation Plan: MCP Adapter Wrapper Current State

**Branch**: `006-pi-mcp-adapter-current-state` | **Date**: 2026-07-01 | **Spec**: `spec.md`

**Input**: Current-state feature specification from `specs/006-pi-mcp-adapter-current-state/spec.md`

## Summary

Document observed current behavior for Local compact-rendering wrapper around bundled upstream `pi-mcp-adapter` without forking the full MCP engine. This is a documentation-only baseline; no runtime, package, dependency, or CI behavior is changed.

## Technical Context

**Language/Version**: Node.js >=24.16.0; TypeScript for extension runtime where applicable  
**Primary Dependencies**: pi coding-agent host APIs plus area-specific packages named in source/package files  
**Storage**: No local persistent storage in the wrapper; upstream adapter may manage its own state outside this local scope.  
**Testing**: No local package.json/CI job exists for `extensions/pi-mcp-adapter`; inspect tests or run via a broader harness if added later.  
**Target Platform**: pi coding-agent extension runtime, terminal/TUI environments, and GitHub Actions where applicable  
**Project Type**: pi extension suite current-state documentation  
**Performance Goals**: Preserve current runtime characteristics; this spec does not optimize behavior  
**Constraints**: Documentation-only; root Spec Kit layout; no code/package changes  
**Scale/Scope**: Local compact-rendering wrapper around bundled upstream `pi-mcp-adapter` without forking the full MCP engine.

## Constitution Check

- Observed behavior first: PASS — claims cite checked-in source/config/doc/test paths.
- Documentation-only boundary: PASS — runtime behavior changes are out of scope.
- Root canonical layout: PASS — artifact lives under root `specs/006-pi-mcp-adapter-current-state/`.
- Integration boundaries explicit: PASS — boundaries are listed in spec and research.
- Verification evidence required: PASS — commands and inspection evidence are listed in quickstart/tasks.

## Project Structure

### Documentation (this feature)

```text
specs/006-pi-mcp-adapter-current-state/
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
extensions/pi-mcp-adapter/index.ts
extensions/pi-mcp-adapter/compact.ts
extensions/pi-mcp-adapter/tests/
package.json
```

**Structure Decision**: Keep one artifact set for MCP Adapter Wrapper so review and future drift checks can be scoped to this area.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Separate area artifact | MCP Adapter Wrapper has independent source paths and verification | A single repo-wide document would hide ownership and boundary details |
