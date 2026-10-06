# Таксономия v0.1

## Domains

| Код | Название (RU) | Название (EN) |
|-----|---------------|---------------|
| `env` | Окружающая среда | Environment |
| `elec` | Электричество | Electrical |
| `mech` | Механика | Mechanical |
| `motion` | Движение | Motion |
| `geo` | Геопространственные | Geospatial |
| `health` | Здоровье (потребительские типы) | Health (consumer types) |
| `id` | Идентификаторы | Identifiers |
| `time` | Время | Time |
| `logical` | Логические | Logical |
| `act` | Воздействия / уставки | Actuation |
| `media` | Медиа-ссылки | Media |
| `net` | Сеть | Network |
| `sec` | Безопасность | Security |

Типы в домене `health` — **не** медицинская сертификация; это лишь именование потребительских измерений.

## Типы v0.1

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

| Kind | Смысл |
|------|--------|
| `quantity` | Числовая величина с единицей |
| `enum` | Одно из фиксированных значений |
| `identity` | Идентификатор сущности |
| `temporal` | Момент или длительность |
| `spatial` | Координаты / положение в пространстве |
| `logical` | Флаг, уровень, режим |
| `media` | Ссылка на медиа |
| `structured` | Составная запись (record) |
| `event` | Событие |
| `command` | Команда воздействия |

## Encodings

| Encoding | Описание |
|----------|----------|
| `bool` | Логическое |
| `u8` | Беззнаковое 8 бит |
| `i16` | Знаковое 16 бит |
| `i32` | Знаковое 32 бит |
| `f32` | IEEE-754 float32 |
| `f64` | IEEE-754 float64 |
| `utf8` | Строка UTF-8 |
| `bytes` | Произвольные байты |
| `record` | Структурированная запись |
| `enum` | Значение из `enumValues` |

## Sensitivity

| Уровень | Смысл |
|---------|--------|
| `public` | Можно публиковать открыто |
| `internal` | Внутри организации / устройства |
| `personal` | Персональные данные |
| `restricted` | Ограниченный доступ |
