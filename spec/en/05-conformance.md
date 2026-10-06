# Conformance

## Levels

### L1 — Type-aware payload

A device or service:

1. Uses only registered `std:` type ids (or explicitly declares an `x:` extension — out of scope for v0.1).
2. Provides `unit` and `enc` compatible with the type card.
3. For quantities, respects the card range when present.

### L2 — Profile conformance

A device:

1. Declares one or more profiles from `registry/profiles/`.
2. Always publishes every `required` type of the profile.
3. May publish `optional` profile types and any other registered types.

### L3 — Tooling conformance

A tool (validator, codegen, SDK):

1. Reads the YAML registry according to the JSON Schemas in `schema/`.
2. Rejects unknown kind / domain / encoding values.
3. Does not reuse deprecated ids as new ones.

## Conformance claim

A vendor may document:

```
STANDART 0.1 — L2 — profile: thermometer
```

## Verification

```bash
node tools/validate.mjs
```

Exit code 0 means the registry and profiles are consistent with the schemas.

## Out of scope

- Cryptographic device attestation.
- Third-party laboratory certification.
- Transport-protocol conformance.
