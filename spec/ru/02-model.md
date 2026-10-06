# Модель данных

## Слои классификации

Значение на устройстве описывается слоями от общего к конкретному:

| Слой | Назначение | Примеры |
|------|------------|---------|
| **Kind** | Природа значения | `quantity`, `enum`, `identity`, `temporal`, `spatial`, `logical`, `media`, `structured`, `event`, `command` |
| **Domain** | Предметная область | `env`, `elec`, `mech`, `motion`, `geo`, `health`, `net`, `sec`, `media`, `id`, `time`, `act` |
| **Type** | Конкретный тип | `temperature`, `voltage`, `geopoint` |
| **Unit** | Единица (UCUM) | `Cel`, `V`, `m/s`, `-` (безразмерный) |
| **Encoding** | Представление в байтах/JSON | `bool`, `u8`, `i16`, `i32`, `f32`, `f64`, `utf8`, `bytes`, `record`, `enum` |
| **Constraints** | Диапазон, шаг, перечисление | `min`, `max`, `step`, `enumValues` |
| **Sensitivity** | Чувствительность (опционально) | `public`, `internal`, `personal`, `restricted` |

## Карточка типа

Карточка типа — запись в `registry/types/*.yaml`:

| Поле | Обязательно | Описание |
|------|-------------|----------|
| `id` | да | Канонический идентификатор `std:<domain>.<type>` |
| `kind` | да | Один из Kind |
| `domain` | да | Код домена |
| `defaultUnit` | да | UCUM-код по умолчанию (`-` если нет) |
| `encodings` | да | Список допустимых encoding |
| `range` | нет | `{ min, max, unit }` для quantity |
| `enumValues` | нет | Список значений для enum |
| `sensitivity` | да | Уровень чувствительности |
| `status` | да | `stable` \| `draft` \| `deprecated` |
| `title` | да | `{ ru, en }` |
| `description` | нет | `{ ru, en }` |

## Показание (reading)

Минимальная логическая запись значения (транспорт не нормируется):

```json
{
  "type": "std:env.temperature",
  "unit": "Cel",
  "enc": "f32",
  "v": 23.4,
  "t": 1738860000
}
```

| Поле | Описание |
|------|----------|
| `type` | Идентификатор типа |
| `unit` | UCUM единицы (должна быть совместима с карточкой) |
| `enc` | Encoding из списка карточки |
| `v` | Значение |
| `t` | Время (Unix seconds, UTC), опционально |

## Профиль устройства

Профиль (`registry/profiles/*.yaml`) перечисляет обязательные и опциональные типы для класса устройств. Производитель заявляет совместимость списком `typeId`, а не маркетинговым названием.
