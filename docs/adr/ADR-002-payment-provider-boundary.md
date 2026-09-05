# ADR-002: Payment Provider Boundary

## Status
Active

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