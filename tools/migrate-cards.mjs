#!/usr/bin/env node
/**
 * One-shot migration: v0.1 cards (id/domain/defaultUnit) → v0.2 (path/sid/fingerprint).
 * Safe to re-run: if card already has path+sid+fingerprint, skip.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { computeFingerprint, deriveSid } from "./lib/fingerprint.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const typesDir = path.join(root, "registry", "types");

/** Map legacy std:domain.type → hierarchical path */
const PATH_MAP = {
  "std:env.temperature": "physical.environment.temperature",
  "std:env.humidity": "physical.environment.humidity",
  "std:env.pressure": "physical.environment.pressure",
  "std:env.illuminance": "physical.environment.illuminance",
  "std:env.co2": "physical.environment.co2",
  "std:env.voc": "physical.environment.voc",
  "std:env.pm25": "physical.environment.pm25",
  "std:elec.voltage": "physical.electrical.voltage",
  "std:elec.current": "physical.electrical.current",
  "std:elec.power": "physical.electrical.power",
  "std:elec.energy": "physical.electrical.energy",
  "std:elec.frequency": "physical.electrical.frequency",
  "std:elec.battery_soc": "physical.electrical.battery_soc",
  "std:mech.force": "physical.mechanical.force",
  "std:mech.torque": "physical.mechanical.torque",
  "std:mech.pressure_gauge": "physical.mechanical.pressure_gauge",
  "std:mech.flow": "physical.mechanical.flow",
  "std:motion.position": "physical.motion.position",
  "std:motion.velocity": "physical.motion.velocity",
  "std:motion.acceleration": "physical.motion.acceleration",
  "std:motion.rotation": "physical.motion.rotation",
  "std:geo.geopoint": "physical.geo.geopoint",
  "std:geo.altitude": "physical.geo.altitude",
  "std:geo.heading": "physical.geo.heading",
  "std:health.heart_rate": "physical.health.heart_rate",
  "std:health.spo2": "physical.health.spo2",
  "std:health.body_temp": "physical.health.body_temp",
  "std:id.device": "identity.device",
  "std:id.serial": "identity.serial",
  "std:id.mac": "identity.mac",
  "std:id.uuid": "identity.uuid",
  "std:time.timestamp": "temporal.timestamp",
  "std:time.duration": "temporal.duration",
  "std:logical.flag": "logical.flag",
  "std:logical.level": "logical.level",
  "std:logical.mode": "logical.mode",
  "std:act.setpoint": "actuation.setpoint",
  "std:act.command": "actuation.command",
  "std:act.power": "actuation.power",
  "std:media.image_ref": "media.image_ref",
  "std:media.audio_ref": "media.audio_ref",
  "std:net.rssi": "network.rssi",
  "std:net.uptime": "network.uptime",
};

function shortAlias(p) {
  const parts = p.split(".");
  return parts.slice(-2).join(".");
}

function migrateCard(card, file) {
  if (card.path && card.sid && card.fingerprint && !card.id) {
    return { card, changed: false };
  }

  const legacyId = card.id || card.aliases?.legacy;
  if (!legacyId && !card.path) {
    throw new Error(`${file}: cannot migrate without id or path`);
  }

  const pathStr = card.path || PATH_MAP[legacyId];
  if (!pathStr) {
    throw new Error(`${file}: no path mapping for ${legacyId}`);
  }

  const unit = card.unit ?? card.defaultUnit ?? "-";
  const kind = card.kind;
  const fingerprint = computeFingerprint({ kind, unit, path: pathStr });
  const sid = card.sid || deriveSid(fingerprint);

  const next = {
    sid,
    path: pathStr,
    aliases: {
      ...(card.aliases || {}),
      legacy: legacyId || card.aliases?.legacy,
      short: card.aliases?.short || shortAlias(pathStr),
    },
    kind,
    unit,
    encodings: card.encodings,
    sensitivity: card.sensitivity,
    status: card.status,
    title: card.title,
  };

  if (card.description) next.description = card.description;
  if (card.range) {
    next.range = {
      min: card.range.min,
      max: card.range.max,
    };
    if (card.range.unit) next.range.unit = card.range.unit;
  }
  if (card.enumValues) next.enumValues = card.enumValues;
  next.fingerprint = fingerprint;

  // Drop empty legacy
  if (!next.aliases.legacy) delete next.aliases.legacy;
  if (!next.aliases.ru) {
    /* keep only defined */
  }
  if (Object.keys(next.aliases).length === 0) delete next.aliases;

  return { card: next, changed: true };
}

function main() {
  const usedSids = new Map();
  const files = fs.readdirSync(typesDir).filter((f) => f.endsWith(".yaml"));
  let changed = 0;

  for (const f of files) {
    const full = path.join(typesDir, f);
    const card = YAML.parse(fs.readFileSync(full, "utf8"));
    const { card: next, changed: did } = migrateCard(card, f);

    if (usedSids.has(next.sid)) {
      // Collision: append suffix from path hash bytes
      let n = 1;
      let candidate = next.sid;
      while (usedSids.has(candidate)) {
        const hex = next.fingerprint.replace("sha256:", "");
        candidate = hex.slice(n, n + 8);
        n += 1;
        if (n > 50) throw new Error(`sid collision unrecoverable for ${f}`);
      }
      next.sid = candidate;
    }
    usedSids.set(next.sid, next.path);

    const out = YAML.stringify(next, { lineWidth: 0 });
    fs.writeFileSync(full, out);
    if (did) changed += 1;

    // Rename file to path-based name if still legacy-named
    const desired = `${next.path}.yaml`;
    if (f !== desired) {
      const dest = path.join(typesDir, desired);
      fs.renameSync(full, dest);
      console.log(`renamed ${f} → ${desired}`);
    }
  }

  console.log(`migrate-cards: ${files.length} cards, ${changed} rewritten`);
}

main();
