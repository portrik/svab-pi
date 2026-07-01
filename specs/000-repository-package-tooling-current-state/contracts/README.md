# Contracts: Repository Package and Tooling Current State

## Public Commands / Tools / APIs

| Contract | Entry Point | Inputs | Outputs | Source |
|----------|-------------|--------|---------|--------|
| pi package extension list | `package.json` `pi.extensions` | pi host loads entries in listed order | registered commands/tools/hooks | `package.json` |
| static checks workflow | GitHub Actions `Static Checks` | push to main | extension and docs checks | `.github/workflows/static-checks.yml` |

## Integration Boundaries

- pi host package loader
- bundled dependencies in node_modules
- ignored local `.pi/` runtime state
- upstream pi core snapshot under `pi-core-changes/`

## Non-Contracts

- Internal helper functions are not public contracts unless surfaced through a registered command, registered tool, package field, CLI command, test command, or documented file layout.
- Ignored/generated local state is not a public contract unless this artifact explicitly names it as persisted runtime storage.
