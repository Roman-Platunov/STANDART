# STANDART Hybrid Classifier v0.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate STANDART from short `std:domain.type` ids to a hybrid classifier (`path` + `sid` + `fingerprint`) for AI ↔ device data identification, with anti-duplicate validation and registry checksum.

**Architecture:** Each parameter is a YAML card with hierarchical `path`, opaque short `sid`, and SHA-256 `fingerprint` of normalized meaning. Devices exchange `{sid,v}`; tools validate uniqueness and emit `registry/manifest.json` plus C/TS SDKs.

**Tech Stack:** Node.js ≥18, `yaml` package, JSON Schema, YAML registry, generated C header + TypeScript.

**Spec:** [docs/superpowers/specs/2026-10-06-standart-hybrid-classifier-design.md](../specs/2026-10-06-standart-hybrid-classifier-design.md)

## Global Constraints

- Identity: hybrid `path` + `sid` + `fingerprint` (no return to `std:` as primary id)
- Path: free tree, segments `[a-z0-9_]+`, depth ≥ 2, Latin canonical
- Wire minimum: `{ "sid", "v" }`
- Fingerprint: `sha256_hex(kind + "|" + unit + "|" + normalized_path)`, stored as `sha256:<hex>`
- sid: 8-char hex, opaque, never reused
- Duplicate policy: hard fail on path/sid/fingerprint/alias clash; soft needs-review on similar paths
- Registry version target: `0.2.0`
- Licenses unchanged (spec CC-BY-4.0, code/registry Apache-2.0)
- Bilingual docs RU + EN
- Do not invent a transport protocol or web UI in this plan

## File map

| Path | Responsibility |
|------|----------------|
| `tools/lib/normalize.mjs` | Path/unit normalization helpers |
| `tools/lib/fingerprint.mjs` | Fingerprint + sid derivation |
| `tools/validate.mjs` | Schema + uniqueness + soft similarity |
| `tools/build-manifest.mjs` | Generate `registry/manifest.json` |
| `tools/codegen.mjs` | Generate SDK from new card shape |
| `tools/migrate-cards.mjs` | One-shot helper to rewrite v0.1 cards (optional; may be inline script) |
| `schema/type.schema.json` | v0.2 type card schema |
| `registry/types/*.yaml` | Migrated cards |
| `registry/manifest.json` | sid/path/fingerprint index + checksum |
| `registry/version.yaml` | `0.2.0` |
| `registry/thesaurus.yaml` | Small synonym list for soft warnings |
| `sdk/c/standart.h`, `sdk/ts/*` | Regenerated |
| `spec/ru/*`, `spec/en/*` | Rewritten for hybrid model |
| `README.md`, `examples/thermometer/*` | Updated payloads |
| `CONTRIBUTING.md`, `GOVERNANCE.md` | Contribution + sid stability rules |

---

### Task 1: Fingerprint and normalize library

**Files:**
- Create: `tools/lib/normalize.mjs`
- Create: `tools/lib/fingerprint.mjs`
- Create: `tools/lib/fingerprint.test.mjs` (simple assert script runnable via `node`)

**Interfaces:**
- Produces: `normalizePath(path) -> string`, `computeFingerprint({kind, unit, path}) -> "sha256:<hex>"`, `deriveSid(fingerprint) -> 8-hex` (first 8 of fingerprint hex; collision handled later in validate)

- [ ] **Step 1:** Implement `normalizePath` (lowercase, trim, reject empty/illegal segments)
- [ ] **Step 2:** Implement `computeFingerprint` and `deriveSid`
- [ ] **Step 3:** Write `fingerprint.test.mjs` with fixed known vector (same inputs ⇒ same hash)
- [ ] **Step 4:** Run `node tools/lib/fingerprint.test.mjs` — must pass
- [ ] **Step 5:** Commit

```bash
git add tools/lib
git commit -m "Add path normalize and fingerprint helpers for STANDART 0.2."
```

---

### Task 2: JSON Schema v0.2 for type cards

**Files:**
- Modify: `schema/type.schema.json`
- Keep: `schema/profile.schema.json` (optional profiles still valid; required types become sids or paths — prefer sids)

**Interfaces:**
- Produces: schema requiring `sid`, `path`, `kind`, `unit`, `encodings`, `sensitivity`, `status`, `title`, `fingerprint`; optional `aliases.{ru,short,legacy}`, `range`, `description`, `enumValues`

- [ ] **Step 1:** Replace type schema fields from v0.1 (`id`/`domain`/`defaultUnit`) to v0.2
- [ ] **Step 2:** Update profile schema so `required`/`optional` items match `^[0-9a-f]{8}$` (sid) — or allow path; **prefer sid**
- [ ] **Step 3:** Commit

```bash
git commit -m "Update JSON Schema for hybrid path/sid type cards."
```

---

### Task 3: Migrate all registry type cards to path/sid/fingerprint

**Files:**
- Modify: all `registry/types/*.yaml`
- Modify: `registry/version.yaml` → `0.2.0`
- Create: `registry/thesaurus.yaml` (minimal: air/ambient, temp/temperature)
- Modify: `registry/profiles/*.yaml` to reference sids after cards exist
- Delete or stop using: domain-as-primary model in cards (`domain` field removed)

**Mapping guidance (examples):**

| legacy | path |
|--------|------|
| `std:env.temperature` | `physical.environment.temperature` |
| `std:elec.voltage` | `physical.electrical.voltage` |
| `std:id.device` | `identity.device` |
| `std:geo.geopoint` | `physical.geo.geopoint` |
| `std:act.power` | `actuation.power` |

- [ ] **Step 1:** For each card: set `path`, compute fingerprint, derive sid, set `unit` (ex-defaultUnit), `aliases.legacy`
- [ ] **Step 2:** Prefer a small Node script `tools/migrate-cards.mjs` reading old YAML and writing new (if old files still on disk); otherwise rewrite in place
- [ ] **Step 3:** Update profiles to list sids
- [ ] **Step 4:** Commit

```bash
git commit -m "Migrate registry cards to hybrid path/sid/fingerprint (0.2.0)."
```

---

### Task 4: Validator with anti-duplicate and soft similarity

**Files:**
- Modify: `tools/validate.mjs`
- Consumes: `tools/lib/normalize.mjs`, `tools/lib/fingerprint.mjs`, `registry/thesaurus.yaml`

**Behavior:**
- Verify fingerprint matches recomputation
- Fail on duplicate path / sid / fingerprint / alias
- Warn (exit non-zero only if `--strict-similar`) on high path similarity or thesaurus collision
- Verify unit exists in `units.yaml`
- Count types/profiles; print OK summary

- [ ] **Step 1:** Rewrite validate for v0.2 cards
- [ ] **Step 2:** Run `npm run validate` — must pass on migrated registry
- [ ] **Step 3:** Temporarily duplicate a path in a scratch file / assert failure, then remove
- [ ] **Step 4:** Commit

```bash
git commit -m "Validate uniqueness of path, sid, fingerprint, and aliases."
```

---

### Task 5: Manifest builder and npm scripts

**Files:**
- Create: `tools/build-manifest.mjs`
- Create/overwrite: `registry/manifest.json` (generated)
- Modify: `package.json` scripts: `validate`, `manifest`, `codegen`, `build` (= validate && manifest && codegen)

**Interfaces:**
- Produces: `{ version, entries: [{sid,path,fingerprint}], registry_checksum }`
- `registry_checksum` = sha256 of canonical JSON of sorted entries

- [ ] **Step 1:** Implement build-manifest
- [ ] **Step 2:** Wire npm scripts
- [ ] **Step 3:** Run `npm run build` — OK
- [ ] **Step 4:** Commit including generated `manifest.json`

```bash
git commit -m "Add registry manifest with checksum for cache integrity."
```

---

### Task 6: Codegen SDK (C + TypeScript)

**Files:**
- Modify: `tools/codegen.mjs`
- Modify: `sdk/c/standart.h`
- Modify: `sdk/ts/index.ts`, `sdk/ts/package.json`, `sdk/ts/README.md`

**Produces:**
- C macros: `STD_SID_<PATH_AS_MACRO>` → sid string; also path string macros
- TS: `TypeId` by path key, `getBySid`, `getByPath`, `STANDART_REGISTRY_VERSION`, types for Reading `{sid, v, t?}`

- [ ] **Step 1:** Update codegen for new card shape
- [ ] **Step 2:** Run `npm run codegen`
- [ ] **Step 3:** Spot-check `STD_` macros and `getBySid`
- [ ] **Step 4:** Commit

```bash
git commit -m "Regenerate C/TS SDK for sid and path identifiers."
```

---

### Task 7: Spec, README, example, contributing

**Files:**
- Rewrite: `spec/ru/01-overview.md` … `05-conformance.md`
- Rewrite: `spec/en/01-overview.md` … `05-conformance.md`
- Modify: `README.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`
- Modify: `examples/thermometer/payload.json`, `examples/thermometer/README.md`

**Content focus:**
- Purpose: AI ↔ device identification via classifier
- Full vs short form
- Contribution + fingerprint anti-dupe
- Example payload uses `sid` only

- [ ] **Step 1:** Update RU/EN specs
- [ ] **Step 2:** Update README + example
- [ ] **Step 3:** Update CONTRIBUTING/GOVERNANCE for sid immutability and PR flow
- [ ] **Step 4:** `npm run build` green
- [ ] **Step 5:** Commit

```bash
git commit -m "Document hybrid classifier and update thermometer example."
```

---

### Task 8: Push private GitHub repo

**Files:** none (git remote)

- [ ] **Step 1:** `git status` clean; `npm run build` green
- [ ] **Step 2:** `git push -u origin main` (private repo `Roman-Platunov/STANDART`)
- [ ] **Step 3:** Confirm with `gh repo view --json url,isPrivate`

---

## Done when

- [ ] All type cards have unique path/sid/fingerprint
- [ ] `npm run build` passes
- [ ] Example thermometer uses `{sid,v}`
- [ ] Specs describe hybrid model in RU and EN
- [ ] Private GitHub `main` updated
