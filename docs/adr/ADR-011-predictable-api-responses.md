# ADR-011: Predictable API Responses

## Status
Active

## Context
Inconsistent response shapes (sometimes arrays, sometimes objects; varying error formats) force consumers to write defensive code.

## Decision
All successful responses wrap data in `{ "data": ... }`. All errors return `{ "error": { "code": "...", "message": "..." } }`. No bare arrays or primitives at the top level.

## Consequences
- Consumers can parse responses uniformly
- Error handling is consistent
- API evolution is safer

## Enforcement
Guidance only — no mechanical enforcement planned.