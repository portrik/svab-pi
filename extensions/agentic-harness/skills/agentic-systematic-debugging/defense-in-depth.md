# Defense-in-Depth Parsing

## Overview

When a bug is caused by invalid data, a scattered validation check can be bypassed by another path, refactor, or mock. Prefer one boundary parser that produces a narrow domain value, then make downstream invalid states unrepresentable where practical.

**Core principle:** Parse at boundaries, preserve invariants in the model, and keep required runtime checks only where the project boundary needs them.

## Why Parsers Before Checks

Scattered validation: "This path rejected the bad value"
Boundary parser + invariant model: "Internal code cannot receive the bad value"

Different layers still have different jobs:
- Boundary parsing rejects or converts uncertain input once.
- Domain types/state shapes make impossible combinations unrepresentable.
- Environment guards prevent context-specific dangers.
- Debug instrumentation helps when a required boundary fails.

## The Four Layers

### Layer 1: Boundary Parser
**Purpose:** Convert external or uncertain input into a domain value before use.

```typescript
type ProjectDirectory = string & { readonly __brand: "ProjectDirectory" };

function parseProjectDirectory(value: string): ProjectDirectory {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("workingDirectory cannot be empty");
  if (!existsSync(trimmed)) throw new Error(`workingDirectory does not exist: ${trimmed}`);
  if (!statSync(trimmed).isDirectory()) throw new Error(`workingDirectory is not a directory: ${trimmed}`);
  return trimmed as ProjectDirectory;
}
```

### Layer 2: Domain Invariant
**Purpose:** Accept the parsed value so business logic does not repeat the checks.

```typescript
function initializeWorkspace(projectDir: ProjectDirectory, sessionId: string) {
  // projectDir was parsed at the boundary; do not revalidate it here.
  // ... proceed
}
```

### Layer 3: Environment Guards
**Purpose:** Prevent dangerous operations in specific contexts.

```typescript
async function gitInit(directory: ProjectDirectory) {
  if (process.env.NODE_ENV === "test") {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));

    if (!normalized.startsWith(tmpDir)) {
      throw new Error(`Refusing git init outside temp dir during tests: ${directory}`);
    }
  }
  // ... proceed
}
```

### Layer 4: Debug Instrumentation
**Purpose:** Capture context for forensics when required boundaries fail.

```typescript
async function gitInit(directory: ProjectDirectory) {
  const stack = new Error().stack;
  logger.debug("About to git init", {
    directory,
    cwd: process.cwd(),
    stack,
  });
  // ... proceed
}
```

## Applying the Pattern

When you find a bug:

1. **Trace the data flow** - Where does bad value originate? Where used?
2. **Identify the boundary** - Where should uncertain input become a domain value?
3. **Make invalid states unrepresentable** - Narrow types or state shape before business logic.
4. **Keep required checks** - Environment guards, TypeBox/tool schemas, host contracts, and platform APIs stay when documented.
5. **Test the boundary and invariant** - Prove bad input cannot reach the internal path.

## Key Insight

The goal is not validation everywhere. It is impossible bad states inside the core logic:
- Boundary parser handles uncertain input.
- Domain model prevents repeated downstream checks.
- Environment guards cover context-specific hazards.
- Debug logging explains failures when a boundary contract is broken.

**Don't scatter validation.** Parse once, preserve the invariant, and document any project exception.
