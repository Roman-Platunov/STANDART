# Таксономия v0.2

## Дерево path

Свободное дерево. Корневые сегменты-ориентиры (не жёсткий enum):

| Корень | Смысл |
|--------|--------|
| `physical` | Физические величины (среда, электрика, механика, geo, health…) |
| `identity` | Идентификаторы |
| `temporal` | Время |
| `logical` | Флаги, уровни, режимы |
| `actuation` | Команды и уставки |
| `media` | Ссылки на медиа |
| `network` | Сеть |

Примеры:

- `physical.environment.temperature`
- `physical.electrical.voltage`
- `identity.device`
- `actuation.power`

## Kinds и encodings

См. схему `schema/type.schema.json` — без изменений по смыслу относительно v0.1 (`quantity`, `enum`, `f32`, …).

## Единицы

Канон — UCUM в поле `unit` (`registry/units.yaml`). Сегмент path может дублировать смысл для человека (`…temperature`), машина опирается на `unit`.
