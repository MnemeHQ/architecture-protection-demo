---
id: ADR-003
title: HTTP/API Boundary
status: accepted
priority: normal
date: 2026-01-15
scope: api
---

# ADR-003: HTTP/API Boundary

## Context
New HTTP endpoints belong in the API layer (`src/api/`). Workers and background jobs (`src/workers/`) must not expose HTTP handlers directly. This separation ensures request handling, authentication, and rate limiting are consistent.

## Decision
HTTP route registration and middleware live in `src/api/`. Worker processes import domain logic but never register Express/Fastify routes or handle raw HTTP requests.

## Consequences
- API layer owns the HTTP contract (schemas, versioning, auth)
- Workers stay focused on async processing
- Easier to add API-wide concerns (logging, tracing, rate limits)

## Enforcement
- FORBID_LITERAL: "express" in `src/workers/**`
- FORBID_LITERAL: "fastify" in `src/workers/**`
- FORBID_LITERAL: "createServer" in `src/workers/**`
- CI workflow `.github/workflows/ci.yml` verifies this boundary

## Constraints
- FORBID_LITERAL: express
  include_paths:
    - src/workers/**
- FORBID_LITERAL: fastify
  include_paths:
    - src/workers/**
- FORBID_LITERAL: createServer
  include_paths:
    - src/workers/**