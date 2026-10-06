# STANDART — Overview

**STANDART** (Simple Typed And Named Data for Apparatus, Registry and Things) is an open standard for classifying data types used by devices.

Specification version: **0.1.0**

## Why

Device makers and cloud developers often invent private codes for temperature, voltage, GPS, and similar values. Devices of the same class then cannot interoperate without manual mapping.

STANDART defines a **shared type registry**: stable identifiers, UCUM units, allowed encodings, and device profiles. Transport (MQTT, BLE, Modbus, HTTP) remains the vendor's choice.

## Three artifacts

1. **Specification** — human-readable rules (this directory).
2. **Registry** — machine-readable type cards in `registry/`.
3. **Library** — generated C headers and TypeScript types in `sdk/`.

## Principle

Every value on a device is described by a registry type card, not a magic number:

```
std:env.temperature
```

Full representation reference:

```
std:env.temperature#Cel:f32
```

## Out of scope for v0.1

- A proprietary wire or wireless protocol.
- Formal ISO / national standard status.
- Economic or clinical classification systems (ISIC, HS, ICD).

## Licenses

- Specification: Creative Commons Attribution 4.0 (CC-BY-4.0).
- Registry and code: Apache License 2.0.

## Next

- [Data model](02-model.md)
- [Taxonomy](03-taxonomy.md)
- [Identifiers](04-identifiers.md)
- [Conformance](05-conformance.md)
