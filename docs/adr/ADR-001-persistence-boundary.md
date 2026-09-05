---
id: ADR-001
title: Persistence Boundary
status: Active
date: 2026-01-15
---

# ADR-001: Persistence Boundary

## Context
Domain and API code must access PostgreSQL through the repository abstraction rather than opening database clients directly. Direct database access couples business logic to infrastructure concerns, makes testing difficult, and prevents centralized query optimization.

## Decision
All database access goes through the repository layer in `src/repositories/`. Domain code (`src/domain/`) and API handlers (`src/api/`) must not import or use `pg`, `postgres`, or any raw database client directly.

## Consequences
- Repository implementations can be swapped for testing
- Query logic is centralized and auditable
- Migration and connection pooling are handled in one place

## Enforcement
- FORBID_LITERAL: "pg" in `src/domain/**` and `src/api/**`
- FORBID_LITERAL: "postgres" in `src/domain/**` and `src/api/**`
- CI workflow `.github/workflows/ci.yml` verifies this boundary