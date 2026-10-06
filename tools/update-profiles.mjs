#!/usr/bin/env node
/**
 * Rewrite profiles to use sids (look up by legacy std: alias).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PROFILE_LEGACY = {
  thermometer: {
    required: ["std:env.temperature", "std:id.device"],
    optional: [
      "std:env.humidity",
      "std:time.timestamp",
      "std:elec.battery_soc",
      "std:net.rssi",
    ],
  },
  meter: {
    required: [
      "std:elec.voltage",
      "std:elec.current",
      "std:elec.power",
      "std:id.device",
    ],
    optional: [
      "std:elec.energy",
      "std:elec.frequency",
      "std:time.timestamp",
      "std:net.uptime",
    ],
  },
  gps: {
    required: ["std:geo.geopoint", "std:id.device"],
    optional: [
      "std:geo.altitude",
      "std:geo.heading",
      "std:motion.velocity",
      "std:time.timestamp",
      "std:elec.battery_soc",
      "std:net.rssi",
    ],
  },
  actuator: {
    required: ["std:act.power", "std:id.device"],
    optional: [
      "std:act.command",
      "std:act.setpoint",
      "std:logical.mode",
      "std:logical.level",
      "std:time.timestamp",
      "std:net.uptime",
    ],
  },
};

function main() {
  const typesDir = path.join(root, "registry", "types");
  const legacyToSid = new Map();
  for (const f of fs.readdirSync(typesDir).filter((x) => x.endsWith(".yaml"))) {
    const card = YAML.parse(fs.readFileSync(path.join(typesDir, f), "utf8"));
    if (card.aliases?.legacy) legacyToSid.set(card.aliases.legacy, card.sid);
  }

  const profilesDir = path.join(root, "registry", "profiles");
  for (const [id, spec] of Object.entries(PROFILE_LEGACY)) {
    const file = path.join(profilesDir, `${id}.yaml`);
    const profile = YAML.parse(fs.readFileSync(file, "utf8"));
    const mapList = (list) =>
      list.map((legacy) => {
        const sid = legacyToSid.get(legacy);
        if (!sid) throw new Error(`${id}: missing sid for ${legacy}`);
        return sid;
      });
    profile.version = "0.2.0";
    profile.required = mapList(spec.required);
    profile.optional = mapList(spec.optional);
    fs.writeFileSync(file, YAML.stringify(profile, { lineWidth: 0 }));
    console.log(`updated profile ${id}`);
  }
}

main();
