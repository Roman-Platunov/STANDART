# Governance

## Goals

- Stable **sid** and **path** for AI ↔ device identification
- Growing library **without duplicates** (fingerprint + review)
- Transport-agnostic classifier

## Stability

1. `stable` path meaning never changes.
2. Deprecated `sid` values remain reserved forever.
3. New incompatible meaning ⇒ new card + new sid.
4. Soft similarity warnings require maintainer judgment before merge when ambiguous.

## Semver (`registry/version.yaml`)

| Bump | When |
|------|------|
| MAJOR | Removal of stable sid without deprecation (should not happen) |
| MINOR | New parameters, thesaurus, profiles |
| PATCH | Titles/descriptions that do not change fingerprint material |

## Releases

1. Bump `registry/version.yaml`
2. `npm run build`
3. Commit generated `manifest.json` and SDK
4. Tag `vX.Y.Z`
