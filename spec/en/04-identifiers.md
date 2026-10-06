# Identifiers

## Canonical type id

```
std:<domain>.<type>
```

Rules:

- Prefix is always `std:`.
- `<domain>` and `<type>` use lowercase Latin letters, digits, and `_`.
- An identifier is **stable**: its meaning does not change; incompatible change requires a new id and deprecation of the old one.
- An id is **never reused** after removal or deprecation.

Examples:

- `std:env.temperature`
- `std:elec.voltage`
- `std:id.device`

## Typed representation reference

```
std:<domain>.<type>#<unit>:<encoding>
```

- `<unit>` is a UCUM code; `-` if a unit does not apply.
- `<encoding>` is one of the encodings allowed by the type card.

Examples:

- `std:env.temperature#Cel:f32`
- `std:elec.voltage#V:f32`
- `std:id.device#-:utf8`
- `std:act.power#-:enum`

## Device identifier

Recommended form:

```
urn:std:id:dev:<opaque>
```

where `<opaque>` is a vendor-unique string (ULID, UUID without hyphens, etc.).

A payload may also carry a `std:id.device` value.

## Registry versioning

The registry uses semver:

- **MAJOR** — incompatible removal or meaning change of existing stable ids (forbidden without a deprecation path).
- **MINOR** — new types, domains, profiles; draft refinements.
- **PATCH** — description / typo fixes that do not change machine semantics.

Current registry version: **0.1.0** (`registry/version.yaml`).
