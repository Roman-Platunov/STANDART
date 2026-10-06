# Example: thermometer profile

Minimal STANDART L2 payload for a temperature sensor.

- Profile: [`thermometer`](../../registry/profiles/thermometer.yaml)
- Required types: `std:env.temperature`, `std:id.device`
- Sample payload: [`payload.json`](payload.json)

Transport is not specified — publish this JSON over MQTT, HTTP, BLE GATT, etc.

## C sketch

```c
#include "../../sdk/c/standart.h"

const char *type = STD_ENV_TEMPERATURE;          /* "std:env.temperature" */
const char *ref  = STD_ENV_TEMPERATURE_REF;      /* "std:env.temperature#Cel:f32" */
const char *profile = STD_PROFILE_THERMOMETER;   /* "thermometer" */
```

## Validate registry (from repo root)

```bash
npm install
npm run build
```
