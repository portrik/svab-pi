# Data Model: Code Quality Enforcement Style Policy

## Entities

### Boundary Parser

- **Purpose**: Converts external or uncertain input into a narrow domain representation once, before internal logic uses it.
- **Source paths**: `.specify/memory/constitution.md`, `.specify/templates/data-model-template.md`, future prompt/reviewer files.
- **Fields / attributes**:
  - `input`: external, uncertain, or untrusted data.
  - `parsedOutput`: narrowed type or domain state used internally.
  - `failureMode`: explicit error/blocker when parsing cannot produce a valid domain value.
- **Lifecycle / ownership**: Specified in specs; implemented in code-quality infrastructure where touched.

### Domain State Model

- **Purpose**: Represents valid workflow states without impossible combinations.
- **Source paths**: future code-quality infrastructure refactors and reviewer guidance.
- **Fields / attributes**:
  - `variant`: discriminant or equivalent state selector.
  - `allowedData`: fields valid for that variant.
  - `excludedData`: impossible combinations removed by type/state shape.
- **Lifecycle / ownership**: Owned by implementation code and enforced by reviewer guidance.

### Project Exception

- **Purpose**: Documents why validation-heavy, mutable, or imperative code is required for a specific project boundary.
- **Source paths**: specs, prompts, reviewer/verifier guidance.
- **Fields / attributes**:
  - `reason`: trust boundary, TypeBox/tool schema, host API, performance, platform lifecycle, or project requirement.
  - `scope`: the file/function/prompt surface where the exception applies.
  - `reviewerExpectation`: what remains acceptable despite the exception.
- **Lifecycle / ownership**: Must be named before reviewer/verifier accepts policy deviations.

### Reviewer Failure

- **Purpose**: Blocks goal/subgoal completion when implementation ignores parser-first policy without a documented exception.
- **Source paths**: `extensions/agentic-harness/agents/reviewer-verifier.md`, `extensions/agentic-harness/goal-verifier.ts`, related prompt surfaces after implementation.
- **Fields / attributes**:
  - `target`: code or prompt surface being reviewed.
  - `policyViolation`: parser-first, representable invalid state, or mutable/imperative default violation.
  - `blocker`: verifier-readable failure reason.
- **Lifecycle / ownership**: Produced by reviewer/verifier guidance during completion checks.

## Relationships

- Boundary Parser -> Domain State Model: parser produces valid states for internal use.
- Project Exception -> Reviewer Failure: exception prevents failure only for its documented scope.
- Reviewer Failure -> Goal/Subgoal Completion: failure blocks completion until fixed or exception is documented.

## State and Storage

- Spec artifacts live in `.specify/` and `specs/`.
- Durable goal evidence/receipts live under `.pi/agent/goal-state/` during execution and are not product behavior.

## Parsing, Invariants, and Validation Rules

- Parse external or uncertain inputs once at boundaries where practical.
- Model internal workflow states so impossible combinations are not representable where practical.
- Keep required runtime validation for TypeBox/tool schemas, trust boundaries, host APIs, and documented project exceptions.
- Prefer immutable updates and functional transformations unless a documented project requirement needs mutation or imperative control flow.
