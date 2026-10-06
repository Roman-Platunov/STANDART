# Contributing to STANDART

Thank you for helping grow an open type registry for devices.

## How to propose a new type

1. Check that a similar type does not already exist in `registry/types/`.
2. Add a YAML card following existing files and `schema/type.schema.json`.
3. Use a stable id: `std:<domain>.<name>` (lowercase, `_` allowed).
4. Prefer UCUM units listed in `registry/units.yaml` (add a unit if needed).
5. Provide bilingual `title` / `description` (`ru` and `en`).
6. Set `status: draft` for brand-new types unless maintainers agree on `stable`.
7. Run validation:

```bash
npm install
npm run validate
npm run codegen
```

8. Open a pull request describing why the type is needed and which devices use it.

## How to propose a device profile

1. Add `registry/profiles/<name>.yaml`.
2. Reference only registered type ids.
3. Keep `required` minimal; put nice-to-have types in `optional`.

## Rules

- Never change the meaning of an existing `stable` type id.
- Never reuse a deprecated id.
- Incompatible changes require a new id and deprecation of the old one.
- Transport protocols are out of scope; STANDART is about types.

## Code of conduct

Be respectful. Assume good intent. Prefer concrete examples over abstract debate.
