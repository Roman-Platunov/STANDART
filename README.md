# STANDART

**Simple Typed And Named Data for Apparatus, Registry and Things**

Open standard + machine-readable registry of **data types for devices**.  
Any manufacturer can take types from this library and build interoperable devices — without inventing private magic numbers for temperature, voltage, GPS, and similar values.

| Artifact | Location | License |
|----------|----------|---------|
| Specification (RU / EN) | [`spec/`](spec/) | [CC-BY-4.0](LICENSE-SPEC) |
| Type registry | [`registry/`](registry/) | [Apache-2.0](LICENSE) |
| C / TypeScript SDK | [`sdk/`](sdk/) | [Apache-2.0](LICENSE) |

Registry version: **0.1.0**

## 5-minute start

```bash
npm install
npm run validate   # check registry
npm run codegen    # regenerate sdk/c/standart.h and sdk/ts
```

Use a type id in your payload (any transport):

```json
{
  "deviceId": "urn:std:id:dev:01HZXEXAMPLE",
  "profile": "thermometer",
  "readings": [
    {
      "type": "std:env.temperature",
      "unit": "Cel",
      "enc": "f32",
      "v": 23.4,
      "t": 1738860000
    }
  ]
}
```

Full example: [`examples/thermometer/`](examples/thermometer/).

### Firmware (C)

```c
#include "sdk/c/standart.h"

/* STD_ENV_TEMPERATURE == "std:env.temperature" */
```

### Cloud / apps (TypeScript)

```ts
import { TypeId, getType } from "./sdk/ts/index.ts";

getType(TypeId.ENV_TEMPERATURE);
```

## How classification works

```
std:<domain>.<type>                 → std:env.temperature
std:<domain>.<type>#<unit>:<enc>    → std:env.temperature#Cel:f32
```

Layers: **kind → domain → type → unit (UCUM) → encoding → constraints → sensitivity**.

STANDART defines **types**, not the wire protocol. Use MQTT, BLE, Modbus, HTTP, or anything else.

## Device profiles (v0.1)

| Profile | Required types |
|---------|----------------|
| `thermometer` | `std:env.temperature`, `std:id.device` |
| `meter` | voltage, current, power, device id |
| `gps` | geopoint, device id |
| `actuator` | power on/off, device id |

Claim conformance as: `STANDART 0.1 — L2 — profile: thermometer`.

## Docs

- Russian: [`spec/ru/01-overview.md`](spec/ru/01-overview.md)
- English: [`spec/en/01-overview.md`](spec/en/01-overview.md)
- Contributing: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Governance: [`GOVERNANCE.md`](GOVERNANCE.md)

## Out of scope (for now)

- A proprietary transport protocol
- Formal ISO / GOST status
- Economic classification systems (ISIC, HS, …)

## License

- Specification text: Creative Commons Attribution 4.0 — see [LICENSE-SPEC](LICENSE-SPEC)
- Registry, tools, and SDK: Apache License 2.0 — see [LICENSE](LICENSE)
