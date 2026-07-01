# Implementation Plan: Docs and CI Static Site Current State

**Branch**: `007-docs-ci-static-site-current-state` | **Date**: 2026-07-01 | **Spec**: `spec.md`

**Input**: Current-state feature specification from `specs/007-docs-ci-static-site-current-state/spec.md`

## Summary

Document observed current behavior for Static docs site, feature HTML/CSS pages, video asset contract, local docs server, docs test, and CI check matrix. This is a documentation-only baseline; no runtime, package, dependency, or CI behavior is changed.

## Technical Context

**Language/Version**: Node.js >=24.16.0; TypeScript for extension runtime where applicable  
**Primary Dependencies**: pi coding-agent host APIs plus area-specific packages named in source/package files  
**Storage**: Checked-in docs/assets files only; local server holds no persistent state.  
**Testing**: node --test tests/docs-index-workflow-video.test.mjs  
**Target Platform**: pi coding-agent extension runtime, terminal/TUI environments, and GitHub Actions where applicable  
**Project Type**: pi extension suite current-state documentation  
**Performance Goals**: Preserve current runtime characteristics; this spec does not optimize behavior  
**Constraints**: Documentation-only; root Spec Kit layout; no code/package changes  
**Scale/Scope**: Static docs site, feature HTML/CSS pages, video asset contract, local docs server, docs test, and CI check matrix.

## Constitution Check

- Observed behavior first: PASS — claims cite checked-in source/config/doc/test paths.
- Documentation-only boundary: PASS — runtime behavior changes are out of scope.
- Root canonical layout: PASS — artifact lives under root `specs/007-docs-ci-static-site-current-state/`.
- Integration boundaries explicit: PASS — boundaries are listed in spec and research.
- Verification evidence required: PASS — commands and inspection evidence are listed in quickstart/tasks.

## Project Structure

### Documentation (this feature)

```text
specs/007-docs-ci-static-site-current-state/
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
docs/index.html
docs/style.css
docs/features/
docs/assets/workflow-command-video.mp4
assets/
scripts/serve-static-docs.mjs
tests/docs-index-workflow-video.test.mjs
.github/workflows/static-checks.yml
```

**Structure Decision**: Keep one artifact set for Docs and CI Static Site so review and future drift checks can be scoped to this area.

## Complexity Tracking

| Concern | Why Needed | Simpler Alternative Rejected Because |
|---------|------------|--------------------------------------|
| Separate area artifact | Docs and CI Static Site has independent source paths and verification | A single repo-wide document would hide ownership and boundary details |
