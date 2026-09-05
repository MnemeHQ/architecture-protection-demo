# ADR-005: Descriptive Tests

## Status
Active

## Context
Tests should read like specifications. Vague test names like "test save" don't communicate intent.

## Decision
Name tests after the behavior they verify: `rejects_invalid_email`, `applies_discount_when_eligible`. Avoid `test_` prefixes and generic names.

## Consequences
- Test output documents system behavior
- Failures are self-explanatory
- New contributors understand requirements faster

## Enforcement
Guidance only — no mechanical enforcement planned.