# Identifiers

## path

```
segment.segment.segment…
```

- Lowercase Latin, digits, `_`
- Depth ≥ 2
- Immutable once `stable`

## sid

- 8 hex chars, usually first 8 of the fingerprint digest
- On collision — another slice of the hash
- Never reused after `deprecated`
- Primary field on the wire

## fingerprint

```
sha256_hex( kind + "|" + unit + "|" + normalize(path) )
```

Stored as `sha256:<hex>`. Two cards with the same fingerprint are duplicates; the validator rejects them.

## manifest

`registry/manifest.json` lists all `sid/path/fingerprint` and `registry_checksum` for cache integrity.

## legacy

`aliases.legacy` (e.g. `std:env.temperature`) is for migration from v0.1 only.
