---
id: ADR-007
title: Explicit Domain Terminology
status: accepted
priority: normal
date: 2026-01-15
scope: naming
---

# ADR-007: Explicit Domain Terminology

## Context
Vague names like `data`, `info`, `manager`, `handler` obscure meaning. Domain language should be ubiquitous in code.

## Decision
Use domain terms from the ubiquitous language: `Order`, `Payment`, `Customer`, `InventoryReservation`. Avoid generic suffixes (`Service`, `Util`, `Helper`) unless they carry domain meaning.

## Consequences
- Code reads like the business spec
- Onboarding is faster
- Cross-team communication improves

## Enforcement
Guidance only — no mechanical enforcement planned.