# Идентификаторы

## path

```
segment.segment.segment…
```

- Латиница lowercase, цифры, `_`
- Глубина ≥ 2
- Стабилен после `stable`: смысл не меняют

## sid

- 8 hex-символов, обычно первые 8 от fingerprint
- При коллизии — другой срез хеша
- Не переиспользуется после `deprecated`
- Основное поле в обмене

## fingerprint

```
sha256_hex( kind + "|" + unit + "|" + normalize(path) )
```

Хранится как `sha256:<hex>`. Два параметра с одним fingerprint — дубли; валидатор отклоняет.

## manifest

`registry/manifest.json` содержит все `sid/path/fingerprint` и `registry_checksum` — целостность копии библиотеки.

## legacy

Алиас `aliases.legacy` (например `std:env.temperature`) — только миграция с v0.1.
