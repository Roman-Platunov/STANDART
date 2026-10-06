#!/usr/bin/env node
/**
 * Build registry/manifest.json with registry_checksum.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function readYaml(p) {
  return YAML.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const versionDoc = readYaml(path.join(root, "registry", "version.yaml"));
  const typesDir = path.join(root, "registry", "types");
  const files = fs.readdirSync(typesDir).filter((f) => f.endsWith(".yaml"));

  const entries = files
    .map((f) => {
      const card = readYaml(path.join(typesDir, f));
      return {
        sid: card.sid,
        path: card.path,
        fingerprint: card.fingerprint,
      };
    })
    .sort((a, b) => a.sid.localeCompare(b.sid));

  const canonical = JSON.stringify(entries);
  const registry_checksum =
    "sha256:" + crypto.createHash("sha256").update(canonical, "utf8").digest("hex");

  const manifest = {
    version: versionDoc.version,
    entries,
    registry_checksum,
  };

  const out = path.join(root, "registry", "manifest.json");
  fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `STANDART manifest OK: ${entries.length} entries, checksum ${registry_checksum.slice(0, 22)}…`
  );
}

main();
