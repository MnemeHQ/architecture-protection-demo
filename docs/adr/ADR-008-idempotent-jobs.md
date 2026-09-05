---
id: ADR-008
title: Idempotent Background Jobs
status: Active
date: 2026-01-15
---

# ADR-008: Idempotent Background Jobs

## Context
Workers may retry on failure. Non-idempotent jobs cause duplicate charges, double emails, or corrupted state.

## Decision
Design background jobs to be safely re-runnable. Use idempotency keys for external calls. Prefer `INSERT ... ON CONFLICT` over `SELECT` then `INSERT`.

## Consequences
- Retries are safe
- Exactly-once semantics without distributed transactions
- Easier reasoning about failure recovery

## Enforcement
Guidance only — no mechanical enforcement planned.