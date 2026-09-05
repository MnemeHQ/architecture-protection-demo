---
id: ADR-005
title: Descriptive Tests
status: accepted
priority: normal
date: 2026-01-15
scope: testing
---

# ADR-005: Descriptive Tests

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