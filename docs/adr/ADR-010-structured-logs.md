---
id: ADR-010
title: Structured Logs
status: accepted
priority: normal
date: 2026-01-15
scope: ops
---

# ADR-010: Structured Logs

## Context
Unstructured logs are hard to query, alert on, and correlate. JSON logs with consistent fields enable operational visibility.

## Decision
Emit logs as JSON with at minimum: `timestamp`, `level`, `message`, `trace_id`, `span_id`. Domain events include `event_type` and `entity_id`.

## Consequences
- Log aggregation works out of the box
- Dashboards and alerts are reliable
- Distributed tracing integrates naturally

## Enforcement
Guidance only — no mechanical enforcement planned.
