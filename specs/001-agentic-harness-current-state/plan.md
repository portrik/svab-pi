# Implementation Plan: Agentic Harness Current State

**Branch**: `001-agentic-harness-current-state` | **Date**: 2026-07-01 | **Spec**: `spec.md`

**Input**: Current-state feature specification from `specs/001-agentic-harness-current-state/spec.md`

## Summary

Document observed current behavior for /clarify, /goal, subagents, team/tmux, sandboxed tools, review command, TUI/footer, durable state, agents, skills, and verifier-guarded execution. This is a documentation-only baseline; no runtime, package, dependency, or CI behavior is changed.

## Technical Context

**Language/Version**: Node.js >=24.16.0; TypeScript for extension runtime where applicable  
**Primary Dependencies**: pi coding-agent host APIs plus area-specific packages named in source/package files  
**Storage**: Durable JSON snapshots under `.pi/agent/goal-state`, `.pi/agent/clarification-state`, `.pi/agent/runs`, and harness/team state roots.  
**Testing**: npm --prefix extensions/agentic-harness test; npm --prefix extensions/agentic-harness run build  
**Target Platform**: pi coding-agent extension runtime, terminal/TUI environments, and GitHub Actions where applicable  
**Project Type**: pi extension suite current-state documentation  
**Performance Goals**: Preserve current runtime characteristics; this spec does not optimize behavior  
**Constraints**: Documentation-only; root Spec Kit layout; no code/package changes  
**Scale/Scope**: /clarify, /goal, subagents, team/tmux, sandboxed tools, review command, TUI/footer, durable state, agents, skills, and verifier-guarded execution.

## Constitution Check

- Observed behavior first: PASS — claims cite checked-in source/config/doc/test paths.
- Documentation-only boundary: PASS — runtime behavior changes are out of scope.
- Root canonical layout: PASS — artifact lives under root `specs/001-agentic-harness-current-state/`.
- Integration boundaries explicit: PASS — boundaries are listed in spec and research.
- Verification evidence required: PASS — commands and inspection evidence are listed in quickstart/tasks.

## Project Structure

### Documentation (this feature)

```text
specs/001-agentic-harness-current-state/
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
extensions/agentic-harness/index.ts
extensions/agentic-harness/goal-*.ts
extensions/agentic-harness/clarification-*.ts
extensions/agentic-harness/subagent.ts
extensions/agentic-harness/team*.ts
extensions/agentic-harness/sandbox/
extensions/agentic-harness/agents/
extensions/agentic-harness/skills/
extensions/agentic-harness/tests/
extensions/agentic-harness/README.md
```

**Structure Decision**: Keep one artifact set for Agentic Harness so review and future drift checks can be scoped to this area.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Separate area artifact | Agentic Harness has independent source paths and verification | A single repo-wide document would hide ownership and boundary details |
