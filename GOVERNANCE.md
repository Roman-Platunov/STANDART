# Governance

## Goals

- Keep type identifiers **stable** and globally useful.
- Stay transport-agnostic so any device maker can adopt the registry.
- Version the registry with clear semver semantics.

## Identifier stability

1. A `stable` type id never changes meaning.
2. Deprecated ids remain in the registry with `status: deprecated` and are never reused.
3. New incompatible semantics require a new type id.
4. Draft types may evolve until promoted to `stable`.

## Semver for the registry

Tracked in `registry/version.yaml`:

| Bump | When |
|------|------|
| MAJOR | Removal of a stable type without prior deprecation, or incompatible meaning change (should not happen) |
| MINOR | New types, domains, units, profiles; draft promotions |
| PATCH | Documentation / title / description fixes that do not change machine semantics |

## Roles

- **Maintainers** — merge PRs, release registry versions, resolve disputes.
- **Contributors** — propose types, profiles, tooling, and documentation.

## Decision process

1. Technical changes via pull request with validation green (`npm run build`).
2. Contested type semantics: discussion in the PR; maintainers decide.
3. Spec and registry should stay consistent; codegen artifacts are regenerated, not hand-edited.

## Releases

1. Update `registry/version.yaml`.
2. Run `npm run build`.
3. Tag `vX.Y.Z` matching the registry version.
4. Note breaking deprecations in the release notes.
