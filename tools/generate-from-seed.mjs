#!/usr/bin/env node
/**
 * Generate registry type cards from seed JSON files.
 * Usage: node tools/generate-from-seed.mjs [seed.json ...]
 * Default: all files in registry/seeds/*.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { computeFingerprint, deriveSid } from "./lib/fingerprint.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const typesDir = path.join(root, "registry", "types");

function loadExistingSids() {
  const used = new Set();
  if (!fs.existsSync(typesDir)) return used;
  for (const f of fs.readdirSync(typesDir).filter((x) => x.endsWith(".yaml"))) {
    const card = YAML.parse(fs.readFileSync(path.join(typesDir, f), "utf8"));
    if (card?.sid) used.add(card.sid);
    if (card?.path) {
      /* keep */
    }
  }
  return used;
}

function loadExistingPaths() {
  const used = new Map();
  if (!fs.existsSync(typesDir)) return used;
  for (const f of fs.readdirSync(typesDir).filter((x) => x.endsWith(".yaml"))) {
    const card = YAML.parse(fs.readFileSync(path.join(typesDir, f), "utf8"));
    if (card?.path) used.set(card.path, f);
  }
  return used;
}

function allocateSid(fingerprint, usedSids) {
  const hex = fingerprint.replace("sha256:", "");
  for (let i = 0; i <= hex.length - 8; i++) {
    const candidate = hex.slice(i, i + 8);
    if (!usedSids.has(candidate)) {
      usedSids.add(candidate);
      return candidate;
    }
  }
  throw new Error(`cannot allocate sid for ${fingerprint}`);
}

function shortAlias(p) {
  const parts = p.split(".");
  return parts.slice(-2).join(".");
}

function writeCard(def, usedSids, existingPaths, stats) {
  const pathStr = def.path;
  if (existingPaths.has(pathStr)) {
    stats.skipped += 1;
    return;
  }

  const unit = def.unit ?? "-";
  const kind = def.kind;
  const fingerprint = computeFingerprint({ kind, unit, path: pathStr });
  const sid = allocateSid(fingerprint, usedSids);

  const card = {
    sid,
    path: pathStr,
    aliases: {
      ...(def.aliasesRu ? { ru: def.aliasesRu } : {}),
      short: def.short || shortAlias(pathStr),
      ...(def.legacy ? { legacy: def.legacy } : {}),
    },
    kind,
    unit,
    encodings: def.encodings || defaultEncodings(kind),
    sensitivity: def.sensitivity || "public",
    status: def.status || "stable",
    title: {
      ru: def.titleRu || def.titleEn || pathStr,
      en: def.titleEn || pathStr,
    },
    fingerprint,
  };

  if (def.descriptionRu || def.descriptionEn) {
    card.description = {
      ru: def.descriptionRu || def.descriptionEn,
      en: def.descriptionEn || def.descriptionRu,
    };
  }
  if (def.range) card.range = def.range;
  if (def.enumValues) card.enumValues = def.enumValues;

  if (Object.keys(card.aliases).length === 0) delete card.aliases;

  const outName = `${pathStr}.yaml`;
  fs.writeFileSync(path.join(typesDir, outName), YAML.stringify(card, { lineWidth: 0 }));
  existingPaths.set(pathStr, outName);
  stats.created += 1;
}

function defaultEncodings(kind) {
  switch (kind) {
    case "quantity":
      return ["f32", "f64"];
    case "identity":
      return ["utf8"];
    case "temporal":
      return ["i32", "f64"];
    case "spatial":
      return ["record"];
    case "logical":
      return ["bool", "u8"];
    case "enum":
      return ["enum", "utf8"];
    case "command":
      return ["enum", "utf8"];
    case "media":
      return ["utf8"];
    case "event":
      return ["utf8", "record"];
    case "structured":
      return ["record"];
    default:
      return ["f32", "utf8"];
  }
}

function main() {
  const seedsDir = path.join(root, "registry", "seeds");
  let files = process.argv.slice(2);
  if (files.length === 0) {
    files = fs
      .readdirSync(seedsDir)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map((f) => path.join(seedsDir, f));
  }

  const usedSids = loadExistingSids();
  const existingPaths = loadExistingPaths();
  const stats = { created: 0, skipped: 0 };

  for (const file of files) {
    const abs = path.isAbsolute(file) ? file : path.join(root, file);
    const seed = JSON.parse(fs.readFileSync(abs, "utf8"));
    const items = seed.types || seed;
    if (!Array.isArray(items)) throw new Error(`bad seed: ${abs}`);
    for (const def of items) {
      writeCard(def, usedSids, existingPaths, stats);
    }
    console.log(`seed ${path.basename(abs)}: processed ${items.length}`);
  }

  console.log(
    `generate-from-seed OK: created ${stats.created}, skipped existing ${stats.skipped}, total sids ${usedSids.size}`
  );
}

main();
