# Quickstart: MCP Adapter Wrapper Current State

## Purpose

Use this artifact set to understand the current behavior of MCP Adapter Wrapper before changing it.

## Read Order

1. `spec.md` — behavior requirements and edge cases.
2. `research.md` — source-backed findings and TODOs.
3. `data-model.md` — entities, relationships, and state/storage.
4. `contracts/README.md` — commands, tools, APIs, and integration contracts.
5. `tasks.md` — documentation-maintenance checklist.

## Source Paths To Inspect

- `extensions/pi-mcp-adapter/index.ts` — source for MCP Adapter Wrapper current-state behavior
- `extensions/pi-mcp-adapter/compact.ts` — source for MCP Adapter Wrapper current-state behavior
- `extensions/pi-mcp-adapter/tests/` — source for MCP Adapter Wrapper current-state behavior
- `package.json` — source for MCP Adapter Wrapper current-state behavior

## Verification

```bash
No local package.json/CI job exists for `extensions/pi-mcp-adapter`; inspect tests or run via a broader harness if added later.
```

## Notes

- This artifact set is documentation-only.
- Do not infer product behavior from ignored local runtime state unless this spec explicitly names that state as a storage boundary.
