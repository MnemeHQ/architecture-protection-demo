---
id: ADR-014
title: Document Third-Party Failure Modes
status: Active
date: 2026-01-15
---

# ADR-014: Document Third-Party Failure Modes

## Context
External services (payment providers, email, storage) fail in ways we can't control. Assuming they always succeed leads to silent data loss or stuck orders.

## Decision
For each external dependency, document: expected failure modes (timeout, 5xx, rate limit, invalid webhook), retry strategy, fallback behavior, and alerting. Record in the corresponding integration ADR.

## Consequences
- Failures are handled gracefully
- On-call knows what to expect
- SLA negotiations are informed

## Enforcement
Guidance only — no mechanical enforcement planned.