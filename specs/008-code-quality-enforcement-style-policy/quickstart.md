# Quickstart: Code Quality Enforcement Style Policy

## Purpose

Use this artifact set before changing code-quality enforcement prompts, skills, verifier guidance, or infrastructure code.

## Read Order

1. `spec.md` — desired policy and acceptance requirements.
2. `plan.md` — affected surfaces, constraints, and constitution checks.
3. `research.md` — source-backed findings and decisions.
4. `data-model.md` — parser, invariant, exception, and reviewer-failure concepts.
5. `contracts/README.md` — reviewer/verifier and goal completion contracts.
6. `tasks.md` — spec-first implementation order.

## Verification

```bash
npm --prefix extensions/agentic-harness test
npm --prefix extensions/agentic-harness run build
```

Run narrower targeted tests first when editing a specific prompt or verifier surface, then run the full commands before completion.

## Notes

- This is an implementation-change spec.
- Specs must be updated before code, prompt, runtime, or test changes.
- Reviewer/verifier checks should fail parser-first policy violations unless this spec or the affected project spec names the exception.
- Do not remove required TypeBox/tool-schema validation or trust-boundary checks just to satisfy the policy.
