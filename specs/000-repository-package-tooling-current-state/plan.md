# Implementation Plan: Repository Package and Tooling Current State

**Branch**: `000-repository-package-tooling-current-state` | **Date**: 2026-07-01 | **Spec**: `spec.md`

**Input**: Current-state feature specification from `specs/000-repository-package-tooling-current-state/spec.md`

## Summary

Document observed current behavior for Root package metadata, extension registration, bundled dependencies, root docs, CI, and pi-core change snapshot boundaries. This is a documentation-only baseline; no runtime, package, dependency, or CI behavior is changed.

## Technical Context

**Language/Version**: Node.js >=24.16.0; TypeScript for extension runtime where applicable  
**Primary Dependencies**: pi coding-agent host APIs plus area-specific packages named in source/package files  
**Storage**: Root package/lock files plus generated local runtime state under `.pi/` that is excluded from product behavior.  
**Testing**: node --test tests/docs-index-workflow-video.test.mjs; npm --prefix extensions/agentic-harness test && npm --prefix extensions/agentic-harness run build; per-extension CI commands listed in `.github/workflows/static-checks.yml`  
**Target Platform**: pi coding-agent extension runtime, terminal/TUI environments, and GitHub Actions where applicable  
**Project Type**: pi extension suite current-state documentation  
**Performance Goals**: Preserve current runtime characteristics; this spec does not optimize behavior  
**Constraints**: Documentation-only; root Spec Kit layout; no code/package changes  
**Scale/Scope**: Root package metadata, extension registration, bundled dependencies, root docs, CI, and pi-core change snapshot boundaries.

## Constitution Check

- Observed behavior first: PASS — claims cite checked-in source/config/doc/test paths.
- Documentation-only boundary: PASS — runtime behavior changes are out of scope.
- Root canonical layout: PASS — artifact lives under root `specs/000-repository-package-tooling-current-state/`.
- Integration boundaries explicit: PASS — boundaries are listed in spec and research.
- Verification evidence required: PASS — commands and inspection evidence are listed in quickstart/tasks.

## Project Structure

### Documentation (this feature)

```text
specs/000-repository-package-tooling-current-state/
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
package.json
package-lock.json
README.md
INTRODUCTION.md
CHANGELOG.md
AGENTS.md
.github/workflows/static-checks.yml
pi-core-changes/
docs/pi-core-worktree-source.md
```

**Structure Decision**: Keep one artifact set for Repository Package and Tooling so review and future drift checks can be scoped to this area.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Separate area artifact | Repository Package and Tooling has independent source paths and verification | A single repo-wide document would hide ownership and boundary details |
