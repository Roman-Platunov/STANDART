# Contributing to STANDART

## Propose a new parameter

1. Search `registry/types/` and `registry/manifest.json` — ensure the meaning is not already covered (`path` or fingerprint).
2. **Single type:** add `registry/types/<path>.yaml`, or **batch:** append to a seed in `registry/seeds/` and run `npm run expand`.
3. For a hand-written card, generate `fingerprint` and `sid`:

```bash
node -e "import { computeFingerprint, deriveSid } from './tools/lib/fingerprint.mjs'; const fp=computeFingerprint({kind:'quantity',unit:'Cel',path:'physical.environment.example'}); console.log(fp, deriveSid(fp));"
```

4. Optionally set `aliases.ru`, `aliases.short`.
5. Run:

```bash
npm run build
# or after editing seeds:
npm run expand
```

6. Open a pull request. Validator rejects duplicate `path`, `sid`, `fingerprint`, or aliases. Similar paths produce warnings and may need maintainer review.

## Rules

- Do not change the meaning of a `stable` path or reuse a `sid`.
- Prefer deeper paths over inventing a parallel root for the same concept.
- Transport protocols are out of scope — STANDART identifies **data**, not wires.
