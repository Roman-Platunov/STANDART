# STANDART — Overview

**STANDART** (Simple Typed And Named Data for Apparatus, Registry and Things) is an open **common data classifier** for exchange between **artificial intelligence** and **physical devices**.

Version: **0.2.0** (hybrid model)

## Why

A device does not narrate who it is or what it measures. It sends a **code from the shared library**. The receiver (AI, gateway, cloud) expands the code into a full hierarchical meaning.

## Full and short form

| Form | Field | Example | Where |
|------|-------|---------|-------|
| Full | `path` | `physical.environment.temperature` | library, AI, duplicate search |
| Short | `sid` | `24d3556f` | firmware, wire exchange |
| Checksum | `fingerprint` | `sha256:…` | anti-duplicate |

Minimum payload:

```json
{ "sid": "24d3556f", "v": 23.4 }
```

## Three artifacts

1. **Specification** — `spec/`
2. **Registry** — `registry/` (+ `manifest.json` with `registry_checksum`)
3. **SDK** — `sdk/c`, `sdk/ts`

## Licenses

- Spec: CC-BY-4.0
- Registry and code: Apache-2.0

## Next

- [Model](02-model.md)
- [Taxonomy](03-taxonomy.md)
- [Identifiers](04-identifiers.md)
- [Conformance](05-conformance.md)
