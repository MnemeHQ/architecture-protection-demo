# Architecture Protection Demo

This repository demonstrates how Mneme HQ's Architecture Protection Audit distinguishes between architectural guidance and decisions that can be mechanically protected.

## Baseline

The default branch intentionally contains architectural protection gaps.

Expected Audit story:

- 3 protection-relevant decisions
- 1 protected
- 2 ready to protect
- 33% current protection

**33% is not a code-quality score.** It means: 1 of the 3 architectural decisions suitable for deterministic protection is currently protected.

## What Mneme Finds

### Decision A — Protected (ADR-001: Persistence Boundary)

**Intent:** Domain and API code must access PostgreSQL through the repository abstraction rather than opening database clients directly.

**Evidence:** FORBID_LITERAL rules for `pg` and `postgres` in `src/domain/**` and `src/api/**`, verified by CI workflow.

### Decision B — Ready to Protect (ADR-002: Payment Provider Boundary)

**Intent:** Domain logic must not call Stripe/payment provider SDKs directly. External payment calls must go through the payment adapter.

**Status:** Clear architectural decision in ADR, constraint documented ("no stripe"), but no FORBID_LITERAL rule or CI check yet.

### Decision C — Ready to Protect (ADR-003: HTTP/API Boundary)

**Intent:** New HTTP endpoints belong in the API layer and workers/background jobs must not expose HTTP handlers directly.

**Status:** Clear architectural decision in ADR, constraint documented ("no http"), but no FORBID_LITERAL rule or CI check yet.

## Why Other Decisions Are Guidance

The repository also contains 11 architectural decisions (ADR-004 through ADR-014) that represent genuine development guidance:

- Prefer small modules (ADR-004)
- Write descriptive tests (ADR-005)
- Document externally visible behavior (ADR-006)
- Favour explicit domain terminology (ADR-007)
- Keep background jobs idempotent (ADR-008)
- Explain non-obvious trade-offs in ADRs (ADR-009)
- Use structured logs (ADR-010)
- Keep API responses predictable (ADR-011)
- Favour simple dependencies (ADR-012)
- Prefer reversible migrations (ADR-013)
- Document third-party failure modes (ADR-014)

Mneme correctly classifies these as **Guidance Only** — they are architectural principles and preferences, not constraints suitable for deterministic enforcement. This demonstrates that Mneme does not attempt to turn every architectural statement into a blocking rule.

## Protected State

The `mneme-protected` branch represents the same architecture after Mneme-style setup/protection.

Target after-state:

- 3 protection-relevant decisions
- 3 protected
- 0 remaining protection gaps
- 100% current protection

This branch adds FORBID_LITERAL rules and CI checks for Decisions B and C using mechanisms supported by the real Audit engine.

## Try the Audit

Run the Mneme HQ Architecture Protection Audit on this repository:

[https://mnemehq.com/audit](https://mnemehq.com/audit)

## Running Locally

```bash
npm install
npm run build
npm test
npm run lint
npm run typecheck
```

## License

MIT