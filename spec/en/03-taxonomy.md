# Taxonomy v0.2

## Path tree

A free tree. Suggested root segments (not a hard enum):

| Root | Meaning |
|------|---------|
| `physical` | Physical quantities (environment, electrical, mechanical, geo, health…) |
| `identity` | Identifiers |
| `temporal` | Time |
| `logical` | Flags, levels, modes |
| `actuation` | Commands and setpoints |
| `media` | Media references |
| `network` | Network |

Examples:

- `physical.environment.temperature`
- `physical.electrical.voltage`
- `identity.device`
- `actuation.power`

## Kinds and encodings

See `schema/type.schema.json` — same closed sets as v0.1 (`quantity`, `enum`, `f32`, …).

## Units

Canonical UCUM in field `unit` (`registry/units.yaml`). A path segment may repeat the idea for humans; machines rely on `unit`.
