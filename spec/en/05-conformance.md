# Conformance

## L1 — Type-aware payload

Sender uses a registered `sid`; value is compatible with the card.

## L2 — Profile (optional)

Device declares a profile and emits every `required` sid.

## L3 — Tooling

Validator checks fingerprint, uniqueness of path/sid/fingerprint/alias, and builds the manifest.

## Adding a parameter

1. Confirm path/meaning is not already present
2. Add YAML → `npm run build`
3. PR: CI rejects duplicates; similar paths warn / need review

## Check

```bash
npm run build
```
