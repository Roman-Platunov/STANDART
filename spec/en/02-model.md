# Data model

## Parameter card

| Field | Required | Description |
|-------|----------|-------------|
| `sid` | yes | Short stable id (8 hex) |
| `path` | yes | Hierarchical address, depth ≥ 2 |
| `fingerprint` | yes | `sha256:` of `kind\|unit\|normalized_path` |
| `kind` | yes | Nature of the value |
| `unit` | yes | UCUM (`-` if N/A) |
| `encodings` | yes | Allowed representations |
| `sensitivity` | yes | Sensitivity class |
| `status` | yes | `stable` \| `draft` \| `deprecated` |
| `title` | yes | `{ ru, en }` |
| `aliases` | no | `ru`, `short`, `legacy` |

## Reading (wire)

```json
{ "sid": "24d3556f", "v": 23.4, "t": 1738860000 }
```

Devices need not send `path` or `unit` when both sides share the same registry (verified via `registry_checksum`).

## Device profile (optional)

A list of `sid` values the device must / may emit. AI ↔ device exchange only needs per-reading `sid`s.
