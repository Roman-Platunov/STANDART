# STANDART

**Simple Typed And Named Data for Apparatus, Registry and Things**

Open **hybrid data classifier** for identifying data exchanged between **AI and physical devices**.

A device does not describe itself in prose — it sends a **short code (`sid`)** from the shared library. Humans and AI resolve it to a full hierarchical **`path`**.

| Form | Example |
|------|---------|
| Full path | `physical.environment.temperature` |
| Short sid | `24d3556f` |
| Fingerprint | `sha256:24d3556f…` (anti-duplicate) |

Registry version: **0.20.0** · **7762** parameters · regenerate via `npm run expand` · **Public open-source repository**.

**Coverage:** layers A–B18 in `registry/seeds/` (broad multi-industry). Open growing registry — not an infinite dump of every sensor on Earth. Add missing types via seeds + `npm run expand`.

| Artifact | Location | License |
|----------|----------|---------|
| Spec (RU / EN) | [`spec/`](spec/) | [CC-BY-4.0](LICENSE-SPEC) |
| Registry | [`registry/`](registry/) | [Apache-2.0](LICENSE) |
| C / TypeScript SDK | [`sdk/`](sdk/) | [Apache-2.0](LICENSE) |
| Design | [`docs/superpowers/specs/`](docs/superpowers/specs/) | — |

## 5-minute start

```bash
npm install
npm run build    # fingerprint tests + validate + manifest + codegen
```

Wire payload (any transport):

```json
{
  "sid": "24d3556f",
  "v": 23.4,
  "t": 1738860000
}
```

Full example: [`examples/thermometer/`](examples/thermometer/).

### Firmware (C)

```c
#include "sdk/c/standart.h"
/* STD_SID_PHYSICAL_ENVIRONMENT_TEMPERATURE → "24d3556f" */
/* STD_PATH_PHYSICAL_ENVIRONMENT_TEMPERATURE → "physical.environment.temperature" */
```

### Cloud / AI (TypeScript)

```ts
import { Sid, getBySid, STANDART_REGISTRY_CHECKSUM } from "./sdk/ts/index.ts";

getBySid(Sid.PHYSICAL_ENVIRONMENT_TEMPERATURE);
```

## How it works

```mermaid
flowchart LR
  Device -->|sid + v| Gateway
  Gateway --> Registry
  Registry -->|path + meaning| AI
```

- **path** — free tree of any depth (`a.b.c.d`)
- **sid** — short stable id on the wire
- **fingerprint** — blocks duplicate meaning
- **manifest `registry_checksum`** — verifies library integrity

Contributors add missing parameters via PR; validator rejects duplicates; near-matches need review.

## Docs

- Russian: [`spec/ru/01-overview.md`](spec/ru/01-overview.md)
- English: [`spec/en/01-overview.md`](spec/en/01-overview.md)
- Design: [`docs/superpowers/specs/2026-10-06-standart-hybrid-classifier-design.md`](docs/superpowers/specs/2026-10-06-standart-hybrid-classifier-design.md)
- Contributing: [`CONTRIBUTING.md`](CONTRIBUTING.md)

## License

- Spec: [LICENSE-SPEC](LICENSE-SPEC) (CC-BY-4.0)
- Code & registry: [LICENSE](LICENSE) (Apache-2.0)
