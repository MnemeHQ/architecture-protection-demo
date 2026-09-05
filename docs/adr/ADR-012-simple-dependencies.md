---
id: ADR-012
title: Favour Simple Dependencies
status: accepted
priority: normal
date: 2026-01-15
scope: dependencies
---

# ADR-012: Favour Simple Dependencies

## Context
Heavy frameworks pull in transitive dependencies, increase bundle size, and constrain architecture. Prefer standard library and small focused packages.

## Decision
Default to Node.js built-ins (`fetch`, `crypto`, `stream`) and minimal dependencies. Evaluate each dependency for: bundle impact, maintenance burden, and whether the same can be achieved with 50 lines of code.

## Consequences
- Smaller attack surface
- Faster installs and builds
- Less version conflict risk

## Enforcement
Guidance only — no mechanical enforcement planned.