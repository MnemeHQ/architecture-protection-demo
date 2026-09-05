---
id: ADR-004
title: Prefer Small Modules
status: accepted
priority: normal
date: 2026-01-15
scope: code_style
---

# ADR-004: Prefer Small Modules

## Context
Large modules are harder to understand, test, and change. Keeping modules focused reduces cognitive load.

## Decision
Prefer modules under 300 lines. Split when a file grows beyond this guideline. This is a principle, not a hard rule — exceptions exist for generated code or tightly coupled internals.

## Consequences
- Easier code review
- Clearer ownership
- Better test isolation

## Enforcement
Guidance only — no mechanical enforcement planned.
