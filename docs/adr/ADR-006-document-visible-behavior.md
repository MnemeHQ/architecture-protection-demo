---
id: ADR-006
title: Document Externally Visible Behavior
status: Active
date: 2026-01-15
---

# ADR-006: Document Externally Visible Behavior

## Context
API contracts, event schemas, and error formats are the primary interface for consumers. Internal implementation details can change; the external surface must be documented.

## Decision
Every public API endpoint, emitted event, and error response has a corresponding ADR or OpenAPI spec entry. Private helpers do not require this level of documentation.

## Consequences
- Consumers can integrate confidently
- Breaking changes are visible in review
- Documentation stays in sync with code

## Enforcement
Guidance only — no mechanical enforcement planned.