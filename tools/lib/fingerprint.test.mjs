import assert from "node:assert/strict";
import { computeFingerprint, deriveSid } from "./fingerprint.mjs";
import { normalizePath } from "./normalize.mjs";

const fp = computeFingerprint({
  kind: "quantity",
  unit: "Cel",
  path: "physical.environment.temperature",
});
assert.match(fp, /^sha256:[0-9a-f]{64}$/);

const fp2 = computeFingerprint({
  kind: "Quantity",
  unit: "Cel",
  path: "Physical.Environment.Temperature",
});
assert.equal(fp, fp2, "normalization must be stable");

const sid = deriveSid(fp);
assert.match(sid, /^[0-9a-f]{8}$/);
assert.equal(sid, fp.slice("sha256:".length, "sha256:".length + 8));

assert.equal(
  normalizePath("  Physical.Environment.Air  "),
  "physical.environment.air"
);

let threw = false;
try {
  normalizePath("temperature");
} catch {
  threw = true;
}
assert.equal(threw, true, "depth < 2 must throw");

console.log("fingerprint.test.mjs OK");
