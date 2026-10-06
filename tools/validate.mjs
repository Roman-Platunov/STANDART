#!/usr/bin/env node
/**
 * Validate STANDART registry YAML against JSON Schema and cross-references.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const KINDS = new Set([
  "quantity",
  "enum",
  "identity",
  "temporal",
  "spatial",
  "logical",
  "media",
  "structured",
  "event",
  "command",
]);
const ENCODINGS = new Set([
  "bool",
  "u8",
  "i16",
  "i32",
  "f32",
  "f64",
  "utf8",
  "bytes",
  "record",
  "enum",
]);
const SENSITIVITY = new Set(["public", "internal", "personal", "restricted"]);
const STATUS = new Set(["stable", "draft", "deprecated"]);
const ID_RE = /^std:[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/;
const PROFILE_ID_RE = /^[a-z][a-z0-9_]*$/;
const SEMVER_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;

const errors = [];

function fail(msg) {
  errors.push(msg);
}

function readYaml(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return YAML.parse(text);
}

function isLocalized(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.ru === "string" &&
    obj.ru.length > 0 &&
    typeof obj.en === "string" &&
    obj.en.length > 0
  );
}

function validateTypeCard(card, file) {
  const req = [
    "id",
    "kind",
    "domain",
    "defaultUnit",
    "encodings",
    "sensitivity",
    "status",
    "title",
  ];
  for (const k of req) {
    if (card[k] === undefined || card[k] === null) {
      fail(`${file}: missing required field '${k}'`);
    }
  }
  if (card.id && !ID_RE.test(card.id)) {
    fail(`${file}: invalid id '${card.id}'`);
  }
  if (card.kind && !KINDS.has(card.kind)) {
    fail(`${file}: unknown kind '${card.kind}'`);
  }
  if (card.sensitivity && !SENSITIVITY.has(card.sensitivity)) {
    fail(`${file}: unknown sensitivity '${card.sensitivity}'`);
  }
  if (card.status && !STATUS.has(card.status)) {
    fail(`${file}: unknown status '${card.status}'`);
  }
  if (!isLocalized(card.title)) {
    fail(`${file}: title must have non-empty ru and en`);
  }
  if (card.description !== undefined && !isLocalized(card.description)) {
    fail(`${file}: description must have non-empty ru and en`);
  }
  if (!Array.isArray(card.encodings) || card.encodings.length === 0) {
    fail(`${file}: encodings must be a non-empty array`);
  } else {
    for (const e of card.encodings) {
      if (!ENCODINGS.has(e)) fail(`${file}: unknown encoding '${e}'`);
    }
  }
  if (card.range) {
    const { min, max, unit } = card.range;
    if (typeof min !== "number" || typeof max !== "number" || typeof unit !== "string") {
      fail(`${file}: range must be { min:number, max:number, unit:string }`);
    } else if (min > max) {
      fail(`${file}: range.min > range.max`);
    }
  }
  if (card.kind === "enum" && (!Array.isArray(card.enumValues) || card.enumValues.length === 0)) {
    fail(`${file}: enum kind requires enumValues`);
  }
  if (card.id && card.domain) {
    const expectedPrefix = `std:${card.domain}.`;
    if (!card.id.startsWith(expectedPrefix)) {
      fail(`${file}: id '${card.id}' does not match domain '${card.domain}'`);
    }
  }
}

function validateProfile(profile, file, typeIds) {
  if (!profile.id || !PROFILE_ID_RE.test(profile.id)) {
    fail(`${file}: invalid profile id`);
  }
  if (!profile.version || !SEMVER_RE.test(profile.version)) {
    fail(`${file}: invalid version`);
  }
  if (!isLocalized(profile.title)) {
    fail(`${file}: title must have non-empty ru and en`);
  }
  if (!Array.isArray(profile.required) || profile.required.length === 0) {
    fail(`${file}: required types missing`);
  } else {
    for (const tid of profile.required) {
      if (!typeIds.has(tid)) fail(`${file}: unknown required type '${tid}'`);
    }
  }
  if (profile.optional) {
    for (const tid of profile.optional) {
      if (!typeIds.has(tid)) fail(`${file}: unknown optional type '${tid}'`);
      if (profile.required.includes(tid)) {
        fail(`${file}: type '${tid}' listed in both required and optional`);
      }
    }
  }
}

function main() {
  const domainsDoc = readYaml(path.join(root, "registry", "domains.yaml"));
  const unitsDoc = readYaml(path.join(root, "registry", "units.yaml"));
  const versionDoc = readYaml(path.join(root, "registry", "version.yaml"));

  if (!versionDoc?.version || !SEMVER_RE.test(versionDoc.version)) {
    fail("registry/version.yaml: invalid version");
  }

  const domainCodes = new Set((domainsDoc.domains || []).map((d) => d.code));
  if (domainCodes.size === 0) fail("registry/domains.yaml: no domains");

  const unitCodes = new Set((unitsDoc.units || []).map((u) => u.code));
  if (unitCodes.size === 0) fail("registry/units.yaml: no units");

  const typesDir = path.join(root, "registry", "types");
  const typeFiles = fs.readdirSync(typesDir).filter((f) => f.endsWith(".yaml"));
  if (typeFiles.length === 0) fail("registry/types: no type cards");

  const typeIds = new Set();
  for (const f of typeFiles) {
    const file = path.join("registry", "types", f);
    const card = readYaml(path.join(root, file));
    validateTypeCard(card, file);
    if (card.domain && !domainCodes.has(card.domain)) {
      fail(`${file}: unknown domain '${card.domain}'`);
    }
    if (card.defaultUnit && !unitCodes.has(card.defaultUnit)) {
      fail(`${file}: unknown defaultUnit '${card.defaultUnit}'`);
    }
    if (card.range?.unit && !unitCodes.has(card.range.unit)) {
      fail(`${file}: unknown range.unit '${card.range.unit}'`);
    }
    if (card.id) {
      if (typeIds.has(card.id)) fail(`${file}: duplicate id '${card.id}'`);
      typeIds.add(card.id);
    }
  }

  const profilesDir = path.join(root, "registry", "profiles");
  const profileFiles = fs.readdirSync(profilesDir).filter((f) => f.endsWith(".yaml"));
  if (profileFiles.length === 0) fail("registry/profiles: no profiles");

  const profileIds = new Set();
  for (const f of profileFiles) {
    const file = path.join("registry", "profiles", f);
    const profile = readYaml(path.join(root, file));
    validateProfile(profile, file, typeIds);
    if (profile.id) {
      if (profileIds.has(profile.id)) fail(`${file}: duplicate profile id`);
      profileIds.add(profile.id);
    }
  }

  // Schema files exist
  for (const s of ["type.schema.json", "profile.schema.json"]) {
    const p = path.join(root, "schema", s);
    if (!fs.existsSync(p)) fail(`missing schema/${s}`);
  }

  if (errors.length) {
    console.error(`STANDART validate FAILED (${errors.length} error(s)):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log(
    `STANDART validate OK: ${typeIds.size} types, ${profileIds.size} profiles, registry ${versionDoc.version}`
  );
}

main();
