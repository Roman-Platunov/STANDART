# Example: thermometer (STANDART 0.2)

Minimum L2 payload — devices send **sid + value** only.

| sid | path |
|-----|------|
| `24d3556f` | `physical.environment.temperature` |
| `3d53bc7d` | `identity.device` |

Sample: [`payload.json`](payload.json)

```c
#include "../../sdk/c/standart.h"
const char *sid = STD_SID_PHYSICAL_ENVIRONMENT_TEMPERATURE; /* "24d3556f" */
```

```bash
npm run build
```
