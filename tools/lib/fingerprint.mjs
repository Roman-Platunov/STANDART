/**
 * Fingerprint and short-id derivation for STANDART cards.
 */
import crypto from "node:crypto";
import { normalizeKind, normalizePath, normalizeUnit } from "./normalize.mjs";

/**
 * @param {{ kind: string, unit: string, path: string }} card
 * @returns {string} fingerprint as `sha256:<hex>`
 */
export function computeFingerprint({ kind, unit, path }) {
  const k = normalizeKind(kind);
  const u = normalizeUnit(unit);
  const p = normalizePath(path);
  const material = `${k}|${u}|${p}`;
  const hex = crypto.createHash("sha256").update(material, "utf8").digest("hex");
  return `sha256:${hex}`;
}

/**
 * Derive 8-char hex sid from fingerprint (first 8 of digest).
 * @param {string} fingerprint `sha256:<hex>` or bare hex
 * @returns {string}
 */
export function deriveSid(fingerprint) {
  const hex = fingerprint.startsWith("sha256:")
    ? fingerprint.slice("sha256:".length)
    : fingerprint;
  if (!/^[0-9a-f]{64}$/.test(hex)) {
    throw new Error(`invalid fingerprint: ${fingerprint}`);
  }
  return hex.slice(0, 8);
}

/**
 * Verify stored fingerprint matches recomputed value.
 */
export function verifyFingerprint(card) {
  const expected = computeFingerprint(card);
  return card.fingerprint === expected;
}
