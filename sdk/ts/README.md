# @standart/types

Generated TypeScript bindings for the STANDART device type registry.

```ts
import { TypeId, getType, STANDART_REGISTRY_VERSION } from "./index.ts";

console.log(STANDART_REGISTRY_VERSION);
console.log(getType(TypeId.ENV_TEMPERATURE));
```

Regenerate with `node tools/codegen.mjs` from the repository root.
