# Taxonomy v0.1

## Domains

| Code | Title (EN) | Title (RU) |
|------|------------|------------|
| `env` | Environment | Окружающая среда |
| `elec` | Electrical | Электричество |
| `mech` | Mechanical | Механика |
| `motion` | Motion | Движение |
| `geo` | Geospatial | Геопространственные |
| `health` | Health (consumer types) | Здоровье (потребительские типы) |
| `id` | Identifiers | Идентификаторы |
| `time` | Time | Время |
| `logical` | Logical | Логические |
| `act` | Actuation | Воздействия / уставки |
| `media` | Media | Медиа-ссылки |
| `net` | Network | Сеть |
| `sec` | Security | Безопасность |

Types in the `health` domain are **not** medical certification; they only name consumer measurements.

## Types v0.1

### env
`temperature`, `humidity`, `pressure`, `illuminance`, `co2`, `voc`, `pm25`

### elec
`voltage`, `current`, `power`, `energy`, `frequency`, `battery_soc`

### mech
`force`, `torque`, `pressure_gauge`, `flow`

### motion
`position`, `velocity`, `acceleration`, `rotation`

### geo
`geopoint`, `altitude`, `heading`

### health
`heart_rate`, `spo2`, `body_temp`

### id
`device`, `serial`, `mac`, `uuid`

### time
`timestamp`, `duration`

### logical
`flag`, `level`, `mode`

### act
`setpoint`, `command`, `power`

### media
`image_ref`, `audio_ref`

### net
`rssi`, `uptime`

## Kinds

| Kind | Meaning |
|------|---------|
| `quantity` | Numeric value with a unit |
| `enum` | One of a fixed set of values |
| `identity` | Entity identifier |
| `temporal` | Instant or duration |
| `spatial` | Coordinates / spatial position |
| `logical` | Flag, level, mode |
| `media` | Media reference |
| `structured` | Composite record |
| `event` | Event |
| `command` | Actuation command |

## Encodings

| Encoding | Description |
|----------|-------------|
| `bool` | Boolean |
| `u8` | Unsigned 8-bit |
| `i16` | Signed 16-bit |
| `i32` | Signed 32-bit |
| `f32` | IEEE-754 float32 |
| `f64` | IEEE-754 float64 |
| `utf8` | UTF-8 string |
| `bytes` | Opaque bytes |
| `record` | Structured record |
| `enum` | Value from `enumValues` |

## Sensitivity

| Level | Meaning |
|-------|---------|
| `public` | Safe to publish openly |
| `internal` | Organization / device internal |
| `personal` | Personal data |
| `restricted` | Restricted access |
