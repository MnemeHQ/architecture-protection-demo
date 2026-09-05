# AGENTS.md

This file provides guidance for AI coding agents working on this repository.

## Architecture Overview

This is a small TypeScript service demonstrating architectural boundaries:

- **src/api/** — HTTP endpoints, request/response handling
- **src/domain/** — Business logic (OrderService, Order entity)
- **src/repositories/** — Data access abstraction (OrderRepository interface + Postgres implementation)
- **src/payments/** — Payment provider abstraction (PaymentAdapter + StripeAdapter)
- **src/workers/** — Background job processors

## Architectural Decisions (ADRs)

Key decisions are recorded in `docs/adr/`:

- **ADR-001** (Protected): Persistence boundary — domain/api must not import `pg` or `postgres` directly. Enforced by CI.
- **ADR-002** (Ready to Protect): Payment provider boundary — domain must not import `stripe` directly. Not yet mechanically enforced.
- **ADR-003** (Ready to Protect): HTTP/API boundary — workers must not register HTTP handlers. Not yet mechanically enforced.
- **ADR-004–014** (Guidance): Development principles (module size, test naming, documentation, etc.) — not mechanically enforced.

## Enforcement

- `npm run lint` — ESLint checks
- `npm run typecheck` — TypeScript compilation check
- `npm test` — Unit tests
- CI workflow `.github/workflows/ci.yml` — Architecture boundary checks

## Conventions

- Domain code: pure TypeScript, no framework imports
- Repository implementations: only place for `pg` imports
- Payment adapter: only place for `stripe` imports
- API routes: only place for `express` imports
- Workers: no `express`, `fastify`, or HTTP server imports