# Contributing to STANDART

## Propose a new parameter

1. Search `registry/types/` and `registry/manifest.json` — ensure the meaning is not already covered (`path` or fingerprint).
2. Add `registry/types/<path>.yaml` with at least: `path`, `kind`, `unit`, `encodings`, `sensitivity`, `status`, `title` (ru/en).
3. Generate `fingerprint` and `sid`:

```bash
node -e "import { computeFingerprint, deriveSid } from './tools/lib/fingerprint.mjs'; const fp=computeFingerprint({kind:'quantity',unit:'Cel',path:'physical.environment.example'}); console.log(fp, deriveSid(fp));"
```

4. Optionally set `aliases.ru`, `aliases.short`.
5. Run:

```bash
npm run build
```

6. Open a pull request. CI / validator rejects duplicate `path`, `sid`, `fingerprint`, or aliases. Similar paths produce warnings and may need maintainer review.

## Rules

- Do not change the meaning of a `stable` path or reuse a `sid`.
- Prefer deeper paths over inventing a parallel root for the same concept.
- Transport protocols are out of scope — STANDART identifies **data**, not wires.
