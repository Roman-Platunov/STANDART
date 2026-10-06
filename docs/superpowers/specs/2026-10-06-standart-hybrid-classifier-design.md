# STANDART Hybrid Classifier Design

**Date:** 2026-10-06  
**Status:** Draft for user review  
**Version target:** 0.2.0  

## 1. Purpose

STANDART is an open **common data classifier** for identifying data types exchanged between **artificial intelligence** and **physical devices**.

Devices must not need to narrate who they are or what they measure. They send a code from the shared library. Receivers (AI, gateways, clouds) resolve that code to a full hierarchical meaning.

The library grows continuously via community contributions, with automatic duplicate detection and optional human review for ambiguous cases.

## 2. Decisions (approved)

| Topic | Decision |
|-------|----------|
| Path model | Free tree of any depth (option B) |
| Identity | Hybrid: full **path** + short **sid** |
| Duplicate policy | Automatic checks + maintainer review for near-duplicates (option B) |
| Audience | Machines and humans; AI ↔ devices |

## 3. Identity model

Each parameter is one registry card with three linked identifiers:

| Field | Role | Example |
|-------|------|---------|
| `path` | Full hierarchical address (humans, AI, duplicate search) | `physical.environment.air.temperature.celsius` |
| `sid` | Short stable id (devices, wire exchange) | `7f3a9c2e` |
| `fingerprint` | Checksum of normalized meaning (anti-duplicate) | `sha256:…` of `kind\|unit\|normalized_path` |

### 3.1 Path rules

- Segments: lowercase Latin `a-z`, digits `0-9`, underscore `_`, separated by `.`
- Any depth ≥ 2 (e.g. `physical.temperature` minimum useful shape; deeper preferred when needed)
- Path meaning is immutable once `status: stable`
- Incompatible meaning change ⇒ new card + new `sid`; old card → `deprecated`

### 3.2 Short id (`sid`) rules

- Assigned when a card is accepted into the registry
- Opaque hex string (8 chars in v0.2; may grow later without breaking parsers that treat sid as opaque)
- Never reused after deprecation
- Primary field on the wire

### 3.3 Aliases

Optional, always resolve to the same `sid`:

- `aliases.ru` — human path in Russian (documentation / search)
- `aliases.short` — convenience short path
- `aliases.legacy` — previous `std:…` ids during migration

### 3.4 Wire payload (minimum)

```json
{ "sid": "7f3a9c2e", "v": 23.4 }
```

Optional: `t` (timestamp), `unit` / `enc` only when overriding card defaults is allowed by profile rules (default: not required).

Full path is **not** required on the wire if both sides share the same registry revision (verified via manifest checksum).

## 4. Type card schema (v0.2)

```yaml
sid: "7f3a9c2e"
path: physical.environment.air.temperature.celsius
aliases:
  ru: физическое.среда.воздух.температура.цельсий
  short: temp.air.c
  legacy: std:env.temperature
kind: quantity
unit: Cel
encodings: [f32, f64, i16]
range: { min: -273.15, max: 1000 }
sensitivity: public
status: stable
title: { ru: Температура воздуха, en: Air temperature }
description:
  ru: …
  en: …
fingerprint: "sha256:…"
```

Required fields: `sid`, `path`, `kind`, `unit` (use `-` if N/A), `encodings`, `sensitivity`, `status`, `title`, `fingerprint`.

## 5. Anti-duplicate and integrity

### 5.1 Normalization

Before fingerprinting:

1. Lowercase path; reject empty segments and illegal characters
2. Canonicalize unit to UCUM (registry `units.yaml`)
3. Normalize `kind` to the closed enum

### 5.2 Fingerprint

```
fingerprint = sha256_hex( kind + "|" + unit + "|" + normalized_path )
```

Stored on the card as `sha256:<hex>` or bare hex (pick one in implementation; recommend `sha256:<hex>`).

### 5.3 Validator rejects when

- Duplicate `path`
- Duplicate `fingerprint`
- Duplicate `sid`
- Alias already bound to another `sid`

### 5.4 Soft review (needs-review)

If path differs but is suspiciously similar (shared long prefix, small edit distance, thesaurus hit such as `air` ≈ `ambient`), CI marks **needs-review** — no auto-merge without maintainer.

### 5.5 Registry manifest

`registry/manifest.json`:

```json
{
  "version": "0.2.0",
  "entries": [
    { "sid": "7f3a9c2e", "path": "physical.environment.air.temperature.celsius", "fingerprint": "sha256:…" }
  ],
  "registry_checksum": "sha256:…"
}
```

`registry_checksum` = hash over a canonical serialization of all entries (sorted by `sid`).  
Clients verify local cache against the published checksum.

## 6. Contribution flow

```
User searches library
  → not found
  → adds YAML card (path, kind, unit, titles; sid/fingerprint may be tool-generated)
  → npm run validate
  → open PR
  → CI: schema + uniqueness + fingerprint match + soft similarity
  → pass → merge (assign sid if missing)
  → ambiguous → maintainer review
```

Rules for contributors:

- Do not invent a new card if an existing path/fingerprint already covers the meaning
- Prefer extending path depth over inventing parallel roots for the same concept
- Provide bilingual titles (`ru` / `en`)

## 7. Migration from v0.1

| v0.1 | v0.2 |
|------|------|
| `id: std:env.temperature` | `path` + `sid` + `fingerprint`; legacy alias kept |
| Device profiles primary | Profiles secondary (optional bundles of sids) |
| Payload `type`/`unit`/`enc` | Minimum `{ sid, v }` |
| Validate schema only | + uniqueness + manifest checksum |
| C/TS macros by type name | Constants for `sid` and `path` |

Existing ~43 types are rewritten into hierarchical paths under roots such as `physical`, `identity`, `temporal`, `logical`, `actuation`, `media`, `network`.

Version bump: registry **0.2.0**.

## 8. Repository layout (target)

```
registry/
  types/*.yaml
  domains.yaml          # optional soft guidance for first path segment
  units.yaml
  thesaurus.yaml        # optional similarity hints
  version.yaml
  manifest.json         # generated
tools/
  validate.mjs
  fingerprint.mjs
  codegen.mjs
  build-manifest.mjs
sdk/c/standart.h
sdk/ts/
spec/ru/  spec/en/
examples/
docs/superpowers/specs/
```

## 9. Out of scope (this redesign)

- Proprietary transport protocol
- Web UI for browsing the catalog
- Automatic NLP synonym merge without review
- Formal ISO/GOST ratification

## 10. Success criteria

1. Every parameter has unique `path`, `sid`, and `fingerprint`
2. Device payload can be only `{ sid, v }`
3. AI/gateway can resolve `sid` → full `path` via registry
4. Contributor cannot merge a duplicate path/fingerprint
5. `registry_checksum` detects tampered or stale library copies
6. Docs (RU/EN) describe the hybrid model clearly

## 11. Open implementation details (non-blocking)

- Exact `sid` generation: first 8 hex chars of hash vs sequential — recommend hash-derived with collision retry
- Whether `celsius` remains in path while `unit: Cel` is mandatory — recommend **yes** (path is human taxonomy; unit field is machine-canonical UCUM)
- Thesaurus size in v0.2: start small (`air`/`ambient`, `temp`/`temperature`) or empty + soft prefix check only
