---
id: ADR-002
title: Payment Provider Boundary
status: Active
date: 2026-01-15
---

# ADR-002: Payment Provider Boundary

## Context
Domain logic must not call Stripe or other payment provider SDKs directly. External payment calls must go through the payment adapter in `src/payments/`. Direct SDK usage couples business logic to vendor-specific APIs and makes provider migration costly.

## Decision
All payment operations are routed through `src/payments/adapter.ts`. Domain code (`src/domain/`) must not import `stripe` or call Stripe APIs directly. The adapter provides a stable interface for charging, refunds, and webhook handling.

## Consequences
- Payment provider can be changed without touching domain logic
- Webhook signature verification is centralized
- Test doubles for payments are straightforward

## Enforcement
- Constraint: "no stripe" in domain code
- No FORBID_LITERAL rule yet — protection gap