# Data model

## Classification layers

A device value is described from general to specific:

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Kind** | Nature of the value | `quantity`, `enum`, `identity`, `temporal`, `spatial`, `logical`, `media`, `structured`, `event`, `command` |
| **Domain** | Subject area | `env`, `elec`, `mech`, `motion`, `geo`, `health`, `net`, `sec`, `media`, `id`, `time`, `act` |
| **Type** | Concrete type | `temperature`, `voltage`, `geopoint` |
| **Unit** | UCUM unit | `Cel`, `V`, `m/s`, `-` (dimensionless / N/A) |
| **Encoding** | On-wire / JSON representation | `bool`, `u8`, `i16`, `i32`, `f32`, `f64`, `utf8`, `bytes`, `record`, `enum` |
| **Constraints** | Range, step, enumeration | `min`, `max`, `step`, `enumValues` |
| **Sensitivity** | Optional sensitivity class | `public`, `internal`, `personal`, `restricted` |

## Type card

A type card is a record in `registry/types/*.yaml`:

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Canonical id `std:<domain>.<type>` |
| `kind` | yes | One of Kind |
| `domain` | yes | Domain code |
| `defaultUnit` | yes | Default UCUM code (`-` if none) |
| `encodings` | yes | Allowed encodings |
| `range` | no | `{ min, max, unit }` for quantities |
| `enumValues` | no | Allowed values for enums |
| `sensitivity` | yes | Sensitivity level |
| `status` | yes | `stable` \| `draft` \| `deprecated` |
| `title` | yes | `{ ru, en }` |
| `description` | no | `{ ru, en }` |

## Reading

Minimal logical value record (transport is not standardized):

```json
{
  "type": "std:env.temperature",
  "unit": "Cel",
  "enc": "f32",
  "v": 23.4,
  "t": 1738860000
}
```

| Field | Description |
|-------|-------------|
| `type` | Type identifier |
| `unit` | UCUM unit compatible with the card |
| `enc` | Encoding from the card's list |
| `v` | Value |
| `t` | Optional Unix timestamp (UTC seconds) |

## Device profile

A profile (`registry/profiles/*.yaml`) lists required and optional types for a device class. Vendors claim conformance with a list of type ids, not a marketing name.
