#!/usr/bin/env node
/**
 * Validate STANDART v0.2 registry: schema fields, fingerprints, uniqueness.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { normalizePath } from "./lib/normalize.mjs";
import { computeFingerprint, deriveSid } from "./lib/fingerprint.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const strictSimilar = process.argv.includes("--strict-similar");

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
const SID_RE = /^[0-9a-f]{8}$/;
const FP_RE = /^sha256:[0-9a-f]{64}$/;
const SEMVER_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function readYaml(filePath) {
  return YAML.parse(fs.readFileSync(filePath, "utf8"));
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

function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function validateTypeCard(card, file, unitCodes) {
  for (const k of [
    "sid",
    "path",
    "kind",
    "unit",
    "encodings",
    "sensitivity",
    "status",
    "title",
    "fingerprint",
  ]) {
    if (card[k] === undefined || card[k] === null) fail(`${file}: missing '${k}'`);
  }
  if (card.sid && !SID_RE.test(card.sid)) fail(`${file}: invalid sid`);
  if (card.kind && !KINDS.has(card.kind)) fail(`${file}: unknown kind`);
  if (card.sensitivity && !SENSITIVITY.has(card.sensitivity)) {
    fail(`${file}: unknown sensitivity`);
  }
  if (card.status && !STATUS.has(card.status)) fail(`${file}: unknown status`);
  if (!isLocalized(card.title)) fail(`${file}: title needs ru/en`);
  if (card.description !== undefined && !isLocalized(card.description)) {
    fail(`${file}: description needs ru/en`);
  }
  if (!Array.isArray(card.encodings) || card.encodings.length === 0) {
    fail(`${file}: encodings required`);
  } else {
    for (const e of card.encodings) {
      if (!ENCODINGS.has(e)) fail(`${file}: unknown encoding '${e}'`);
    }
  }
  if (card.unit && !unitCodes.has(card.unit)) {
    fail(`${file}: unknown unit '${card.unit}'`);
  }
  if (card.fingerprint && !FP_RE.test(card.fingerprint)) {
    fail(`${file}: invalid fingerprint format`);
  }
  if (card.path && card.kind && card.unit) {
    try {
      normalizePath(card.path);
      const expected = computeFingerprint({
        kind: card.kind,
        unit: card.unit,
        path: card.path,
      });
      if (card.fingerprint && card.fingerprint !== expected) {
        fail(`${file}: fingerprint mismatch (expected ${expected})`);
      }
      const expectedSid = deriveSid(expected);
      // sid may differ from first-8 if collision resolved — only warn if not prefix of fingerprint
      if (card.sid && !card.fingerprint?.includes(card.sid) && card.sid !== expectedSid) {
        warn(`${file}: sid '${card.sid}' is not derived from fingerprint (allowed if collision)`);
      }
    } catch (e) {
      fail(`${file}: ${e.message}`);
    }
  }
  if (card.kind === "enum" && (!card.enumValues || card.enumValues.length === 0)) {
    fail(`${file}: enum kind requires enumValues`);
  }
}

function main() {
  const domainsDoc = readYaml(path.join(root, "registry", "domains.yaml"));
  const unitsDoc = readYaml(path.join(root, "registry", "units.yaml"));
  const versionDoc = readYaml(path.join(root, "registry", "version.yaml"));

  if (!versionDoc?.version || !SEMVER_RE.test(versionDoc.version)) {
    fail("registry/version.yaml: invalid version");
  }

  const unitCodes = new Set((unitsDoc.units || []).map((u) => u.code));
  if (unitCodes.size === 0) fail("registry/units.yaml: no units");

  let thesaurus = { synonyms: [] };
  const thesaurusPath = path.join(root, "registry", "thesaurus.yaml");
  if (fs.existsSync(thesaurusPath)) {
    thesaurus = readYaml(thesaurusPath) || thesaurus;
  }

  const typesDir = path.join(root, "registry", "types");
  const typeFiles = fs.readdirSync(typesDir).filter((f) => f.endsWith(".yaml"));
  if (typeFiles.length === 0) fail("registry/types: empty");

  const bySid = new Map();
  const byPath = new Map();
  const byFp = new Map();
  const byAlias = new Map();
  const cards = [];

  for (const f of typeFiles) {
    const file = path.join("registry", "types", f);
    const card = readYaml(path.join(root, file));
    validateTypeCard(card, file, unitCodes);
    cards.push({ file, card });

    if (card.sid) {
      if (bySid.has(card.sid)) fail(`${file}: duplicate sid with ${bySid.get(card.sid)}`);
      bySid.set(card.sid, file);
    }
    if (card.path) {
      const np = normalizePath(card.path);
      if (byPath.has(np)) fail(`${file}: duplicate path with ${byPath.get(np)}`);
      byPath.set(np, file);
    }
    if (card.fingerprint) {
      if (byFp.has(card.fingerprint)) {
        fail(`${file}: duplicate fingerprint with ${byFp.get(card.fingerprint)}`);
      }
      byFp.set(card.fingerprint, file);
    }
    if (card.aliases) {
      for (const [k, v] of Object.entries(card.aliases)) {
        if (!v) continue;
        const key = `${k}:${v}`;
        if (byAlias.has(key)) fail(`${file}: duplicate alias ${key} with ${byAlias.get(key)}`);
        byAlias.set(key, file);
      }
    }
  }

  // Soft similarity
  const paths = cards.map((c) => c.card.path).filter(Boolean);
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      const a = paths[i];
      const b = paths[j];
      const dist = editDistance(a, b);
      if (dist > 0 && dist <= 3 && a.length > 8 && b.length > 8) {
        warn(`similar paths (distance ${dist}): '${a}' ~ '${b}'`);
      }
      for (const group of thesaurus.synonyms || []) {
        const segsA = new Set(a.split("."));
        const segsB = new Set(b.split("."));
        const hitA = group.some((s) => segsA.has(s));
        const hitB = group.some((s) => segsB.has(s));
        if (hitA && hitB) {
          const restA = a.split(".").filter((s) => !group.includes(s)).join(".");
          const restB = b.split(".").filter((s) => !group.includes(s)).join(".");
          if (restA === restB) {
            warn(`thesaurus near-duplicate: '${a}' ~ '${b}' (${group.join("/")})`);
          }
        }
      }
    }
  }

  const profilesDir = path.join(root, "registry", "profiles");
  const profileFiles = fs.readdirSync(profilesDir).filter((f) => f.endsWith(".yaml"));
  const profileIds = new Set();
  for (const f of profileFiles) {
    const file = path.join("registry", "profiles", f);
    const profile = readYaml(path.join(root, file));
    if (!profile.id) fail(`${file}: missing id`);
    if (profileIds.has(profile.id)) fail(`${file}: duplicate profile id`);
    profileIds.add(profile.id);
    if (!isLocalized(profile.title)) fail(`${file}: title needs ru/en`);
    for (const sid of profile.required || []) {
      if (!bySid.has(sid)) fail(`${file}: unknown required sid '${sid}'`);
    }
    for (const sid of profile.optional || []) {
      if (!bySid.has(sid)) fail(`${file}: unknown optional sid '${sid}'`);
      if ((profile.required || []).includes(sid)) {
        fail(`${file}: sid '${sid}' in both required and optional`);
      }
    }
  }

  // domains.yaml still optional guidance
  if (!(domainsDoc.domains || []).length) warn("domains.yaml empty");

  if (warnings.length) {
    console.warn(`STANDART validate warnings (${warnings.length}):`);
    for (const w of warnings) console.warn(`  ! ${w}`);
  }

  if (errors.length) {
    console.error(`STANDART validate FAILED (${errors.length}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  if (strictSimilar && warnings.length) {
    console.error("STANDART validate FAILED: --strict-similar with warnings");
    process.exit(1);
  }

  console.log(
    `STANDART validate OK: ${bySid.size} types, ${profileIds.size} profiles, registry ${versionDoc.version}`
  );
}

main();
