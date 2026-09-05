---
id: ADR-013
title: Reversible Migrations
status: accepted
priority: normal
date: 2026-01-15
scope: database
---

# ADR-013: Reversible Migrations

## Context
Irreversible schema changes block rollback and increase deployment risk. Every migration should have a down path.

## Decision
Write migrations as pairs: `up` and `down`. Test both directions in CI. Avoid `DROP COLUMN`, `DROP TABLE`, or type changes without a migration strategy.

## Consequences
- Safe rollbacks
- Confidence in deployments
- Easier experimentation

## Enforcement
Guidance only — no mechanical enforcement planned.